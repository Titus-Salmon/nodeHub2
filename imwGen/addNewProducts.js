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
    var imwProductValues
    let itemID = postBody['itemIDPost']
    let suppUnitID = postBody['suppUnitIDPost']
    let itemListAccumulator = postBody['itemListAccumulatorPost']

    function itemListAccSanitizer() {
      if (itemListAccumulator !== undefined) {
        let sanitizerRegex1 = /(")|(\\)/g
        var sanitizeditemListAcc = itemListAccumulator.replace(sanitizerRegex1, "")
        console.log(`itemListAccumulator==> ${itemListAccumulator}`)
        //itemListAccSanitizer()
        imwProductValues = `${sanitizeditemListAcc} _ itemID: '${itemID}' , suppUnitID: '${suppUnitID}'`
      } else {
        imwProductValues = `itemID: '${itemID}' , suppUnitID: '${suppUnitID}'`
      }
    }

    itemListAccSanitizer()


    res.render('vw-imwGenerator', {
      title: `vw-imwGenerator`,
      imwProductVals: JSON.stringify(imwProductValues),
      // loadedSqlTbl: frmInptsObj.loadedSqlTbl,
      // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
    })

  })
}