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


    res.render('vw-imwGenerator', {
      title: `vw-imwGenerator`,
      // imwProductVals: JSON.stringify(imwProductValues),
      // loadedSqlTbl: frmInptsObj.loadedSqlTbl,
      // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
      imwProductValObj: imwProductValObj,
      imwProductArr: imwProductArr
    })

  })
}