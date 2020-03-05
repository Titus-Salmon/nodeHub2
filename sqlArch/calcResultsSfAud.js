const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResultsSfAud: router.post('/calcResultsSfAud', (req, res, next) => {

    let searchResults = [] //clear searchResults from previous search
    console.log('calcResultsSfAud says: searchResults from router.post level===>', searchResults)
    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    console.log('calcResultsSfAud says: searchResultsForCSV from router.post level===>', searchResultsForCSV)
    csvContainer = []
    console.log('calcResultsSfAud says: csvContainer from router.post level===>', csvContainer)


    const postBody = req.body
    console.log('calcResultsSfAud says: postBody==>', postBody)
    console.log('calcResultsSfAud says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    console.log('calcResultsSfAud says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    //v//sanitize table column header post results from #retailCalcUniversal form ('Search Loaded Table')
    let toSplitField = postBody['fldArrToPostPost']
    console.log('calcResultsSfAud says: toSplitField before replace==>', toSplitField)
    let sanitizeColumnFields = /(\[)|(\])|(")/g
    let toSplitFieldReplace = toSplitField.replace(sanitizeColumnFields, "")
    console.log('calcResultsSfAud says: toSplitFieldReplace after replace==>', toSplitFieldReplace)
    let splitFieldResult = toSplitFieldReplace.split(',')
    console.log('calcResultsSfAud says: splitFieldResult==>', splitFieldResult)
    //^//sanitize table column header post results from #retailCalcUniversal form ('Search Loaded Table')



    //****************************************************************************************************************** */
    //v//generate generic column headers corresponding to nhcrtEdiJoin table column headers that are associated with
    //primary key, upc, sku, name, cost, msrp, etc...
    let genericHeaderObj = {}

    for (let i = 0; i < splitFieldResult.length; i++) {
      if (splitFieldResult[i].includes('record_id')) { //primary key - don't think this will be needed for inv mnt wksht
        genericHeaderObj.primarykeyHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'invScanCode') { //Item ID (1); targets upc from catapult v_InventoryMaster table
        genericHeaderObj.upcHeader = splitFieldResult[i]
        console.log('calcResultsSfAud says: genericHeaderObj.upcHeader==>', genericHeaderObj.upcHeader)
      }
      if (splitFieldResult[i] == 'ordSupplierStockNumber') { //Supplier Unit ID (25); targets SKU from catapult v_InventoryMaster portion of
        //nhcrtEdiJoin table; ALSO NEED TO TARGET ediSKU from EDI portion of nhcrtEdiJoin table & THEN CHECK TO SEE IF THEY'RE THE SAME
        genericHeaderObj.cpltSKUHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'ediSKU') { //Supplier Unit ID (25); targets SKU from catapult v_InventoryMaster portion of
        //nhcrtEdiJoin table; ALSO NEED TO TARGET ediSKU from EDI portion of nhcrtEdiJoin table & THEN CHECK TO SEE IF THEY'RE THE SAME
        genericHeaderObj.ediSKUHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'invName') { //Item Name (6); targets prod name from catapult v_InventoryMaster portion of nhcrtEdiJoin table
        genericHeaderObj.nameHeader = splitFieldResult[i]
      }
      //v//20191121 MARGIN REPORT ISSUE///////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (splitFieldResult[i] == 'ediCost') { //Last Cost(?) ==>updated WS; cost from EDI portion of nhcrtEdiJoin
        genericHeaderObj.ediCostHeader = splitFieldResult[i]
      } //targeting ediCost from vendor catalog
      if (splitFieldResult[i] == 'invLastcost') { //Last Cost(?) ==>updated WS; cost from EDI portion of nhcrtEdiJoin
        genericHeaderObj.invLastcostHeader = splitFieldResult[i]
      } //targeting invLastcost from catapult v_InventoryMaster table -- probably going to want to check if ediCost == invLastCost
      //^//20191121 MARGIN REPORT ISSUE///////////////////////////////////////////////////////////////////////////////////////////////////////////

      // if (splitFieldResult[i].includes('item_price') || splitFieldResult[i].includes('msrp')) { //Suggested Retail ==>msrp?
      //   //***NEED TO ADD MSRP FROM EDI table to nhcrtEdiJoin results*/
      //   genericHeaderObj.msrpHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i].includes('ediPrice')) { //Suggested Retail ==>msrp?
        //targets msrp from edi table
        genericHeaderObj.msrpHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_price') { //
      //   genericHeaderObj.rbPriceHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'sibBasePrice') { //
        genericHeaderObj.sibBasePriceHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_dept') { //
      //   genericHeaderObj.rbDeptHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'dptName') { //
        genericHeaderObj.rbDeptHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_dept_id') {
      //   genericHeaderObj.rbDeptIDHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'dptNumber') {
        genericHeaderObj.rbDeptIDHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_dept_margin') {
      //   genericHeaderObj.rbDeptMarginHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'sibIdealMargin') {
        genericHeaderObj.sibIdealMarginHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'rb_supplier') {
      //   genericHeaderObj.rbSupplierHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'venCompanyname') {
        genericHeaderObj.rbSupplierHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'edlp_flag') {
        genericHeaderObj.edlpFlagHeader = splitFieldResult[i]
      }
      if (splitFieldResult[i] == 'sale_flag') {
        genericHeaderObj.saleFlagHeader = splitFieldResult[i]
      }
      // if (splitFieldResult[i] == 'kehe_uos') { //need to target kehe_uos in order to divide by that for kehe items sold by case
      //   genericHeaderObj.keheUOSHeader = splitFieldResult[i]
      // }
      if (splitFieldResult[i] == 'oupName') { //need to target catapult uos(oupName) in order to divide by that for any items sold by case
        genericHeaderObj.oupName = splitFieldResult[i]
      }
    }

    console.log('calcResultsSfAud says: genericHeaderObj==>', genericHeaderObj)
    //^//generate generic column headers corresponding to margin_report table column headers that are associated with
    //primary key, upc, sku, name, cost, & msrp
    //****************************************************************************************************************** */



    function showSearchResults(rows) {

      let nisfRows = rows
      // let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table

      console.log(`JSON.stringify(nisfRows[0])==> ${JSON.stringify(nisfRows[0])}`)

      for (let i = 0; i < nisfRows.length; i++) { //Add searched-for table entries from db to searchResults array, for
        //displaying in the dynamic DOM table. Also add margin data, & retail & charm calcs to display in DOM table
        let srcRsObj = {}
        let reviewObj = {} //push data to this obj for review CSV

      }
    }



    function queryNisfJoinTable() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      connection.query(`SELECT * FROM ${formInput0} ORDER BY ri_t0d;`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-signFilterChecker', { //render searchResults to vw-MySqlTableHub page
          title: 'sfAud (using nisf table)',
          searchResRows: searchResults,
          loadedSqlTbl: loadedSqlTbl
        })
      })

    }

    queryNisfJoinTable()

  })
}