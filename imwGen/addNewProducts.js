const express = require('express')
const router = express.Router()

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.TEST_STUFF_T0D_HOST,
  user: process.env.TEST_STUFF_T0D_USER,
  password: process.env.TEST_STUFF_T0D_PW,
  database: process.env.TEST_STUFF_T0D_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  addNewProducts: router.post('/addNewProducts', (req, res, next) => {

    const postBody = req.body
    let itemID = postBody['itemIDPost']
    let suppUnitID = postBody['suppUnitIDPost']
    let itemListAccumulator = postBody['itemListAccumulatorPost']
    let imwProductValObj = {} //this holds product values (for one discrete product entry at a time) as an object;
    //it gets stringified & pushed to imwProductArr
    let imwProductArr = [] //this gets sent back to frontend input for itemListAccumulatorPost
    var sanitizedItemListAcc
    let objectifiedImwProdArr = [] //we objectify imwProductArr so it can be easily displayed in the DOM template

    let tableName = postBody['tableNamePost']

    let srsObjArr = []

    function showSearchResults(rows) {
      console.log(`rows.length==>${rows.length}`)
      console.log(`rows==>${rows}`)
      console.log(`JSON.stringify(rows)==>${JSON.stringify(rows)}`)
      for (let i = 0; i < rows.length; i++) {
        let srsObj = {}
        srsObj['pk_t0d'] = rows[i]['pk_t0d']
        srsObj['item_id'] = rows[i]['item_id']
        srsObj['supp_unit_id'] = rows[i]['supp_unit_id']
        srsObjArr.push(srsObj)
        console.log(`srsObjArr==> ${srsObjArr}`)
      }
      // console.log(`srsObj==> ${srsObj}`)
      // console.log(`JSON.stringify(srsObj)==> ${JSON.stringify(srsObj)}`)
    }

    // function queryEDI_Table() {
    //   connection.query(`SELECT * FROM ${tableName};`,
    //     function (err, rows, fields) {
    //       if (err) throw err
    //       showSearchResults(rows)
    //       res.render('vw-imwGenerator', {
    //         title: `vw-imwGenerator`,
    //         imwProductValObj: imwProductValObj,
    //         imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
    //         objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
    //         srsObjArr: srsObjArr,
    //       })
    //     })
    // }

    // if (tableName !== undefined && tableName !== '') {
    //   queryEDI_Table()
    // }

    function itemListAccSanitizer() {
      if (itemListAccumulator !== undefined) {
        let sanitizerRegex1 = /(\\)|(\[)|(\])/g
        let sanitizerRegex2 = /("")/g
        let sanitizerRegex3 = /("{)/g
        let sanitizerRegex4 = /(}")/g
        sanitizedItemListAcc = itemListAccumulator.replace(sanitizerRegex1, "")
          .replace(sanitizerRegex2, `"`).replace(sanitizerRegex3, `{`).replace(sanitizerRegex4, `}`)
        console.log(`sanitizedItemListAcc==> ${sanitizedItemListAcc}`)
      }
    }

    function sanitizedItemListObjGenerator() {
      if (itemListAccumulator !== undefined) {
        itemListAccSanitizer()
        /* X(?=Y) 	Positive lookahead 	X if followed by Y
         * (?<=Y)X 	Positive lookbehind 	X if after Y
         * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
        let splitRegex1 = /(?<=}),(?={)/g
        let sanitizedItemListAccSPLIT = sanitizedItemListAcc.split(splitRegex1)
        for (let i = 0; i < sanitizedItemListAccSPLIT.length; i++) {
          imwProductArr.push(sanitizedItemListAccSPLIT[i])
        }
      }
      imwProductValObj['itemID'] = itemID
      imwProductValObj['suppUnitID'] = suppUnitID
      let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)
      imwProductArr.push(stringifiedImwProductValObj)
    }

    sanitizedItemListObjGenerator() //this sanitizes form input & creates an object from it, which is then stringified and 
    //sent back to imwProductArr on the frontend itemListAccumulatorPost input

    function objectifyImwProductArr() { //this objectifies imwProductArr for easy DOM template display
      for (let i = 0; i < imwProductArr.length; i++) {
        let objectifiedImwProd = JSON.parse(imwProductArr[i])
        objectifiedImwProdArr.push(objectifiedImwProd)
      }
    }

    objectifyImwProductArr()

    console.log(`typeof imwProductArr==> ${typeof imwProductArr}`)
    console.log(`imwProductArr==> ${imwProductArr}`)
    console.log(`typeof imwProductArr[0]==> ${typeof imwProductArr[0]}`)

    function queryEDI_Table() {
      connection.query(`SELECT * FROM ${tableName};`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchResults(rows)
          res.render('vw-imwGenerator', {
            title: `vw-imwGenerator`,
            imwProductValObj: imwProductValObj,
            imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
            objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
            srsObjArr: srsObjArr,
          })
        })
    }

    if (tableName !== undefined && tableName !== '') {
      queryEDI_Table()
      // res.render('vw-imwGenerator', {
      //   title: `vw-imwGenerator`,
      //   imwProductValObj: imwProductValObj,
      //   imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
      //   objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
      //   srsObjArr: srsObjArr,
      // })
    } else {
      res.render('vw-imwGenerator', {
        title: `vw-imwGenerator`,
        imwProductValObj: imwProductValObj,
        imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
        objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
        srsObjArr: srsObjArr,
      })
    }

    // res.render('vw-imwGenerator', {
    //   title: `vw-imwGenerator`,
    //   imwProductValObj: imwProductValObj,
    //   imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
    //   objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
    //   srsObjArr: srsObjArr,
    // })

  })
}