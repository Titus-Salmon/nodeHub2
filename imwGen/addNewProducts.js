const express = require('express')
const router = express.Router()
// const mysql = require('mysql')

// const connection = mysql.createConnection({
//   host: process.env.RB_HOST,
//   user: process.env.RB_USER,
//   password: process.env.RB_PW,
//   database: process.env.RB_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

module.exports = {

  addNewProducts: router.post('/addNewProducts', (req, res, next) => {

    const postBody = req.body
    let itemID = postBody['itemIDPost']
    let suppUnitID = postBody['suppUnitIDPost']
    let itemListAccumulator = postBody['itemListAccumulatorPost']
    let imwProductValObj = {}
    let imwProductArr = []
    var sanitizedItemListAcc
    let objectifiedImwProdArr = []

    // function itemListAccSanitizer() {
    //   if (itemListAccumulator !== undefined) {
    //     let sanitizerRegex1 = /(")|(\\)|(\[)|(\])/g
    //     sanitizedItemListAcc = itemListAccumulator.replace(sanitizerRegex1, "")
    //     console.log(`sanitizedItemListAcc==> ${sanitizedItemListAcc}`)
    //   }
    // }

    function itemListAccSanitizer2() {
      if (itemListAccumulator !== undefined) {
        let sanitizerRegex3 = /(\\)|(\[)|(\])/g
        let sanitizerRegex4 = /("")/g
        let sanitizerRegex5 = /("{)/g
        let sanitizerRegex6 = /(}")/g
        sanitizedItemListAcc = itemListAccumulator.replace(sanitizerRegex3, "")
          .replace(sanitizerRegex4, `"`).replace(sanitizerRegex5, `{`).replace(sanitizerRegex6, `}`)
        console.log(`sanitizedItemListAcc==> ${sanitizedItemListAcc}`)
      }
    }

    // function imwProductValObjSanitizer() {
    //   let sanitizerRegex2 = /(")|(\\)/g
    //   let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)
    //   sanitizedImwProductValObj = stringifiedImwProductValObj.replace(sanitizerRegex2, "")
    //   console.log(`sanitizedImwProductValObj==> ${sanitizedImwProductValObj}`)
    // }

    // function sanitizedItemListObjGenerator() {
    //   if (itemListAccumulator !== undefined) {
    //     itemListAccSanitizer()
    //     imwProductArr.push(sanitizedItemListAcc)
    //   }
    //   imwProductValObj['itemID'] = itemID
    //   imwProductValObj['suppUnitID'] = suppUnitID
    //   imwProductValObjSanitizer()
    //   imwProductArr.push(sanitizedImwProductValObj)
    //   console.log(`imwProductArr==> ${imwProductArr}`)
    // }

    // sanitizedItemListObjGenerator()

    function sanitizedItemListObjGenerator2() {
      if (itemListAccumulator !== undefined) {
        itemListAccSanitizer2()
        /* X(?=Y) 	Positive lookahead 	X if followed by Y
         * (?<=Y)X 	Positive lookbehind 	X if after Y
         * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
        let splitRegex1 = /(?<=}),(?={)/g
        let sanitizedItemListAccSPLIT = sanitizedItemListAcc.split(splitRegex1)
        console.log(`sanitizedItemListAccSPLIT==> ${sanitizedItemListAccSPLIT}`)
        for (let i = 0; i < sanitizedItemListAccSPLIT.length; i++) {
          console.log(`sanitizedItemListAccSPLIT[${i}]==> ${sanitizedItemListAccSPLIT[i]}`)
          imwProductArr.push(sanitizedItemListAccSPLIT[i])
        }
      }
      imwProductValObj['itemID'] = itemID
      imwProductValObj['suppUnitID'] = suppUnitID
      let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)
      console.log(`stringifiedImwProductValObj==> ${stringifiedImwProductValObj}`)
      imwProductArr.push(stringifiedImwProductValObj)
      console.log(`imwProductArr==> ${imwProductArr}`)
    }

    sanitizedItemListObjGenerator2()

    function objectifyImwProductArr() {
      // let objectifiedImwProdArr = []
      for (let i = 0; i < imwProductArr.length; i++) {
        let objectifiedImwProd = JSON.parse(imwProductArr[i])
        objectifiedImwProdArr.push(objectifiedImwProd)
      }
      console.log(`objectifiedImwProdArr==> ${objectifiedImwProdArr}`)
    }

    objectifyImwProductArr()

    // for (let i = 0; i < imwProductArr.length; i++) {
    //   console.log(`typeof imwProductArr[${i}]==> ${typeof imwProductArr[i]}`)
    //   console.log(`imwProductArr[${i}]==> ${imwProductArr[i]}`)
    //   console.log(`JSON.stringify(imwProductArr[${i}])==> ${JSON.stringify(imwProductArr[i])}`)
    //   console.log(`imwProductArr[${i}]['itemID']==> ${imwProductArr[i]['itemID']}`)
    // }

    // let testString = `{"key": "value"}`
    // let parsedTestString = JSON.parse(testString)
    // console.log(`parsedTestString==> ${parsedTestString}`)
    // console.log(`parsedTestString.key==> ${parsedTestString.key}`)

    // console.log(`objectifiedImwProdArr==> ${objectifiedImwProdArr}`)

    res.render('vw-imwGenerator', {
      title: `vw-imwGenerator`,
      imwProductValObj: imwProductValObj,
      imwProductArr: imwProductArr,
      objectifiedImwProdArr: objectifiedImwProdArr
    })

  })
}