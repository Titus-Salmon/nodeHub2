var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

module.exports = {
    v_InventoryMasterQuery:
        router.post('/queryInvMasterTable', (req, res, next) => {
            const queryCatapultDBPostBody = req.body
            // console.log(`queryCatapultDBPostBody==> ${queryCatapultDBPostBody}`)
            // console.log(`JSON.stringify(queryCatapultDBPostBody)==> ${JSON.stringify(queryCatapultDBPostBody)}`)
            let catapultDbQuery = queryCatapultDBPostBody['tblQryPost']

            console.log(`catapultDbQuery==> ${catapultDbQuery}`)

            let catapultTableArr = []

            function showCatapultTables(result) {
                for (let i = 0; i < result.length; i++) {
                    let catapultTableListObj = {}
                    catapultTableListObj['invPK'] = result[i]['INV_PK']
                    if (typeof result[i]['INV_ScanCode'] == 'string') {
                        catapultTableListObj['invScanCode'] = result[i]['INV_ScanCode'].trim()
                    } else {
                        catapultTableListObj['invScanCode'] = result[i]['INV_ScanCode']
                    }
                    if (typeof result[i]['INV_Name'] == 'string') {
                        catapultTableListObj['invName'] = result[i]['INV_Name'].trim()
                    } else {
                        catapultTableListObj['invName'] = result[i]['INV_Name']
                    }
                    if (typeof result[i]['INV_Size'] == 'string') {
                        catapultTableListObj['invSize'] = result[i]['INV_Size'].trim()
                    } else {
                        catapultTableListObj['invSize'] = result[i]['INV_Size']
                    }
                    if (typeof result[i]['INV_ReceiptAlias'] == 'string') {
                        catapultTableListObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias'].trim()
                    } else {
                        catapultTableListObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias']
                    }
                    catapultTableListObj['posTimeStamp'] = unescape(result[i]['POS_TimeStamp'])
                    catapultTableListObj['invDateCreated'] = result[i]['INV_DateCreated']
                    catapultTableListObj['invEmpFkCreatedBy'] = result[i]['INV_EMP_FK_CreatedBy']
                    catapultTableListObj['ordQuantityInOrderUnit'] = result[i]['ord_quantityinorderunit']
                    if (typeof result[i]['oup_name'] == 'string') {
                        catapultTableListObj['oupName'] = result[i]['oup_name'].trim()
                    } else {
                        catapultTableListObj['oupName'] = result[i]['oup_name']
                    }
                    if (typeof result[i]['sto_name'] == 'string') {
                        catapultTableListObj['stoName'] = result[i]['sto_name'].trim()
                    } else {
                        catapultTableListObj['stoName'] = result[i]['sto_name']
                    }
                    if (typeof result[i]['brd_name'] == 'string') {
                        catapultTableListObj['brdName'] = result[i]['brd_name'].trim()
                    } else {
                        catapultTableListObj['brdName'] = result[i]['brd_name']
                    }
                    if (typeof result[i]['dpt_name'] == 'string') {
                        catapultTableListObj['dptName'] = result[i]['dpt_name'].trim()
                    } else {
                        catapultTableListObj['dptName'] = result[i]['dpt_name']
                    }
                    catapultTableListObj['dptNumber'] = result[i]['dpt_number']
                    if (typeof result[i]['ven_companyname'] == 'string') {
                        catapultTableListObj['venCompanyname'] = result[i]['ven_companyname'].trim()
                    } else {
                        catapultTableListObj['venCompanyname'] = result[i]['ven_companyname']
                    }
                    catapultTableListObj['invLastreceived'] = result[i]['inv_lastreceived']
                    catapultTableListObj['invLastsold'] = result[i]['inv_lastsold']
                    catapultTableListObj['invLastcost'] = result[i]['inv_lastcost']
                    catapultTableListObj['sibBasePrice'] = result[i]['SIB_BasePrice']
                    catapultTableListObj['invOnhand'] = result[i]['inv_onhand']
                    catapultTableListObj['invOnorder'] = result[i]['inv_onorder']
                    catapultTableListObj['invIntransit'] = result[i]['inv_intransit']
                    if (typeof result[i]['PI1_Description'] == 'string') {
                        catapultTableListObj['pi1Description'] = result[i]['PI1_Description'].trim()
                    } else {
                        catapultTableListObj['pi1Description'] = result[i]['PI1_Description']
                    }
                    if (typeof result[i]['PI2_Description'] == 'string') {
                        catapultTableListObj['pi2Description'] = result[i]['PI2_Description'].trim()
                    } else {
                        catapultTableListObj['pi2Description'] = result[i]['PI2_Description']
                    }
                    if (typeof result[i]['PI3_Description'] == 'string') {
                        catapultTableListObj['pi3Description'] = result[i]['PI3_Description'].trim()
                    } else {
                        catapultTableListObj['pi3Description'] = result[i]['PI3_Description']
                    }
                    if (typeof result[i]['PI4_Description'] == 'string') {
                        catapultTableListObj['pi4Description'] = result[i]['PI4_Description'].trim()
                    } else {
                        catapultTableListObj['pi4Description'] = result[i]['PI4_Description']
                    }
                    if (typeof result[i]['INV_PowerField1'] == 'string') {
                        catapultTableListObj['invPowerField1'] = result[i]['INV_PowerField1'].trim()
                    } else {
                        catapultTableListObj['invPowerField1'] = result[i]['INV_PowerField1']
                    }
                    if (typeof result[i]['INV_PowerField2'] == 'string') {
                        catapultTableListObj['invPowerField2'] = result[i]['INV_PowerField2'].trim()
                    } else {
                        catapultTableListObj['invPowerField2'] = result[i]['INV_PowerField2']
                    }
                    if (typeof result[i]['INV_PowerField3'] == 'string') {
                        catapultTableListObj['invPowerField3'] = result[i]['INV_PowerField3'].trim()
                    } else {
                        catapultTableListObj['invPowerField3'] = result[i]['INV_PowerField3']
                    }
                    if (typeof result[i]['INV_PowerField4'] == 'string') {
                        catapultTableListObj['invPowerField4'] = result[i]['INV_PowerField4'].trim()
                    } else {
                        catapultTableListObj['invPowerField4'] = result[i]['INV_PowerField4']
                    }

                    catapultTableArr.push(catapultTableListObj)
                }
                console.log('result.length~~~>', result.length)
            }

            odbc.connect(DSN, (error, connection) => {
                connection.query(`${catapultDbQuery}`, (error, result) => {
                    if (error) { console.error(error) }
                    // console.log('result==>', result)
                    console.log('result[0]==>', result[0])
                    // console.log('result[\'columns\'][2]==>', result['columns'][2])
                    // console.log('result.length~~~>', result.length)
                    showCatapultTables(result)

                    res.render('vw-v_InventoryMaster_query2', { //render searchResults to vw-retailCalcPassport page
                        title: 'vw-v_InventoryMaster_query2',
                        catapultTables: catapultTableArr
                    })
                })
            })
        })
}

