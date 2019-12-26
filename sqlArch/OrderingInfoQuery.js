var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

module.exports = {
  OrderingInfoQuery: router.post('/queryOrderingInfoTable', (req, res, next) => {
    const queryCatapultDBPostBody = req.body
    // console.log(`queryCatapultDBPostBody==> ${queryCatapultDBPostBody}`)
    // console.log(`JSON.stringify(queryCatapultDBPostBody)==> ${JSON.stringify(queryCatapultDBPostBody)}`)
    let catapultDbQuery = queryCatapultDBPostBody['tblQryPost']

    console.log(`catapultDbQuery==> ${catapultDbQuery}`)

    let catapultResArr = []

    function showcatapultResults(result) {
      for (let i = 0; i < result.length; i++) {
        let catapultResObj = {}
        catapultResObj['ORD_VEN_FK'] = result[i]['ORD_VEN_FK']
        catapultResObj['ORD_PK'] = result[i]['ORD_PK']
        if (typeof result[i]['ORD_SupplierStockNumber'] == 'string') {
          catapultResObj['ORD_SupplierStockNumber'] = result[i]['ORD_SupplierStockNumber'].trim()
        } else {
          catapultResObj['ORD_SupplierStockNumber'] = result[i]['ORD_SupplierStockNumber']
        }
        if (typeof result[i]['ORD_INV_FK'] == 'string') {
          catapultResObj['ORD_INV_FK'] = result[i]['ORD_INV_FK'].trim()
        } else {
          catapultResObj['ORD_INV_FK'] = result[i]['ORD_INV_FK']
        }
        if (typeof result[i]['ORD_CPK'] == 'string') {
          catapultResObj['ORD_CPK'] = result[i]['ORD_CPK'].trim()
          // catapultResObj['invName'].replace(',', '') //remove any commas in name so csv doesn't get horked
        } else {
          catapultResObj['ORD_CPK'] = result[i]['ORD_CPK']
        }
        if (typeof result[i]['ORD_INV_CFK'] == 'string') {
          catapultResObj['ORD_INV_CFK'] = result[i]['ORD_INV_CFK'].trim()
        } else {
          catapultResObj['ORD_INV_CFK'] = result[i]['ORD_INV_CFK']
        }
        if (typeof result[i]['ORD_VEN_CFK'] == 'string') {
          catapultResObj['ORD_VEN_CFK'] = result[i]['ORD_VEN_CFK'].trim()
        } else {
          catapultResObj['ORD_VEN_CFK'] = result[i]['ORD_VEN_CFK']
        }
        if (typeof result[i]['ORD_Primary'] == 'string') {
          catapultResObj['ORD_Primary'] = result[i]['ORD_Primary'].trim()
        } else {
          catapultResObj['ORD_Primary'] = result[i]['ORD_Primary']
        }
        if (typeof result[i]['ORD_QuantityInOrderUnit'] == 'string') {
          catapultResObj['ORD_QuantityInOrderUnit'] = result[i]['ORD_QuantityInOrderUnit'].trim()
        } else {
          catapultResObj['ORD_QuantityInOrderUnit'] = result[i]['ORD_QuantityInOrderUnit']
        }
        if (typeof result[i]['ORD_ASC_FK'] == 'string') {
          catapultResObj['ORD_ASC_FK'] = result[i]['ORD_ASC_FK'].trim()
        } else {
          catapultResObj['ORD_ASC_FK'] = result[i]['ORD_ASC_FK']
        }
        if (typeof result[i]['ORD_ASC_CFK'] == 'string') {
          catapultResObj['ORD_ASC_CFK'] = result[i]['ORD_ASC_CFK'].trim()
        } else {
          catapultResObj['ORD_ASC_CFK'] = result[i]['ORD_ASC_CFK']
        }
        if (typeof result[i]['ORD_OUP_FK'] == 'string') {
          catapultResObj['ORD_OUP_FK'] = result[i]['ORD_OUP_FK'].trim()
        } else {
          catapultResObj['ORD_OUP_FK'] = result[i]['ORD_OUP_FK']
        }
        if (typeof result[i]['ORD_OUP_CFK'] == 'string') {
          catapultResObj['ORD_OUP_CFK'] = result[i]['ORD_OUP_CFK'].trim()
        } else {
          catapultResObj['ORD_OUP_CFK'] = result[i]['ORD_OUP_CFK']
        }

        catapultResObj['ORD_Timestamp'] = unescape(result[i]['ORD_Timestamp'])

        if (typeof result[i]['ORD_DSDItem'] == 'string') {
          catapultResObj['ORD_DSDItem'] = result[i]['ORD_DSDItem'].trim()
        } else {
          catapultResObj['ORD_DSDItem'] = result[i]['ORD_DSDItem']
        }
        if (typeof result[i]['ORD_DefaultSupplier'] == 'string') {
          catapultResObj['ORD_DefaultSupplier'] = result[i]['ORD_DefaultSupplier'].trim()
        } else {
          catapultResObj['ORD_DefaultSupplier'] = result[i]['ORD_DefaultSupplier']
        }
        if (typeof result[i]['ORD_Discontinued'] == 'string') {
          catapultResObj['ORD_Discontinued'] = result[i]['ORD_Discontinued'].trim()
        } else {
          catapultResObj['ORD_Discontinued'] = result[i]['ORD_Discontinued']
        }

        catapultResObj['ORD_DateDiscontinued'] = unescape(result[i]['ORD_DateDiscontinued'])

        if (typeof result[i]['ORD_MinimumOrder'] == 'string') {
          catapultResObj['ORD_MinimumOrder'] = result[i]['ORD_MinimumOrder'].trim()
        } else {
          catapultResObj['ORD_MinimumOrder'] = result[i]['ORD_MinimumOrder']
        }
        if (typeof result[i]['ORD_FirstOrdRecordDSDFlagSet'] == 'string') {
          catapultResObj['ORD_FirstOrdRecordDSDFlagSet'] = result[i]['ORD_FirstOrdRecordDSDFlagSet'].trim()
        } else {
          catapultResObj['ORD_FirstOrdRecordDSDFlagSet'] = result[i]['ORD_FirstOrdRecordDSDFlagSet']
        }
        if (typeof result[i]['ORD_SuggestedMultiple'] == 'string') {
          catapultResObj['ORD_SuggestedMultiple'] = result[i]['ORD_SuggestedMultiple'].trim()
        } else {
          catapultResObj['ORD_SuggestedMultiple'] = result[i]['ORD_SuggestedMultiple']
        }
        if (typeof result[i]['ORD_AllowOverrideOfMultiple'] == 'string') {
          catapultResObj['ORD_AllowOverrideOfMultiple'] = result[i]['ORD_AllowOverrideOfMultiple'].trim()
        } else {
          catapultResObj['ORD_AllowOverrideOfMultiple'] = result[i]['ORD_AllowOverrideOfMultiple']
        }

        catapultResArr.push(catapultResObj)
      }
      console.log('result.length~~~>', result.length)
    }

    odbc.connect(DSN, (error, connection) => {
      connection.query(`${catapultDbQuery}`, (error, result) => {
        if (error) {
          console.error(error)
        }
        console.log('result==>', result)
        // console.log('result[0]==>', result[0])
        // console.log('result[\'columns\'][2]==>', result['columns'][2])
        // console.log('result.length~~~>', result.length)
        showcatapultResults(result)

        res.render('vw-OrderingInfo', { //render searchResults to vw-retailCalcPassport page
          title: 'vw-OrderingInfo',
          catapultResults: catapultResArr
        })
      })
    })
  })
}

