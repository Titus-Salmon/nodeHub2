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
  nhcrtInfraSF_Join: router.post('/nhcrtInfraSF_Join', (req, res, next) => {
    const nhcrtInfraSF_JoinPostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let nhcrtInfraSF_Join = nhcrtInfraSF_JoinPostBody['nhcrtInfraSF_JoinPost']
    console.log(`nhcrtInfraSF_Join==> ${nhcrtInfraSF_Join}`)

    let nhcrtInfraSF_JoinArr = []

    function nhcrtInfraSF(rows) {
      for (let i = 0; i < rows.length; i++) {
        let nhcrtInfraSF_JoinObj = {}
        nhcrtInfraSF_JoinObj['ri_t0d'] = rows[i]['ri_t0d']
        nhcrtInfraSF_JoinObj['invPK'] = rows[i]['invPK']
        nhcrtInfraSF_JoinObj['invCPK'] = rows[i]['invCPK']
        nhcrtInfraSF_JoinObj['invScanCode'] = rows[i]['invScanCode']
        nhcrtInfraSF_JoinObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //   if (Object.keys(rows[i])[j].includes('_sku')) {
        //     nhcrtInfraSF_JoinObj['ediSKU'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //   }
        // }

        nhcrtInfraSF_JoinObj['invName'] = rows[i]['invName']
        nhcrtInfraSF_JoinObj['invSize'] = rows[i]['invSize']
        nhcrtInfraSF_JoinObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
        nhcrtInfraSF_JoinObj['posTimeStamp'] = rows[i]['posTimeStamp']
        nhcrtInfraSF_JoinObj['invDateCreated'] = rows[i]['invDateCreated']
        nhcrtInfraSF_JoinObj['invEmpFkCreatedBy'] = rows[i]['invEmpFkCreatedBy']
        nhcrtInfraSF_JoinObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
        nhcrtInfraSF_JoinObj['oupName'] = rows[i]['oupName']
        nhcrtInfraSF_JoinObj['stoName'] = rows[i]['stoName']
        nhcrtInfraSF_JoinObj['brdName'] = rows[i]['brdName']
        nhcrtInfraSF_JoinObj['dptName'] = rows[i]['dptName']
        nhcrtInfraSF_JoinObj['dptNumber'] = rows[i]['dptNumber']
        nhcrtInfraSF_JoinObj['sibIdealMargin'] = rows[i]['sibIdealMargin']
        nhcrtInfraSF_JoinObj['venCompanyname'] = rows[i]['venCompanyname']
        nhcrtInfraSF_JoinObj['invLastreceived'] = rows[i]['invLastreceived']
        nhcrtInfraSF_JoinObj['invLastsold'] = rows[i]['invLastsold']
        nhcrtInfraSF_JoinObj['invLastcost'] = rows[i]['invLastcost']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //   //extract cost from EDI catalog (all catalogs have some '_cost' column, except kehe, which has '_tier3')
        //   //!Object.keys(rows[i])[j].includes('_case_cost') will EXCLUDE '_case_cost' columns (such as cw_case_cost for Charlotte's Web)
        //   if (Object.keys(rows[i])[j].includes('_cost') && !Object.keys(rows[i])[j].includes('_case_cost') &&
        //     !Object.keys(rows[i])[j].includes('_display_cost') || Object.keys(rows[i])[j].includes('_tier3')) { //exclude _display_cost columns
        //     //from Jack N Jill
        //     nhcrtInfraSF_JoinObj['ediCost'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //     // console.log(`nhcrtInfraSF_JoinObj['ediCost']==>${nhcrtInfraSF_JoinObj['ediCost']}`)
        //   }
        // }

        nhcrtInfraSF_JoinObj['sibBasePrice'] = rows[i]['sibBasePrice']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //   //extract msrp from EDI catalog (all catalogs have some '_msrp' column)
        //   if (Object.keys(rows[i])[j].includes('_msrp')) {
        //     nhcrtInfraSF_JoinObj['ediPrice'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //     // console.log(`nhcrtInfraSF_JoinObj['ediPrice']==>${nhcrtInfraSF_JoinObj['ediPrice']}`)
        //   }
        // }

        nhcrtInfraSF_JoinObj['invOnhand'] = rows[i]['invOnhand']
        nhcrtInfraSF_JoinObj['invOnorder'] = rows[i]['invOnorder']
        nhcrtInfraSF_JoinObj['invIntransit'] = rows[i]['invIntransit']
        nhcrtInfraSF_JoinObj['pi1Description'] = rows[i]['pi1Description']
        nhcrtInfraSF_JoinObj['pi2Description'] = rows[i]['pi2Description']
        nhcrtInfraSF_JoinObj['pi3Description'] = rows[i]['pi3Description']
        nhcrtInfraSF_JoinObj['invPowerField3'] = rows[i]['invPowerField3']
        nhcrtInfraSF_JoinObj['invPowerField4'] = rows[i]['invPowerField4']

        nhcrtInfraSF_JoinObj['Dept'] = rows[i]['Dept']
        nhcrtInfraSF_JoinObj['Brand'] = rows[i]['Brand']
        nhcrtInfraSF_JoinObj['Product'] = rows[i]['Product']
        nhcrtInfraSF_JoinObj['Size'] = rows[i]['Size']
        nhcrtInfraSF_JoinObj['SalePrice'] = rows[i]['SalePrice']
        nhcrtInfraSF_JoinObj['EDLP'] = rows[i]['EDLP']
        nhcrtInfraSF_JoinObj['RBPrice'] = rows[i]['RBPrice']
        nhcrtInfraSF_JoinObj['percentOff'] = rows[i]['percentOff']
        nhcrtInfraSF_JoinObj['GL'] = rows[i]['GL']
        nhcrtInfraSF_JoinObj['IND'] = rows[i]['IND']
        nhcrtInfraSF_JoinObj['MT'] = rows[i]['MT']
        nhcrtInfraSF_JoinObj['SH'] = rows[i]['SH']
        nhcrtInfraSF_JoinObj['SM'] = rows[i]['SM']
        nhcrtInfraSF_JoinObj['Stores'] = rows[i]['Stores']

        nhcrtInfraSF_JoinArr.push(nhcrtInfraSF_JoinObj)
      }
      console.log('rows.length~~~>', rows.length)
      // console.log(`Object.keys(rows)==>${Object.keys(rows)}`)
      console.log(`Object.keys(rows[0])==>${Object.keys(rows[0])}`)
      // console.log(`Object.keys(rows[0]).length==>${Object.keys(rows[0]).length}`)
      // console.log(`typeof Object.keys(rows[0])==>${typeof Object.keys(rows[0])}`)
      // console.log(`Object.keys(rows[0]['invScanCode'])==>${Object.keys(rows[0]['invScanCode'])}`)
      // // console.log('rows~~~>', rows)
      // console.log(`rows[0]['RowDataPacket']~~~>${rows[0]['RowDataPacket']}`)
      // // console.log('rows~~~>', rows)
      // console.log('rows[0]~~~>', rows[0])


      // for (let j=0; j<Object.keys(rows[0]).length; j++) {
      //     console.log(`Object.keys(rows[0])[j]==>${Object.keys(rows[0])[j]}`)
      // }


    }


    let mySqlQuery = `${nhcrtInfraSF_Join}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      // console.log(`rows[0]['invScanCode']==>${rows[0]['invScanCode']}`)
      // console.log(`rows[0]['invName']==>${rows[0]['invName']}`)
      // console.log('rows==>', rows)
      // res.send(rows)
      nhcrtInfraSF(rows)

      res.render('vw-signFilterChecker', {
        title: 'NodeHub CRT Joined on InfraSF Table Query Results',
        nhcrtInfraSF_Join: nhcrtInfraSF_JoinArr
      })
    })

  })
}