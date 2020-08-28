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
    let venCompanynameArr = []
    let vendorSalesTotArr = []
    let vendorSalesTotObjArr = []

    function displayNhcrtOptItemSales(rows) {
      for (let i = 0; i < rows.length; i++) {
        let nhcrtOptItemSalesObj = {}
        nhcrtOptItemSalesObj['ri_t0d'] = i + 1
        nhcrtOptItemSalesObj['invScanCode'] = rows[i]['invScanCode']
        nhcrtOptItemSalesObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']
        nhcrtOptItemSalesObj['invSize'] = rows[i]['invSize']
        nhcrtOptItemSalesObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
        nhcrtOptItemSalesObj['invDateCreated'] = rows[i]['invDateCreated']
        nhcrtOptItemSalesObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
        nhcrtOptItemSalesObj['oupName'] = rows[i]['oupName']
        nhcrtOptItemSalesObj['stoNumber'] = rows[i]['stoNumber']
        nhcrtOptItemSalesObj['brdName'] = rows[i]['brdName']
        nhcrtOptItemSalesObj['dptName'] = rows[i]['dptName']
        nhcrtOptItemSalesObj['dptNumber'] = rows[i]['dptNumber']
        nhcrtOptItemSalesObj['sibIdealMargin'] = rows[i]['sibIdealMargin']
        nhcrtOptItemSalesObj['actualMargT0d'] = rows[i]['actualMargT0d']
        nhcrtOptItemSalesObj['venCompanyname'] = rows[i]['venCompanyname']
        nhcrtOptItemSalesObj['invLastreceived'] = rows[i]['invLastreceived']
        nhcrtOptItemSalesObj['invLastsold'] = rows[i]['invLastsold']
        nhcrtOptItemSalesObj['invLastcost'] = rows[i]['invLastcost']

        nhcrtOptItemSalesObj['sibBasePrice'] = rows[i]['sibBasePrice']

        nhcrtOptItemSalesObj['invOnhand'] = rows[i]['invOnhand']
        nhcrtOptItemSalesObj['invOnorder'] = rows[i]['invOnorder']
        nhcrtOptItemSalesObj['invIntransit'] = rows[i]['invIntransit']
        nhcrtOptItemSalesObj['pi1Description'] = rows[i]['pi1Description']
        nhcrtOptItemSalesObj['pi2Description'] = rows[i]['pi2Description']
        // nhcrtOptItemSalesObj['pi3Description'] = rows[i]['pi3Description']
        // nhcrtOptItemSalesObj['invPowerField3'] = rows[i]['invPowerField3']
        // nhcrtOptItemSalesObj['invPowerField4'] = rows[i]['invPowerField4']

        nhcrtOptItemSalesObj['Quantity'] = rows[i]['Quantity']
        nhcrtOptItemSalesObj['ExtCost'] = rows[i]['ExtCost']
        nhcrtOptItemSalesObj['Sales'] = rows[i]['Sales']

        // if (i > 0) {
        //   if (rows[i - 1]['venCompanyname'] == rows[i]['venCompanyname']) {
        //     nhcrtOptItemSalesObj['SalesTot'] = rows[i - 1]['Sales'] + rows[i]['Sales']
        //   }
        // }

        nhcrtOptItemSalesObj['Margin'] = rows[i]['Margin']
        nhcrtOptItemSalesObj['percMargin'] = rows[i]['percMargin']

        nhcrtOptItemSalesArr.push(nhcrtOptItemSalesObj)
        venCompanynameArr.push(rows[i]['venCompanyname'])
      }
      nhcrtOptItemSalesArrCache.set('nhcrtOptItemSalesArrCache_key', nhcrtOptItemSalesArr)
      console.log('rows.length~~~>', rows.length)
      // console.log(`Object.keys(rows)==>${Object.keys(rows)}`)
      console.log(`Object.keys(rows[0])==>${Object.keys(rows[0])}`)

      const distinctVenCompName = [...new Set(venCompanynameArr)]
      console.log(`distinctVenCompName.length==> ${distinctVenCompName.length}`)
      console.log(`distinctVenCompName==> ${distinctVenCompName}`)

      var vendorSalesTot = 0

      for (let j = 0; j < distinctVenCompName.length; j++) {
        let vendorSalesTotObj = {}
        for (let k = 0; k < nhcrtOptItemSalesArr.length; k++) {
          if (distinctVenCompName[j] == nhcrtOptItemSalesArr[k]['venCompanyname']) {
            let vendorSales = nhcrtOptItemSalesArr[k]['Sales']
            let vendorSalesParseInt = parseInt(vendorSales)
            vendorSalesTot += vendorSalesParseInt
          }
        }
        vendorSalesTotArr.push(vendorSalesTot)
        vendorSalesTotObj['vendor'] = distinctVenCompName[j]
        vendorSalesTotObj['salesTot'] = vendorSalesTotArr[j]
        vendorSalesTotObjArr.push(vendorSalesTotObj)
      }
      console.log(`vendorSalesTotArr.length==> ${vendorSalesTotArr.length}`)
      console.log(`vendorSalesTotArr==> ${vendorSalesTotArr}`)
      console.log(`JSON.stringify(vendorSalesTotObjArr)==> ${JSON.stringify(vendorSalesTotObjArr)}`)
      // vendorSalesTotObjArr.sort(function (a, b) {
      //   return a.salesTot - b.salesTot
      // })
      // vendorSalesTotObjArr.forEach((e) => {
      //   console.log(`${e.vendor} ${e.salesTot}`)
      // })
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

      res.render('vw-optItemSales', {
        title: 'NodeHub CRT Joined on Optimized Item Sales Table Query Results',
        nhcrtOptItemSales: nhcrtOptItemSalesArr,
        vendorSalesTotObjArr: vendorSalesTotObjArr
      })
    })

  })
}