// /* GET /catapultTableQuery */

// let catapultTableArr = []

// router.get('/', function (req, res, next) {
//     res.render('vw-v_InventoryMaster_query', {
//         title: 'v_InventoryMaster query',
//         // username: req.user.name,
//         // userEmail: req.user.email,
//         // userEmail_stringified: JSON.stringify(req.user.email),
//     });
// });

// router.post('/queryTable', function (req, res, next) {

//     // let catapultTableArr = []

//     const queryCatapultDBPostBody = req.body
//     // console.log(`queryCatapultDBPostBody==> ${queryCatapultDBPostBody}`)
//     // console.log(`JSON.stringify(queryCatapultDBPostBody)==> ${JSON.stringify(queryCatapultDBPostBody)}`)
//     let catapultDbQuery = queryCatapultDBPostBody['tblQryPost']

//     console.log(`catapultDbQuery==> ${catapultDbQuery}`)

//     // let catapultTableArr = []

//     function showCatapultTables(result) {
//         for (let i = 0; i < result.length; i++) {
//             let catapultTableListObj = {}
//             catapultTableListObj['invPK'] = result[i]['INV_PK']
//             if (typeof result[i]['INV_ScanCode'] == 'string') {
//                 catapultTableListObj['invScanCode'] = result[i]['INV_ScanCode'].trim()
//             } else {
//                 catapultTableListObj['invScanCode'] = result[i]['INV_ScanCode']
//             }
//             if (typeof result[i]['INV_Name'] == 'string') {
//                 catapultTableListObj['invName'] = result[i]['INV_Name'].trim()
//             } else {
//                 catapultTableListObj['invName'] = result[i]['INV_Name']
//             }
//             if (typeof result[i]['INV_Size'] == 'string') {
//                 catapultTableListObj['invSize'] = result[i]['INV_Size'].trim()
//             } else {
//                 catapultTableListObj['invSize'] = result[i]['INV_Size']
//             }
//             if (typeof result[i]['INV_ReceiptAlias'] == 'string') {
//                 catapultTableListObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias'].trim()
//             } else {
//                 catapultTableListObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias']
//             }
//             catapultTableListObj['posTimeStamp'] = unescape(result[i]['POS_TimeStamp'])
//             catapultTableListObj['invDateCreated'] = result[i]['INV_DateCreated']
//             catapultTableListObj['invEmpFkCreatedBy'] = result[i]['INV_EMP_FK_CreatedBy']
//             catapultTableListObj['ordQuantityInOrderUnit'] = result[i]['ord_quantityinorderunit']
//             if (typeof result[i]['oup_name'] == 'string') {
//                 catapultTableListObj['oupName'] = result[i]['oup_name'].trim()
//             } else {
//                 catapultTableListObj['oupName'] = result[i]['oup_name']
//             }
//             if (typeof result[i]['sto_name'] == 'string') {
//                 catapultTableListObj['stoName'] = result[i]['sto_name'].trim()
//             } else {
//                 catapultTableListObj['stoName'] = result[i]['sto_name']
//             }
//             if (typeof result[i]['brd_name'] == 'string') {
//                 catapultTableListObj['brdName'] = result[i]['brd_name'].trim()
//             } else {
//                 catapultTableListObj['brdName'] = result[i]['brd_name']
//             }
//             if (typeof result[i]['dpt_name'] == 'string') {
//                 catapultTableListObj['dptName'] = result[i]['dpt_name'].trim()
//             } else {
//                 catapultTableListObj['dptName'] = result[i]['dpt_name']
//             }
//             catapultTableListObj['dptNumber'] = result[i]['dpt_number']
//             if (typeof result[i]['ven_companyname'] == 'string') {
//                 catapultTableListObj['venCompanyname'] = result[i]['ven_companyname'].trim()
//             } else {
//                 catapultTableListObj['venCompanyname'] = result[i]['ven_companyname']
//             }
//             catapultTableListObj['invLastreceived'] = result[i]['inv_lastreceived']
//             catapultTableListObj['invLastsold'] = result[i]['inv_lastsold']
//             catapultTableListObj['invLastcost'] = result[i]['inv_lastcost']
//             catapultTableListObj['sibBasePrice'] = result[i]['SIB_BasePrice']
//             catapultTableListObj['invOnhand'] = result[i]['inv_onhand']
//             catapultTableListObj['invOnorder'] = result[i]['inv_onorder']
//             catapultTableListObj['invIntransit'] = result[i]['inv_intransit']
//             if (typeof result[i]['PI1_Description'] == 'string') {
//                 catapultTableListObj['pi1Description'] = result[i]['PI1_Description'].trim()
//             } else {
//                 catapultTableListObj['pi1Description'] = result[i]['PI1_Description']
//             }
//             if (typeof result[i]['PI2_Description'] == 'string') {
//                 catapultTableListObj['pi2Description'] = result[i]['PI2_Description'].trim()
//             } else {
//                 catapultTableListObj['pi2Description'] = result[i]['PI2_Description']
//             }
//             if (typeof result[i]['PI3_Description'] == 'string') {
//                 catapultTableListObj['pi3Description'] = result[i]['PI3_Description'].trim()
//             } else {
//                 catapultTableListObj['pi3Description'] = result[i]['PI3_Description']
//             }
//             if (typeof result[i]['PI4_Description'] == 'string') {
//                 catapultTableListObj['pi4Description'] = result[i]['PI4_Description'].trim()
//             } else {
//                 catapultTableListObj['pi4Description'] = result[i]['PI4_Description']
//             }
//             if (typeof result[i]['INV_PowerField1'] == 'string') {
//                 catapultTableListObj['invPowerField1'] = result[i]['INV_PowerField1'].trim()
//             } else {
//                 catapultTableListObj['invPowerField1'] = result[i]['INV_PowerField1']
//             }
//             if (typeof result[i]['INV_PowerField2'] == 'string') {
//                 catapultTableListObj['invPowerField2'] = result[i]['INV_PowerField2'].trim()
//             } else {
//                 catapultTableListObj['invPowerField2'] = result[i]['INV_PowerField2']
//             }
//             if (typeof result[i]['INV_PowerField3'] == 'string') {
//                 catapultTableListObj['invPowerField3'] = result[i]['INV_PowerField3'].trim()
//             } else {
//                 catapultTableListObj['invPowerField3'] = result[i]['INV_PowerField3']
//             }
//             if (typeof result[i]['INV_PowerField4'] == 'string') {
//                 catapultTableListObj['invPowerField4'] = result[i]['INV_PowerField4'].trim()
//             } else {
//                 catapultTableListObj['invPowerField4'] = result[i]['INV_PowerField4']
//             }

