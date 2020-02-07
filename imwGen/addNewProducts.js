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

    function itemListAccSanitizer() {
      if (itemListAccumulator !== undefined) {
        let sanitizerRegex1 = /(")|(\\)|(\[)|(\])/g
        sanitizedItemListAcc = itemListAccumulator.replace(sanitizerRegex1, "")
        console.log(`sanitizedItemListAcc==> ${sanitizedItemListAcc}`)
      }
    }

    function imwProductValObjSanitizer() {
      let sanitizerRegex2 = /(")|(\\)/g
      let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)
      sanitizedImwProductValObj = stringifiedImwProductValObj.replace(sanitizerRegex2, "")
      console.log(`sanitizedImwProductValObj==> ${sanitizedImwProductValObj}`)
    }

    function itemListObjGenerator() {
      if (itemListAccumulator !== undefined) {
        itemListAccSanitizer()
        imwProductArr.push(sanitizedItemListAcc)
      }
      imwProductValObj['itemID'] = itemID
      imwProductValObj['suppUnitID'] = suppUnitID
      imwProductValObjSanitizer()
      imwProductArr.push(sanitizedImwProductValObj)
      console.log(`imwProductArr==> ${imwProductArr}`)
    }

    itemListObjGenerator()

    // function objectifyImwProductArr() {
    //   let objectifiedImwProdArr = []
    //   for (let i = 0; i < imwProductArr.length; i++) {
    //     let objectifiedImwProd = JSON.parse(imwProductArr[i])
    //     objectifiedImwProdArr.push(objectifiedImwProd)
    //   }
    // }

    // objectifyImwProductArr()

    for (let i = 0; i < imwProductArr.length; i++) {
      console.log(`typeof imwProductArr[${i}]==> ${typeof imwProductArr[i]}`)
      console.log(`imwProductArr[${i}]==> ${imwProductArr[i]}`)
      console.log(`JSON.stringify(imwProductArr[${i}])==> ${JSON.stringify(imwProductArr[i])}`)
      console.log(`imwProductArr[${i}]['itemID']==> ${imwProductArr[i]['itemID']}`)
    }

    let testString = `{"key": "value"}`
    let parsedTestString = JSON.parse(testString)
    console.log(`parsedTestString==> ${parsedTestString}`)
    console.log(`parsedTestString.key==> ${parsedTestString.key}`)

    // console.log(`objectifiedImwProdArr==> ${objectifiedImwProdArr}`)

    res.render('vw-imwGenerator', {
      title: `vw-imwGenerator`,
      imwProductValObj: imwProductValObj,
      imwProductArr: imwProductArr,
      // objectifiedImwProdArr: objectifiedImwProdArr
    })

  })
}