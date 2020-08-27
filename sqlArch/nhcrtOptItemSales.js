var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})

const nhcrtOptItemSalesArrCache = require('../nodeCacheStuff/cache1')

module.exports = {
  nhcrtOptItemSales: router.post('/nhcrtOptItemSales', (req, res, next) => {
    const nhcrtOptItemSalesPostBody = req.body
    let nhcrtOptItemSales = nhcrtOptItemSalesPostBody['nhcrtOptItemSalesPost']
    console.log(`nhcrtOptItemSales==> ${nhcrtOptItemSales}`)

    let nhcrtOptItemSalesArr = []

    function displayNhcrtOptItemSales(rows) {
      for (let i = 0; i < rows.length; i++) {
        let nhcrtOptItemSalesObj = {}
        nhcrtOptItemSalesObj['ri_t0d'] = i + 1
        // nhcrtOptItemSalesObj['invPK'] = rows[i]['invPK']
        // nhcrtOptItemSalesObj['invCPK'] = rows[i]['invCPK']
        nhcrtOptItemSalesObj['invScanCode'] = rows[i]['invScanCode']
        nhcrtOptItemSalesObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //   if (Object.keys(rows[i])[j].includes('_sku')) {
        //     nhcrtOptItemSalesObj['ediSKU'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //   }
        // }

        // nhcrtOptItemSalesObj['invName'] = rows[i]['invName']
        nhcrtOptItemSalesObj['invSize'] = rows[i]['invSize']
        nhcrtOptItemSalesObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
        // nhcrtOptItemSalesObj['posTimeStamp'] = rows[i]['posTimeStamp']
        nhcrtOptItemSalesObj['invDateCreated'] = rows[i]['invDateCreated']
        // nhcrtOptItemSalesObj['invEmpFkCreatedBy'] = rows[i]['invEmpFkCreatedBy']
        nhcrtOptItemSalesObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
        nhcrtOptItemSalesObj['oupName'] = rows[i]['oupName']
        nhcrtOptItemSalesObj['stoNumber'] = rows[i]['stoNumber']
        // nhcrtOptItemSalesObj['stoName'] = rows[i]['stoName']
        nhcrtOptItemSalesObj['brdName'] = rows[i]['brdName']
        nhcrtOptItemSalesObj['dptName'] = rows[i]['dptName']
        nhcrtOptItemSalesObj['dptNumber'] = rows[i]['dptNumber']
        nhcrtOptItemSalesObj['sibIdealMargin'] = rows[i]['sibIdealMargin']
        nhcrtOptItemSalesObj['actualMargT0d'] = rows[i]['actualMargT0d']
        nhcrtOptItemSalesObj['venCompanyname'] = rows[i]['venCompanyname']
        nhcrtOptItemSalesObj['invLastreceived'] = rows[i]['invLastreceived']
        nhcrtOptItemSalesObj['invLastsold'] = rows[i]['invLastsold']
        nhcrtOptItemSalesObj['invLastcost'] = rows[i]['invLastcost']
        nhcrtOptItemSalesObj['Quantity'] = rows[i]['Quantity']
        nhcrtOptItemSalesObj['ExtCost'] = rows[i]['ExtCost']
        nhcrtOptItemSalesObj['Sales'] = rows[i]['Sales']
        nhcrtOptItemSalesObj['Margin'] = rows[i]['Margin']
        nhcrtOptItemSalesObj['percMargin'] = rows[i]['percMargin']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //   //extract cost from EDI catalog (all catalogs have some '_cost' column, except kehe, which has '_tier3')
        //   //!Object.keys(rows[i])[j].includes('_case_cost') will EXCLUDE '_case_cost' columns (such as cw_case_cost for Charlotte's Web)
        //   if (Object.keys(rows[i])[j].includes('_cost') && !Object.keys(rows[i])[j].includes('_case_cost') &&
        //     !Object.keys(rows[i])[j].includes('_display_cost') || Object.keys(rows[i])[j].includes('_tier3')) { //exclude _display_cost columns
        //     //from Jack N Jill
        //     nhcrtOptItemSalesObj['ediCost'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //     // console.log(`nhcrtOptItemSalesObj['ediCost']==>${nhcrtOptItemSalesObj['ediCost']}`)
        //   }
        // }

        nhcrtOptItemSalesObj['sibBasePrice'] = rows[i]['sibBasePrice']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //   //extract msrp from EDI catalog (all catalogs have some '_msrp' column)
        //   if (Object.keys(rows[i])[j].includes('_msrp') ||
        //     Object.keys(rows[i])[j].includes('_srp')) { //catches infra_srp column for Kehe
        //     nhcrtOptItemSalesObj['ediPrice'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //     // console.log(`nhcrtOptItemSalesObj['ediPrice']==>${nhcrtOptItemSalesObj['ediPrice']}`)
        //   }
        // }

        nhcrtOptItemSalesObj['invOnhand'] = rows[i]['invOnhand']
        nhcrtOptItemSalesObj['invOnorder'] = rows[i]['invOnorder']
        nhcrtOptItemSalesObj['invIntransit'] = rows[i]['invIntransit']
        nhcrtOptItemSalesObj['pi1Description'] = rows[i]['pi1Description']
        nhcrtOptItemSalesObj['pi2Description'] = rows[i]['pi2Description']
        nhcrtOptItemSalesObj['pi3Description'] = rows[i]['pi3Description']
        nhcrtOptItemSalesObj['invPowerField3'] = rows[i]['invPowerField3']
        nhcrtOptItemSalesObj['invPowerField4'] = rows[i]['invPowerField4']

        nhcrtOptItemSalesArr.push(nhcrtOptItemSalesObj)
      }
      nhcrtOptItemSalesArrCache.set('nhcrtOptItemSalesArrCache_key', nhcrtOptItemSalesArr)
      console.log('rows.length~~~>', rows.length)
      // console.log(`Object.keys(rows)==>${Object.keys(rows)}`)
      console.log(`Object.keys(rows[0])==>${Object.keys(rows[0])}`)
    }


    let mySqlQuery = `${nhcrtOptItemSales}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      // console.log(`rows[0]['invScanCode']==>${rows[0]['invScanCode']}`)
      // console.log(`rows[0]['invName']==>${rows[0]['invName']}`)
      // console.log('rows==>', rows)
      // res.send(rows)
      displayNhcrtOptItemSales(rows)

      res.render('vw-nhcrtOptItemSales', {
        title: 'NodeHub CRT Joined on Optimized Item Sales Table Query Results',
        nhcrtOptItemSales: nhcrtOptItemSalesArr
      })
    })

  })
}