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

    let formInput0 = Object.values(postBody)[0] = loadedSqlTbl = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)


    function showSearchResults(rows) {

      let nisfRows = rows
      // let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table

      console.log(`JSON.stringify(nisfRows[0])==> ${JSON.stringify(nisfRows[0])}`)

      for (let i = 0; i < nisfRows.length; i++) { //Add searched-for table entries from db to searchResults array, for
        //displaying in the dynamic DOM table. Also add margin data, & retail & charm calcs to display in DOM table
        // let srcRsObj = {}
        // let reviewObj = {} //push data to this obj for review CSV

        // console.log(`nisfRows[${i}]['invOnhand']==> ${nisfRows[i]['invOnhand']}`)
        // console.log(`typeof nisfRows[${i}]['invOnhand']==> ${typeof nisfRows[i]['invOnhand']}`)
        // console.log(`typeof parseInt(nisfRows[${i}]['invOnhand'])==> ${typeof parseInt(nisfRows[i]['invOnhand'])}`)

        // console.log(`nisfRows[${i}]['IND'] ** nisfRows[${i}]['invOnhand']==> ${nisfRows[i]['IND']} ** ${nisfRows[i]['invOnhand']}`)
        console.log(`nisfRows[${i}]['SM'] ** nisfRows[${i}]['invOnhand']==> ${nisfRows[i]['SM']} ** ${nisfRows[i]['invOnhand']}`)

        if (nisfRows[i]['stoName'] == 'Indiana') {
          if ((parseInt(nisfRows[i]['invOnhand']) > 0 && nisfRows[i]['IND'] == '-') ||
            (parseInt(nisfRows[i]['invOnhand']) <= 0 && nisfRows[i]['IND'] == 'IN')) {
            let srcRsObj = {}
            console.log(`nisfRows[${i}]['invOnhand'] (IND)==> ${nisfRows[i]['invOnhand']}`)
            srcRsObj['ri_t0d'] = i
            srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
            srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
            srcRsObj['invMismatchName'] = nisfRows[i]['invName']
            srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']

            searchResults.push(srcRsObj)
          }
        }

        if (nisfRows[i]['stoName'] == 'Saint Matthews') {
          if ((parseInt(nisfRows[i]['invOnhand']) > 0 && nisfRows[i]['SM'] == '-') ||
            (parseInt(nisfRows[i]['invOnhand']) <= 0 && nisfRows[i]['SM'] == 'SM')) {
            let srcRsObj = {}
            srcRsObj['ri_t0d'] = i
            srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
            srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
            srcRsObj['invMismatchName'] = nisfRows[i]['invName']
            srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']

            searchResults.push(srcRsObj)
          }
        }

        if (nisfRows[i]['stoName'] == 'Middletown') {
          if ((parseInt(nisfRows[i]['invOnhand']) > 0 && nisfRows[i]['MT'] == '-') ||
            (parseInt(nisfRows[i]['invOnhand']) <= 0 && nisfRows[i]['MT'] == 'MT')) {
            let srcRsObj = {}
            srcRsObj['ri_t0d'] = i
            srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
            srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
            srcRsObj['invMismatchName'] = nisfRows[i]['invName']
            srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']

            searchResults.push(srcRsObj)
          }
        }

        if (nisfRows[i]['stoName'] == 'Springhurst') {
          if ((parseInt(nisfRows[i]['invOnhand']) > 0 && nisfRows[i]['SH'] == '-') ||
            (parseInt(nisfRows[i]['invOnhand']) <= 0 && nisfRows[i]['SH'] == 'SH')) {
            let srcRsObj = {}
            srcRsObj['ri_t0d'] = i
            srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
            srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
            srcRsObj['invMismatchName'] = nisfRows[i]['invName']
            srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']

            searchResults.push(srcRsObj)
          }
        }

        if (nisfRows[i]['stoName'] == 'Gardiner Lane') {
          if ((parseInt(nisfRows[i]['invOnhand']) > 0 && nisfRows[i]['GL'] == '-') ||
            (parseInt(nisfRows[i]['invOnhand']) <= 0 && nisfRows[i]['GL'] == 'GL')) {
            let srcRsObj = {}
            srcRsObj['ri_t0d'] = i
            srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
            srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
            srcRsObj['invMismatchName'] = nisfRows[i]['invName']
            srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']

            searchResults.push(srcRsObj)
          }
        }

        // searchResults.push(srcRsObj)

      }
      console.log(`JSON.stringify(searchResults)==> ${JSON.stringify(searchResults)}`)
    }



    function queryNisfJoinTable() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      connection.query(`SELECT * FROM ${formInput0} ORDER BY ri_t0d;`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-nisfResults', { //render searchResults to vw-MySqlTableHub page
          title: 'sfAud (using nisf table)',
          searchResRows: searchResults,
          loadedSqlTbl: loadedSqlTbl
        })
      })

    }

    queryNisfJoinTable()

  })
}