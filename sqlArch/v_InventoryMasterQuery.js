var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

module.exports = {
    v_InventoryMasterQuery: router.post('/queryInvMasterTable', (req, res, next) => {
        const queryCatapultDBPostBody = req.body
        // console.log(`queryCatapultDBPostBody==> ${queryCatapultDBPostBody}`)
        // console.log(`JSON.stringify(queryCatapultDBPostBody)==> ${JSON.stringify(queryCatapultDBPostBody)}`)
        let catapultDbQuery = queryCatapultDBPostBody['tblQryPost']

        console.log(`catapultDbQuery==> ${catapultDbQuery}`)

        let catapultResArr = []

        function showcatapultResults(result) {
            for (let i = 0; i < result.length; i++) {
                let catapultResObj = {}
                catapultResObj['ri_t0d'] = i + 1 //create sequential record id (ri_t0d) column for saving as csv; you will NOT
                //want to include INV_PK or INV_CPK in your save-to-csv results - ONLY ri_t0d... adding 1 to 'i', so we don't
                //start our ri_t0d with 0, as that seems to confuse MySQL...
                catapultResObj['INV_PK'] = result[i]['INV_PK']
                catapultResObj['INV_CPK'] = result[i]['INV_CPK']
                if (typeof result[i]['INV_ScanCode'] == 'string') {
                    catapultResObj['INV_ScanCode'] = result[i]['INV_ScanCode'].trim()
                } else {
                    catapultResObj['INV_ScanCode'] = result[i]['INV_ScanCode']
                }
                if (typeof result[i]['ORD_SupplierStockNumber'] == 'string') {
                    catapultResObj['ORD_SupplierStockNumber'] = result[i]['ORD_SupplierStockNumber'].trim()
                } else {
                    catapultResObj['INV_ScanCode'] = result[i]['INV_ScanCode']
                }
                if (typeof result[i]['INV_Name'] == 'string') {
                    catapultResObj['INV_Name'] = result[i]['INV_Name'].trim()
                    // catapultResObj['invName'].replace(',', '') //remove any commas in name so csv doesn't get horked
                } else {
                    catapultResObj['INV_Name'] = result[i]['INV_Name']
                }
                if (typeof result[i]['INV_Size'] == 'string') {
                    catapultResObj['INV_Size'] = result[i]['INV_Size'].trim()
                } else {
                    catapultResObj['INV_Size'] = result[i]['INV_Size']
                }
                if (typeof result[i]['INV_ReceiptAlias'] == 'string') {
                    catapultResObj['INV_ReceiptAlias'] = result[i]['INV_ReceiptAlias'].trim()
                } else {
                    catapultResObj['INV_ReceiptAlias'] = result[i]['INV_ReceiptAlias']
                }
                if (typeof result[i]['inv_default'] == 'string') {
                    catapultResObj['inv_default'] = result[i]['inv_default'].trim()
                } else {
                    catapultResObj['inv_default'] = result[i]['inv_default']
                }
                catapultResObj['posTimeStamp'] = unescape(result[i]['POS_TimeStamp'])
                catapultResObj['INV_DateCreated'] = result[i]['INV_DateCreated']
                catapultResObj['INV_EMP_FK_CreatedBy'] = result[i]['INV_EMP_FK_CreatedBy']
                catapultResObj['ord_quantityinorderunit'] = result[i]['ord_quantityinorderunit']
                if (typeof result[i]['oup_name'] == 'string') {
                    catapultResObj['oup_name'] = result[i]['oup_name'].trim()
                } else {
                    catapultResObj['oup_name'] = result[i]['oup_name']
                }
                if (typeof result[i]['sto_number'] == 'string') {
                    catapultResObj['sto_number'] = result[i]['sto_number'].trim()
                } else {
                    catapultResObj['sto_number'] = result[i]['sto_number']
                }
                if (typeof result[i]['sto_name'] == 'string') {
                    catapultResObj['stoName'] = result[i]['sto_name'].trim()
                } else {
                    catapultResObj['sto_name'] = result[i]['sto_name']
                }
                if (typeof result[i]['brd_name'] == 'string') {
                    catapultResObj['brd_name'] = result[i]['brd_name'].trim()
                } else {
                    catapultResObj['brd_name'] = result[i]['brd_name']
                }
                if (typeof result[i]['dpt_name'] == 'string') {
                    catapultResObj['dpt_name'] = result[i]['dpt_name'].trim()
                } else {
                    catapultResObj['dpt_name'] = result[i]['dpt_name']
                }
                catapultResObj['dpt_number'] = result[i]['dpt_number']
                catapultResObj['SIB_IdealMargin'] = result[i]['SIB_IdealMargin']
                if (typeof result[i]['ven_companyname'] == 'string') {
                    catapultResObj['ven_companyname'] = result[i]['ven_companyname'].trim()
                } else {
                    catapultResObj['ven_companyname'] = result[i]['ven_companyname']
                }
                catapultResObj['inv_lastreceived'] = result[i]['inv_lastreceived']
                catapultResObj['inv_lastsold'] = result[i]['inv_lastsold']
                catapultResObj['inv_lastcost'] = result[i]['inv_lastcost']
                catapultResObj['SIB_BasePrice'] = result[i]['SIB_BasePrice']
                catapultResObj['inv_onhand'] = result[i]['inv_onhand']
                catapultResObj['inv_onorder'] = result[i]['inv_onorder']
                catapultResObj['inv_intransit'] = result[i]['inv_intransit']
                if (typeof result[i]['PI1_Description'] == 'string') {
                    catapultResObj['PI1_Description'] = result[i]['PI1_Description'].trim()
                } else {
                    catapultResObj['PI1_Description'] = result[i]['PI1_Description']
                }
                if (typeof result[i]['PI2_Description'] == 'string') {
                    catapultResObj['PI2_Description'] = result[i]['PI2_Description'].trim()
                } else {
                    catapultResObj['PI2_Description'] = result[i]['PI2_Description']
                }
                if (typeof result[i]['PI3_Description'] == 'string') {
                    catapultResObj['PI3_Description'] = result[i]['PI3_Description'].trim()
                } else {
                    catapultResObj['PI3_Description'] = result[i]['PI3_Description']
                }
                if (typeof result[i]['PI4_Description'] == 'string') {
                    catapultResObj['PI4_Description'] = result[i]['PI4_Description'].trim()
                } else {
                    catapultResObj['PI4_Description'] = result[i]['PI4_Description']
                }
                if (typeof result[i]['INV_PowerField1'] == 'string') {
                    catapultResObj['INV_PowerField1'] = result[i]['INV_PowerField1'].trim()
                } else {
                    catapultResObj['INV_PowerField1'] = result[i]['INV_PowerField1']
                }
                if (typeof result[i]['INV_PowerField2'] == 'string') {
                    catapultResObj['INV_PowerField2'] = result[i]['INV_PowerField2'].trim()
                } else {
                    catapultResObj['INV_PowerField2'] = result[i]['INV_PowerField2']
                }
                if (typeof result[i]['INV_PowerField3'] == 'string') {
                    catapultResObj['INV_PowerField3'] = result[i]['INV_PowerField3'].trim()
                } else {
                    catapultResObj['INV_PowerField3'] = result[i]['INV_PowerField3']
                }
                if (typeof result[i]['INV_PowerField4'] == 'string') {
                    catapultResObj['INV_PowerField4'] = result[i]['INV_PowerField4'].trim()
                } else {
                    catapultResObj['INV_PowerField4'] = result[i]['INV_PowerField4']
                }

                catapultResArr.push(catapultResObj)
            }
            // console.log(`result.length~~~> ${result.length}`)
        }

        odbc.connect(DSN, (error, connection) => {
            connection.query(`${catapultDbQuery}`, (error, result) => {
                if (error) {
                    console.error(error)
                }
                console.log(`result.length~~~> ${result.length}`)
                let queriedColumns_0 = Object.keys(result[0])
                console.log(`typeof queriedColumns_0==> ${typeof queriedColumns_0}`)
                console.log(`JSON.stringify(result[0])==> ${JSON.stringify(result[0])}`)
                console.log(`JSON.stringify(result['columns'][2])==> ${JSON.stringify(result['columns'][2])}`)
                showcatapultResults(result)

                res.render('vw-v_InventoryMaster_query2', { //render searchResults to vw-retailCalcPassport page
                    title: 'vw-v_InventoryMaster_query2',
                    catapultResults: catapultResArr,
                    queriedColumns_0: queriedColumns_0, //array of queried column names for frontend to display
                })
            })
        })
    })
}