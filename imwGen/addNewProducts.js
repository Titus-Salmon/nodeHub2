const express = require('express')
const router = express.Router()

const mysql = require('mysql')

const sanitizerFuncs = require('../funcLibT0d/sanitizerFuncs')

const connection = mysql.createConnection({ //for home local testing
  host: process.env.TEST_STUFF_T0D_HOST,
  user: process.env.TEST_STUFF_T0D_USER,
  password: process.env.TEST_STUFF_T0D_PW,
  database: process.env.TEST_STUFF_T0D_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

// const connection = mysql.createConnection({ //for work testing
//   host: process.env.NODEHUB_TEST1_HOST,
//   user: process.env.NODEHUB_TEST1_USER,
//   password: process.env.NODEHUB_TEST1_PW,
//   database: process.env.NODEHUB_TEST1_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })


module.exports = {

  addNewProducts: router.post('/addNewProducts', (req, res, next) => {

    const postBody = req.body

    let itemID = postBody['itemIDPost']
    let suppUnitID = postBody['suppUnitIDPost']
    let deptName = postBody['deptNamePost']
    let recptAlias = postBody['recptAliasPost']
    let brand = postBody['brandPost']
    let itemName = postBody['itemNamePost']

    let itemListAccumulator = postBody['itemListAccumulatorPost']
    let imwProductValObj = {} //this holds product values (for one discrete product entry at a time) as an object;
    //it gets stringified & pushed to imwProductArr
    let imwProductArr = [] //this gets sent back to frontend input for itemListAccumulatorPost
    // var sanitizedItemListAcc
    let objectifiedImwProdArr = [] //we objectify imwProductArr so it can be easily displayed in the DOM template

    let tableName = postBody['tableNamePost']
    let srsObjArr = []

    function showSearchResults(rows) {
      // let srsObj = {}
      console.log(`rows.length==>${rows.length}`)
      console.log(`rows==>${rows}`)
      console.log(`JSON.stringify(rows)==>${JSON.stringify(rows)}`)
      for (let i = 0; i < rows.length; i++) {
        let srsObj = {}
        srsObj['pk_t0d'] = rows[i]['pk_t0d']
        srsObj['item_id'] = rows[i]['item_id']
        srsObj['supp_unit_id'] = rows[i]['supp_unit_id']
        srsObj['dept_name'] = rows[i]['dept_name']
        srsObj['recpt_alias'] = rows[i]['recpt_alias']
        srsObj['brand'] = rows[i]['brand']
        srsObj['item_name'] = rows[i]['item_name']
        srsObjArr.push(srsObj)
      }
    }


    // function itemListAccSanitizer() {
    //   if (itemListAccumulator !== undefined) {
    //     console.log(`itemListAccumulator pre-regex==> ${itemListAccumulator}`)
    //     let sanitizerRegex1 = /(\\)|(\[)|(\])/g
    //     // let sanitizerRegex2 = /("")/g couldn't use, because it replaced empty post data ("") with ", which broke
    //     //objectifyImwProductArr() JSON.parse functionality
    //     let sanitizerRegex2a = /("")(?=([^,])|([^:]))/g //X(?=Y) ==> "" if followed by any character that is NOT ,
    //     let sanitizerRegex2b = /(?<=([^,])|([^:]))("")/g //(?<=Y)X ==> "" if after any character that is NOT ,
    //     let sanitizerRegex2c = /(?<=([^,]))("")(?=([^,]))/g
    //     // let sanitizerRegex2d = /(?<=([^:]))("")(?=([^:]))/g
    //     let sanitizerRegex2d = /(?<=([^:]))("")/g
    //     let sanitizerRegex3 = /("{)/g
    //     let sanitizerRegex4 = /(}")/g
    //     sanitizedItemListAcc = itemListAccumulator.replace(sanitizerRegex1, "").replace(sanitizerRegex3, `{`).replace(sanitizerRegex4, `}`)
    //     console.log(`sanitizedItemListAcc==> ${sanitizedItemListAcc}`)
    //   }
    // }

    // function sanitizedItemListObjGenerator() {
    //   if (itemListAccumulator !== undefined) {
    //     itemListAccSanitizer()
    //     /* X(?=Y) 	Positive lookahead 	X if followed by Y
    //      * (?<=Y)X 	Positive lookbehind 	X if after Y
    //      * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
    //     let splitRegex1 = /(?<=}),(?={)/g
    //     let sanitizedItemListAccSPLIT = sanitizedItemListAcc.split(splitRegex1)
    //     for (let i = 0; i < sanitizedItemListAccSPLIT.length; i++) {
    //       imwProductArr.push(sanitizedItemListAccSPLIT[i])
    //     }
    //   }
    //   //if (itemID !== '' || suppUnitID !== '' || deptName !== '' || recptAlias !== '' || brand !== '' || itemName !== '') {
    //   imwProductValObj['itemID'] = itemID
    //   imwProductValObj['suppUnitID'] = suppUnitID
    //   imwProductValObj['deptName'] = deptName
    //   imwProductValObj['recptAlias'] = recptAlias
    //   imwProductValObj['brand'] = brand
    //   imwProductValObj['itemName'] = itemName
    //   let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)
    //   imwProductArr.push(stringifiedImwProductValObj)
    //   //}

    // }

    sanitizerFuncs.sanitizedItemListObjGenerator(itemListAccumulator, sanitizerFuncs.itemListAccSanitizer,
      imwProductArr, imwProductValObj, itemID, suppUnitID, deptName, recptAlias, brand, itemName)

    // sanitizedItemListObjGenerator() //this sanitizes form input & creates an object from it, which is then stringified and 
    // //sent back to imwProductArr on the frontend itemListAccumulatorPost input

    // function objectifyImwProductArr() { //this objectifies imwProductArr for easy DOM template display
    //   for (let i = 0; i < imwProductArr.length; i++) {
    //     if (imwProductArr.length > 0) {
    //       console.log(`typeof imwProductArr[${i}]==> ${typeof imwProductArr[i]}`)
    //       console.log(`imwProductArr[${i}]==> ${imwProductArr[i]}`)
    //       if ((imwProductArr[i]) !== '' && typeof imwProductArr[i] == 'string') {
    //         let objectifiedImwProd = JSON.parse(imwProductArr[i])
    //         objectifiedImwProdArr.push(objectifiedImwProd)
    //       } else {
    //         let objectifiedImwProd = imwProductArr[i]
    //         objectifiedImwProdArr.push(objectifiedImwProd)
    //       }
    //     }
    //   }
    // }

    sanitizerFuncs.objectifyImwProductArr(imwProductArr, objectifiedImwProdArr)

    // objectifyImwProductArr()

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
            srsObjArr: srsObjArr,
            imwProductValObj: imwProductValObj,
            imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
            objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
            tableName: tableName
          })
        })
    }

    if (tableName !== undefined && tableName !== '') {
      queryEDI_Table()
    } else {
      res.render('vw-imwGenerator', {
        title: `vw-imwGenerator`,
        imwProductValObj: imwProductValObj,
        imwProductArr: imwProductArr,
        objectifiedImwProdArr: objectifiedImwProdArr
      })
    }

  })
}