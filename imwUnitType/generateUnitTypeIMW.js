const express = require('express')
const router = express.Router()

const mysql = require('mysql')
// const querystring = require('querystring')

// const sanitizerFuncs = require('../funcLibT0d/sanitizerFuncs')
// const showSearchRes = require('../funcLibT0d/showSearchRes')
// const remvItem = require('../funcLibT0d/removeItem')
// const paginPost = require('../funcLibT0d/paginPost')

const connection = mysql.createConnection({ //for work use in RB DB
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  generateUnitTypeIMW: router.post(`/generateUnitTypeIMW`, (req, res, next) => {

    const postBody = req.body

    // let imwProductValObj = {} //this holds product values (for one discrete product entry at a time) as an object;
    //it gets stringified & pushed to imwProductArr
    // let imwProductArr = [] //this gets sent back to frontend input for itemListAccumulatorPost
    // let objectifiedImwProdArr = [] //we objectify imwProductArr so it can be easily displayed in the DOM template

    let nhcrtTableName = postBody['nhcrtTablePost']
    console.log(`nhcrtTableName==> ${nhcrtTableName}`)
    let ediTableName = postBody['ediTablePost']
    console.log(`ediTableName==> ${ediTableName}`)
    let ediPrefix = postBody['ediPrefixPost']
    console.log(`ediPrefix==> ${ediPrefix}`)

    let srsObjArr = []


    // console.log(`imwProductValObj from addNewProducts.js POST==> ${imwProductValObj}`)
    // console.log(`JSON.stringify(imwProductValObj) from addNewProducts.js POST==> ${JSON.stringify(imwProductValObj)}`)

    function showSearchRes(rows) {

      let displayRows = rows
      console.log(`displayRows[0]==> ${displayRows[0]}`)

      for (let i = 0; i < displayRows.length; i++) {
        let srsObj = {}

        srsObj['ri_t0d'] = i + 1
        srsObj['item_id'] = displayRows[i]['nhcrtInvScanCode']
        srsObj['dept_id'] = ''
        srsObj['dept_name'] = ''
        srsObj['recpt_alias'] = displayRows[i]['nhcrtInvReceiptAlias']
        srsObj['brand'] = ''
        srsObj['item_name'] = ''
        srsObj['size'] = ''
        srsObj['sugg_retail'] = ''
        srsObj['last_cost'] = ''
        srsObj['base_price'] = ''
        srsObj['auto_discount'] = ''
        srsObj['ideal_margin'] = ''
        srsObj['weight_profile'] = ''
        srsObj['tax1'] = ''
        srsObj['tax2'] = ''
        srsObj['tax3'] = ''
        srsObj['spec_tndr1'] = ''
        srsObj['spec_tndr2'] = ''
        srsObj['pos_prompt'] = ''
        srsObj['location'] = ''
        srsObj['alternate_id'] = ''
        srsObj['alt_rcpt_alias'] = ''
        srsObj['pkg_qty'] = ''
        srsObj['supp_unit_id'] = displayRows[i]['nhcrtOrdSupplierStockNumber'] //here we use SKU from Catapult (ordSupplierStockNumber), NOT from EDI table (ediSKU)
        srsObj['supplier_id'] = displayRows[i]['nhcrtVenCompanyName']
        srsObj['unit'] = displayRows[i]['edi_tableEDIprefixUnitType'] // here we use ${ediPrefix}_unit_type from EDI table, NOT from Catapult (nhcrt.oupName)
        srsObj['num_pkgs'] = displayRows[i]['num_pkgs'] //NEED LOGIC FOR THIS; this should be whatever the ## is for CS-##, otherwise, just ''
        srsObj['category'] = ''
        srsObj['sub_category'] = ''
        srsObj['product_group'] = ''
        srsObj['product_flag'] = ''
        srsObj['rb_note'] = ''
        srsObj['edi_default'] = ''
        srsObj['powerfield_7'] = ''
        srsObj['temp_group'] = ''
        srsObj['onhand_qty'] = ''
        srsObj['reorder_point'] = ''
        srsObj['mcl'] = ''
        srsObj['reorder_qty'] = ''
        srsObj['memo'] = ''
        srsObj['flrRsn'] = ''
        srsObj['dsd'] = ''
        srsObj['disc_mult'] = ''
        srsObj['case_pk_mult'] = ''
        srsObj['ovr'] = ''

        srsObjArr.push(srsObj)
      }
    }

    function queryNejUnitType_Table() {
      connection.query(`
      SELECT DISTINCT nhcrt.invPK AS nhcrtInvPK, nhcrt.invCPK AS nhcrtInvCPK, nhcrt.invScanCode AS nhcrtInvScanCode,
      nhcrt.ordSupplierStockNumber AS nhcrtOrdSupplierStockNumber, nhcrt.invName AS nhcrtInvName,
      nhcrt.invReceiptAlias AS nhcrtInvReceiptAlias,
      nhcrt.venCompanyname AS nhcrtVenCompanyName, nhcrt.pi1Description AS nhcrtPi1Description, nhcrt.pi2Description AS nhcrtPi2Description,
      edi_table.${ediPrefix}_upc AS edi_tableEDIprefixUPC, edi_table.${ediPrefix}_unit_type AS edi_tableEDIprefixUnitType FROM ${nhcrtTableName}
      nhcrt JOIN ${ediTableName} edi_table ON nhcrt.invScanCode
      WHERE nhcrt.invScanCode = edi_table.${ediPrefix}_upc
      ORDER BY nhcrt.pi1Description, nhcrt.pi2Description;`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchRes(rows)

          res.render('vw-imwUnitType', {
            title: `vw-imwUnitType`,
            srsObjArr: srsObjArr,
            // imwProductValObj: imwProductValObj,
            // imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
            // objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
            // tableName: tableName,
            // numQueryRes: paginPostObj.numQueryRes,
            // pageLinkArray: pageLinkArray,
            // currentPage: paginPostObj.currentPage,
            // numberOfPages: numPagesPlaceholder[0],
            // lastPage: numPagesPlaceholder[0] - 1,
            // firstPage: 0
          })
        })
    }

    queryNejUnitType_Table()

    // if (tableName !== undefined && tableName !== '') {
    //   queryNejUnitType_Table()
    //   console.log(`numPages from queryNejUnitType_Table() POST==> ${showSearchRes.showSearchRes.numPages}`)
    // } else {
    //   res.render('vw-imwUnitType', {
    //     title: `vw-imwUnitType`,
    //     // imwProductValObj: imwProductValObj,
    //     srsObjArr: srsObjArr
    //     // imwProductArr: imwProductArr,
    //     // objectifiedImwProdArr: objectifiedImwProdArr
    //   })
    // }
  })
}