//             catapultTableArr.push(catapultTableListObj)
//         }
//         console.log('result.length~~~>', result.length)
//     }

//     odbc.connect(DSN, (error, connection) => {
//         connection.query(`${catapultDbQuery}`, (error, result) => {
//             if (error) { console.error(error) }
//             // console.log('result==>', result)
//             console.log('result[0]==>', result[0])
//             // console.log('result[\'columns\'][2]==>', result['columns'][2])
//             // console.log('result.length~~~>', result.length)
//             showCatapultTables(result)

//             res.render('vw-v_InventoryMaster_query', { //render searchResults to vw-retailCalcPassport page
//                 title: 'v_InventoryMaster query results',
//                 catapultTables: catapultTableArr
//             })
//         })
//     })
// });

// router.post('/save2CSV', function (req, res, next) {
//     console.log(`catapultTableArr[0]==>${catapultTableArr[0]}`)
//     console.log(`JSON.stringify(catapultTableArr[0])==>${JSON.stringify(catapultTableArr[0])}`)
//     console.log(`JSON.parse(JSON.stringify(catapultTableArr[0]))==>${JSON.parse(JSON.stringify(catapultTableArr[0]))}`)


//     //begin csv generator //////////////////////////////////////////////////////////////////////////
//     const {
//         Parser
//     } = require('json2csv')

//     const fields = [
//         "invPK", "invScanCode", "invName", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated", "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName",
//         "stoName", "brdName", "dptName", "dptNumber", "venCompanyname", "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit",
//         "pi1Description", "pi2Description", "pi3Description", "invPowerField3", "invPowerField4"
//     ]

//     const opts = {
//         fields
//     }

//     try {
//         console.log('catapultTableArr[0] from json2csv======>>', catapultTableArr[0])
//         const parser = new Parser(opts);
//         const csv = parser.parse(catapultTableArr);
//         // csvContainer.push(csv);
//         // console.log(`req.body-->${req.body}`)
//         console.log(`JSON.stringify(req.body)-->${JSON.stringify(req.body)}`)
//         console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
//         console.log('csv.length=====>>', csv.length);
//         fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
//             if (err) throw err;
//             console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
//         })
//     } catch (err) {
//         console.error(err);
//     }
//     //end csv generator //////////////////////////////////////////////////////////////////////////

//     res.render('vw-v_InventoryMaster_query', { //render searchResults to vw-dbEditPassport page
//         title: 'CSV Saved'
//     })
// })

// module.exports = router;
