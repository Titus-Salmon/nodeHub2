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
    nhcrtEdiJoin: router.post('/nhcrtEdiJoin', (req, res, next) => {
        const nhcrtEdiJoinPostBody = req.body
        // console.log(`req.body==> ${req.body}`)
        let nhcrtEdiJoin = nhcrtEdiJoinPostBody['nhcrtEdiJoinPost']
        console.log(`nhcrtEdiJoin==> ${nhcrtEdiJoin}`)

        let nhcrtEdiJoinArr = []

        function displayNhcrtEdi(rows) {
            for (let i = 0; i < rows.length; i++) {
                let nhcrtEdiJoinObj = {}
                nhcrtEdiJoinObj['record_id'] = rows[i]['record_id']
                nhcrtEdiJoinObj['invScanCode'] = rows[i]['invScanCode']
                nhcrtEdiJoinObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']
                nhcrtEdiJoinObj['invName'] = rows[i]['invName']
                nhcrtEdiJoinObj['invSize'] = rows[i]['invSize']
                nhcrtEdiJoinObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
                nhcrtEdiJoinObj['posTimeStamp'] = rows[i]['posTimeStamp']
                nhcrtEdiJoinObj['invDateCreated'] = rows[i]['invDateCreated']
                nhcrtEdiJoinObj['invEmpFkCreatedBy'] = rows[i]['invEmpFkCreatedBy']
                nhcrtEdiJoinObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
                nhcrtEdiJoinObj['oupName'] = rows[i]['oupName']
                nhcrtEdiJoinObj['stoName'] = rows[i]['stoName']
                nhcrtEdiJoinObj['brdName'] = rows[i]['brdName']
                nhcrtEdiJoinObj['dptName'] = rows[i]['dptName']
                nhcrtEdiJoinObj['dptNumber'] = rows[i]['dptNumber']
                nhcrtEdiJoinObj['venCompanyname'] = rows[i]['venCompanyname']
                nhcrtEdiJoinObj['invLastreceived'] = rows[i]['invLastreceived']
                nhcrtEdiJoinObj['invLastsold'] = rows[i]['invLastsold']
                nhcrtEdiJoinObj['invLastcost'] = rows[i]['invLastcost']
                nhcrtEdiJoinObj['sibBasePrice'] = rows[i]['sibBasePrice']
                nhcrtEdiJoinObj['invOnhand'] = rows[i]['invOnhand']
                nhcrtEdiJoinObj['invOnorder'] = rows[i]['invOnorder']
                nhcrtEdiJoinObj['invIntransit'] = rows[i]['invIntransit']
                nhcrtEdiJoinObj['pi1Description'] = rows[i]['pi1Description']
                nhcrtEdiJoinObj['pi2Description'] = rows[i]['pi2Description']
                nhcrtEdiJoinObj['pi3Description'] = rows[i]['pi3Description']
                nhcrtEdiJoinObj['invPowerField3'] = rows[i]['invPowerField3']
                nhcrtEdiJoinObj['invPowerField4'] = rows[i]['invPowerField4']

                for (let j = 0; j < Object.keys(rows[i]).length; j++) {
                    if (Object.keys(rows[i])[j].includes('_cost') || Object.keys(rows[i])[j].includes('_tier3')) {
                        // console.log(`Object.keys(rows[${i}])[${j}]==>${Object.keys(rows[i])[j]}`)
                        nhcrtEdiJoinObj['ediCost'] = rows[i][`${Object.keys(rows[i])[j]}`]
                        console.log(`nhcrtEdiJoinObj['ediCost']==>${nhcrtEdiJoinObj['ediCost']}`)
                    } else {
                        // console.log(`Object.keys(rows[${i}])[${j}] doesnt include '_cost'`)
                    }
                }

                nhcrtEdiJoinArr.push(nhcrtEdiJoinObj)
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


        let mySqlQuery = `${nhcrtEdiJoin}`

        connection.query(mySqlQuery, function (err, rows, fields) {
            if (err) throw err
            console.log(`rows.length==>${rows.length}`)
            console.log('rows[0]==>', rows[0])
            // console.log(`rows[0]['invScanCode']==>${rows[0]['invScanCode']}`)
            // console.log(`rows[0]['invName']==>${rows[0]['invName']}`)
            // console.log('rows==>', rows)
            // res.send(rows)
            displayNhcrtEdi(rows)

            res.render('vw-nhcrtEdiJoin', {
                title: 'NodeHub CRT Joined on EDI Table Query Results',
                nhcrtEdiJoin: nhcrtEdiJoinArr
            })
        })

    })
}