// /* GET /catapultTableQuery */

// let catapultResArr = []

// router.get('/', function (req, res, next) {
//     res.render('vw-v_InventoryMaster_query', {
//         title: 'v_InventoryMaster query',
//         // username: req.user.name,
//         // userEmail: req.user.email,
//         // userEmail_stringified: JSON.stringify(req.user.email),
//     });
// });

// router.post('/queryTable', function (req, res, next) {

//     // let catapultResArr = []

//     const queryCatapultDBPostBody = req.body
//     // console.log(`queryCatapultDBPostBody==> ${queryCatapultDBPostBody}`)
//     // console.log(`JSON.stringify(queryCatapultDBPostBody)==> ${JSON.stringify(queryCatapultDBPostBody)}`)
//     let catapultDbQuery = queryCatapultDBPostBody['tblQryPost']

//     console.log(`catapultDbQuery==> ${catapultDbQuery}`)

//     // let catapultResArr = []

//     function showcatapultResults(result) {
//         for (let i = 0; i < result.length; i++) {
//             let catapultResObj = {}
//             catapultResObj['invPK'] = result[i]['INV_PK']
//             if (typeof result[i]['INV_ScanCode'] == 'string') {
//                 catapultResObj['invScanCode'] = result[i]['INV_ScanCode'].trim()
//             } else {
//                 catapultResObj['invScanCode'] = result[i]['INV_ScanCode']
//             }
//             if (typeof result[i]['INV_Name'] == 'string') {
//                 catapultResObj['invName'] = result[i]['INV_Name'].trim()
//             } else {
//                 catapultResObj['invName'] = result[i]['INV_Name']
//             }
//             if (typeof result[i]['INV_Size'] == 'string') {
//                 catapultResObj['invSize'] = result[i]['INV_Size'].trim()
//             } else {
//                 catapultResObj['invSize'] = result[i]['INV_Size']
//             }
//             if (typeof result[i]['INV_ReceiptAlias'] == 'string') {
//                 catapultResObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias'].trim()
//             } else {
//                 catapultResObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias']
//             }
//             catapultResObj['posTimeStamp'] = unescape(result[i]['POS_TimeStamp'])
//             catapultResObj['invDateCreated'] = result[i]['INV_DateCreated']
//             catapultResObj['invEmpFkCreatedBy'] = result[i]['INV_EMP_FK_CreatedBy']
//             catapultResObj['ordQuantityInOrderUnit'] = result[i]['ord_quantityinorderunit']
//             if (typeof result[i]['oup_name'] == 'string') {
//                 catapultResObj['oupName'] = result[i]['oup_name'].trim()
//             } else {
//                 catapultResObj['oupName'] = result[i]['oup_name']
//             }
//             if (typeof result[i]['sto_name'] == 'string') {
//                 catapultResObj['stoName'] = result[i]['sto_name'].trim()
//             } else {
//                 catapultResObj['stoName'] = result[i]['sto_name']
//             }
//             if (typeof result[i]['brd_name'] == 'string') {
//                 catapultResObj['brdName'] = result[i]['brd_name'].trim()
//             } else {
//                 catapultResObj['brdName'] = result[i]['brd_name']
//             }
//             if (typeof result[i]['dpt_name'] == 'string') {
//                 catapultResObj['dptName'] = result[i]['dpt_name'].trim()
//             } else {
//                 catapultResObj['dptName'] = result[i]['dpt_name']
//             }
//             catapultResObj['dptNumber'] = result[i]['dpt_number']
//             if (typeof result[i]['ven_companyname'] == 'string') {
//                 catapultResObj['venCompanyname'] = result[i]['ven_companyname'].trim()
//             } else {
//                 catapultResObj['venCompanyname'] = result[i]['ven_companyname']
//             }
//             catapultResObj['invLastreceived'] = result[i]['inv_lastreceived']
//             catapultResObj['invLastsold'] = result[i]['inv_lastsold']
//             catapultResObj['invLastcost'] = result[i]['inv_lastcost']
//             catapultResObj['sibBasePrice'] = result[i]['SIB_BasePrice']
//             catapultResObj['invOnhand'] = result[i]['inv_onhand']
//             catapultResObj['invOnorder'] = result[i]['inv_onorder']
//             catapultResObj['invIntransit'] = result[i]['inv_intransit']
//             if (typeof result[i]['PI1_Description'] == 'string') {
//                 catapultResObj['pi1Description'] = result[i]['PI1_Description'].trim()
//             } else {
//                 catapultResObj['pi1Description'] = result[i]['PI1_Description']
//             }
//             if (typeof result[i]['PI2_Description'] == 'string') {
//                 catapultResObj['pi2Description'] = result[i]['PI2_Description'].trim()
//             } else {
//                 catapultResObj['pi2Description'] = result[i]['PI2_Description']
//             }
//             if (typeof result[i]['PI3_Description'] == 'string') {
//                 catapultResObj['pi3Description'] = result[i]['PI3_Description'].trim()
//             } else {
//                 catapultResObj['pi3Description'] = result[i]['PI3_Description']
//             }
//             if (typeof result[i]['PI4_Description'] == 'string') {
//                 catapultResObj['pi4Description'] = result[i]['PI4_Description'].trim()
//             } else {
//                 catapultResObj['pi4Description'] = result[i]['PI4_Description']
//             }
//             if (typeof result[i]['INV_PowerField1'] == 'string') {
//                 catapultResObj['invPowerField1'] = result[i]['INV_PowerField1'].trim()
//             } else {
//                 catapultResObj['invPowerField1'] = result[i]['INV_PowerField1']
//             }
//             if (typeof result[i]['INV_PowerField2'] == 'string') {
//                 catapultResObj['invPowerField2'] = result[i]['INV_PowerField2'].trim()
//             } else {
//                 catapultResObj['invPowerField2'] = result[i]['INV_PowerField2']
//             }
//             if (typeof result[i]['INV_PowerField3'] == 'string') {
//                 catapultResObj['invPowerField3'] = result[i]['INV_PowerField3'].trim()
//             } else {
//                 catapultResObj['invPowerField3'] = result[i]['INV_PowerField3']
//             }
//             if (typeof result[i]['INV_PowerField4'] == 'string') {
//                 catapultResObj['invPowerField4'] = result[i]['INV_PowerField4'].trim()
//             } else {
//                 catapultResObj['invPowerField4'] = result[i]['INV_PowerField4']
//             }

//             catapultResArr.push(catapultResObj)
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
//             showcatapultResults(result)

//             res.render('vw-v_InventoryMaster_query', { //render searchResults to vw-retailCalcPassport page
//                 title: 'v_InventoryMaster query results',
//                 catapultResults: catapultResArr
//             })
//         })
//     })
// });

// router.post('/save2CSV', function (req, res, next) {
//     console.log(`catapultResArr[0]==>${catapultResArr[0]}`)
//     console.log(`JSON.stringify(catapultResArr[0])==>${JSON.stringify(catapultResArr[0])}`)
//     console.log(`JSON.parse(JSON.stringify(catapultResArr[0]))==>${JSON.parse(JSON.stringify(catapultResArr[0]))}`)


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
//         console.log('catapultResArr[0] from json2csv======>>', catapultResArr[0])
//         const parser = new Parser(opts);
//         const csv = parser.parse(catapultResArr);
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