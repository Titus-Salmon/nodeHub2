var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.RB_HOST,
    user: process.env.RB_USER,
    password: process.env.RB_PW,
    database: process.env.RB_DB,
    multipleStatements: true
})

const catapultResArrCache = require('../nodeCacheStuff/cache1')

module.exports = {
    nhcrtDisplay: router.post('/nhcrtDisplay', (req, res, next) => {
        const nhcrtDisplayPostBody = req.body
        // console.log(`req.body==> ${req.body}`)
        let nhcrtQuery = nhcrtDisplayPostBody['nhcrtDisplayPost']
        console.log(`nhcrtQuery==> ${nhcrtQuery}`)

        let nhcrtDisplayArr = []

        catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key
        console.log(`JSON.stringify(catapultResArrCacheValue[0])==> ${JSON.stringify(catapultResArrCacheValue[0])}`)

        function displayNhcrt(catapultResArrCacheValue) {
            for (let i = 0; i < catapultResArrCacheValue.length; i++) {
                let nhcrtObj = {}
                nhcrtObj['ri_t0d'] = i + 1
                nhcrtObj['invScanCode'] = catapultResArrCacheValue[a]['invScanCode']
                nhcrtObj['ordSupplierStockNumber'] = catapultResArrCacheValue[a]['ordSupplierStockNumber']
                nhcrtObj['invName'] = catapultResArrCacheValue[a]['invName']
                nhcrtObj['invSize'] = catapultResArrCacheValue[a]['invSize']
                nhcrtObj['invReceiptAlias'] = catapultResArrCacheValue[a]['invReceiptAlias']
                nhcrtObj['invDefault'] = catapultResArrCacheValue[a]['invDefault']
                nhcrtObj['posTimeStamp'] = catapultResArrCacheValue[a]['posTimeStamp']
                nhcrtObj['invDateCreated'] = catapultResArrCacheValue[a]['invDateCreated']
                nhcrtObj['invEmpFkCreatedBy'] = catapultResArrCacheValue[a]['invEmpFkCreatedBy']
                nhcrtObj['oupName'] = catapultResArrCacheValue[a]['oupName']
                nhcrtObj['stoNumber'] = catapultResArrCacheValue[a]['stoNumber']
                nhcrtObj['stoName'] = catapultResArrCacheValue[a]['stoName']
                nhcrtObj['brdName'] = catapultResArrCacheValue[a]['brdName']
                nhcrtObj['dptName'] = catapultResArrCacheValue[a]['dptName']
                nhcrtObj['dptNumber'] = catapultResArrCacheValue[a]['dptNumber']
                nhcrtObj['sibIdealMargin'] = catapultResArrCacheValue[a]['sibIdealMargin']
                nhcrtObj['actualMargT0d'] = catapultResArrCacheValue[a]['actualMargT0d']
                nhcrtObj['venCompanyname'] = catapultResArrCacheValue[a]['venCompanyname']
                nhcrtObj['invLastreceived'] = catapultResArrCacheValue[a]['invLastreceived']
                nhcrtObj['invLastsold'] = catapultResArrCacheValue[a]['invLastsold']
                nhcrtObj['invLastcost'] = catapultResArrCacheValue[a]['invLastcost']
                nhcrtObj['sibBasePrice'] = catapultResArrCacheValue[a]['sibBasePrice']
                nhcrtObj['invOnhand'] = catapultResArrCacheValue[a]['invOnhand']
                nhcrtObj['invOnorder'] = catapultResArrCacheValue[a]['invOnorder']
                nhcrtObj['invIntransit'] = catapultResArrCacheValue[a]['invIntransit']
                nhcrtObj['invMemo'] = catapultResArrCacheValue[a]['invMemo']
                nhcrtObj['pi1Description'] = catapultResArrCacheValue[a]['pi1Description']
                nhcrtObj['pi2Description'] = catapultResArrCacheValue[a]['pi2Description']
                nhcrtObj['pi3Description'] = catapultResArrCacheValue[a]['pi3Description']
                nhcrtObj['pi4Description'] = catapultResArrCacheValue[a]['pi4Description']
                nhcrtObj['invPowerField1'] = catapultResArrCacheValue[a]['invPowerField1']
                nhcrtObj['invPowerField2'] = catapultResArrCacheValue[a]['invPowerField2']
                nhcrtObj['invPowerField3'] = catapultResArrCacheValue[a]['invPowerField3']
                nhcrtObj['invPowerField4'] = catapultResArrCacheValue[a]['invPowerField4']

                nhcrtDisplayArr.push(nhcrtObj)
            }
            console.log('catapultResArrCacheValue.length~~~>', catapultResArrCacheValue.length)
        }


        let mySqlQuery = `${nhcrtQuery}`

        connection.query(mySqlQuery, function (err, rows, fields) {
            if (err) throw err
            displayNhcrt(catapultResArrCacheValue)

            res.render('vw-nhcrtQuery', {
                title: 'NodeHub Catapult Results Table Query Results',
                // nhcrtDisplay: nhcrtDisplayArr
            })
        })

    })
}