var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})

module.exports = {
  nejUnitType: router.post('/nejUnitType', (req, res, next) => {
    const nejUnitTypePostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let nejUnitType = nejUnitTypePostBody['nejUnitTypePost']
    console.log(`nejUnitType==> ${nejUnitType}`)

    let nejUnitTypeArr = []

    function displayNhcrtEdi(rows) {
      for (let i = 0; i < rows.length; i++) {
        let nejUnitTypeObj = {}
        nejUnitTypeObj['ri_t0d'] = rows[i]['ri_t0d']
        nejUnitTypeObj['invPK'] = rows[i]['invPK']
        nejUnitTypeObj['invCPK'] = rows[i]['invCPK']
        nejUnitTypeObj['invScanCode'] = rows[i]['invScanCode']
        nejUnitTypeObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']

        for (let j = 0; j < Object.keys(rows[i]).length; j++) {
          if (Object.keys(rows[i])[j].includes('_sku')) {
            nejUnitTypeObj['ediSKU'] = rows[i][`${Object.keys(rows[i])[j]}`]
          }
        }

        nejUnitTypeObj['invName'] = rows[i]['invName']
        nejUnitTypeObj['invSize'] = rows[i]['invSize']
        nejUnitTypeObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
        nejUnitTypeObj['posTimeStamp'] = rows[i]['posTimeStamp']
        nejUnitTypeObj['invDateCreated'] = rows[i]['invDateCreated']
        nejUnitTypeObj['invEmpFkCreatedBy'] = rows[i]['invEmpFkCreatedBy']
        nejUnitTypeObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
        nejUnitTypeObj['oupName'] = rows[i]['oupName']
        nejUnitTypeObj['stoName'] = rows[i]['stoName']
        nejUnitTypeObj['brdName'] = rows[i]['brdName']
        nejUnitTypeObj['dptName'] = rows[i]['dptName']
        nejUnitTypeObj['dptNumber'] = rows[i]['dptNumber']
        nejUnitTypeObj['sibIdealMargin'] = rows[i]['sibIdealMargin']
        nejUnitTypeObj['venCompanyname'] = rows[i]['venCompanyname']
        nejUnitTypeObj['invLastreceived'] = rows[i]['invLastreceived']
        nejUnitTypeObj['invLastsold'] = rows[i]['invLastsold']
        nejUnitTypeObj['invLastcost'] = rows[i]['invLastcost']

        for (let j = 0; j < Object.keys(rows[i]).length; j++) {
          //extract cost from EDI catalog (all catalogs have some '_cost' column, except kehe, which has '_tier3')
          //!Object.keys(rows[i])[j].includes('_case_cost') will EXCLUDE '_case_cost' columns (such as cw_case_cost for Charlotte's Web)
          if (Object.keys(rows[i])[j].includes('_cost') && !Object.keys(rows[i])[j].includes('_case_cost') &&
            !Object.keys(rows[i])[j].includes('_display_cost') || Object.keys(rows[i])[j].includes('_tier3')) { //exclude _display_cost columns
            //from Jack N Jill
            nejUnitTypeObj['ediCost'] = rows[i][`${Object.keys(rows[i])[j]}`]
            // console.log(`nejUnitTypeObj['ediCost']==>${nejUnitTypeObj['ediCost']}`)
          }
        }

        nejUnitTypeObj['sibBasePrice'] = rows[i]['sibBasePrice']

        for (let j = 0; j < Object.keys(rows[i]).length; j++) {
          //extract msrp from EDI catalog (all catalogs have some '_msrp' column)
          if (Object.keys(rows[i])[j].includes('_msrp')) {
            nejUnitTypeObj['ediPrice'] = rows[i][`${Object.keys(rows[i])[j]}`]
            // console.log(`nejUnitTypeObj['ediPrice']==>${nejUnitTypeObj['ediPrice']}`)
          }
        }

        nejUnitTypeObj['invOnhand'] = rows[i]['invOnhand']
        nejUnitTypeObj['invOnorder'] = rows[i]['invOnorder']
        nejUnitTypeObj['invIntransit'] = rows[i]['invIntransit']
        nejUnitTypeObj['pi1Description'] = rows[i]['pi1Description']
        nejUnitTypeObj['pi2Description'] = rows[i]['pi2Description']
        nejUnitTypeObj['pi3Description'] = rows[i]['pi3Description']
        nejUnitTypeObj['invPowerField3'] = rows[i]['invPowerField3']
        nejUnitTypeObj['invPowerField4'] = rows[i]['invPowerField4']

        nejUnitTypeArr.push(nejUnitTypeObj)
      }
      console.log('rows.length~~~>', rows.length)
      console.log(`Object.keys(rows[0])==>${Object.keys(rows[0])}`)
    }


    let mySqlQuery = `${nejUnitType}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      displayNhcrtEdi(rows)

      res.render('vw-imwUnitType', {
        title: 'nejUnitType Table Display',
        nejUnitType: nejUnitTypeArr
      })
    })

  })
}