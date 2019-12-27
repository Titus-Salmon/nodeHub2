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
    nhcrtDisplay: router.post('/nhcrtDisplay', (req, res, next) => {
        const nhcrtDisplayPostBody = req.body
        // console.log(`req.body==> ${req.body}`)
        let nhcrtQuery = nhcrtDisplayPostBody['nhcrtDisplayPost']
        console.log(`nhcrtQuery==> ${nhcrtQuery}`)

        let nhcrtDisplayArr = []

        function displayNhcrt(rows) {
            for (let i = 0; i < rows.length; i++) {
                let nhcrtObj = {}
                nhcrtObj['ri_t0d'] = rows[i]['ri_t0d']
                nhcrtObj['invScanCode'] = rows[i]['invScanCode']
                nhcrtObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']
                nhcrtObj['invName'] = rows[i]['invName']
                nhcrtObj['invSize'] = rows[i]['invSize']
                nhcrtObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
                nhcrtObj['posTimeStamp'] = rows[i]['posTimeStamp']
                nhcrtObj['invDateCreated'] = rows[i]['invDateCreated']
                nhcrtObj['invEmpFkCreatedBy'] = rows[i]['invEmpFkCreatedBy']
                nhcrtObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
                nhcrtObj['oupName'] = rows[i]['oupName']
                nhcrtObj['stoName'] = rows[i]['stoName']
                nhcrtObj['brdName'] = rows[i]['brdName']
                nhcrtObj['dptName'] = rows[i]['dptName']
                nhcrtObj['dptNumber'] = rows[i]['dptNumber']
                nhcrtObj['venCompanyname'] = rows[i]['venCompanyname']
                nhcrtObj['invLastreceived'] = rows[i]['invLastreceived']
                nhcrtObj['invLastsold'] = rows[i]['invLastsold']
                nhcrtObj['invLastcost'] = rows[i]['invLastcost']
                nhcrtObj['sibBasePrice'] = rows[i]['sibBasePrice']
                nhcrtObj['invOnhand'] = rows[i]['invOnhand']
                nhcrtObj['invOnorder'] = rows[i]['invOnorder']
                nhcrtObj['invIntransit'] = rows[i]['invIntransit']
                nhcrtObj['pi1Description'] = rows[i]['pi1Description']
                nhcrtObj['pi2Description'] = rows[i]['pi2Description']
                nhcrtObj['pi3Description'] = rows[i]['pi3Description']
                nhcrtObj['invPowerField3'] = rows[i]['invPowerField3']
                nhcrtObj['invPowerField4'] = rows[i]['invPowerField4']

                nhcrtDisplayArr.push(nhcrtObj)
            }
            console.log('rows.length~~~>', rows.length)
        }


        let mySqlQuery = `${nhcrtQuery}`

        connection.query(mySqlQuery, function (err, rows, fields) {
            if (err) throw err
            console.log('rows==>', rows)
            // res.send(rows)
            displayNhcrt(rows)

            res.render('vw-nhcrtQuery', {
                title: 'NodeHub Catapult Results Table Query Results',
                nhcrtDisplay: nhcrtDisplayArr
            })
        })

    })
}