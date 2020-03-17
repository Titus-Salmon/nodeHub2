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

  calcResStockFilter_UPC: router.post('/calcResStockFilter_UPC', (req, res, next) => {

    srcRsINDstocked = []
    srcRsIND_NOTstocked = []
    srcRsSMstocked = []
    srcRsSM_NOTstocked = []
    srcRsMTstocked = []
    srcRsMT_NOTstocked = []
    srcRsSHstocked = []
    srcRsSH_NOTstocked = []
    srcRsGLstocked = []
    srcRsGL_NOTstocked = []

    searchResults = [] //clear searchResults from previous search
    // console.log('calcResStockFilter_UPC says: searchResults from router.post level===>', searchResults)
    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    // console.log('calcResStockFilter_UPC says: searchResultsForCSV from router.post level===>', searchResultsForCSV)
    csvContainer = []
    // console.log('calcResStockFilter_UPC says: csvContainer from router.post level===>', csvContainer)


    const postBody = req.body
    console.log('calcResStockFilter_UPC says: postBody==>', postBody)
    console.log('calcResStockFilter_UPC says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    console.log('calcResStockFilter_UPC says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    let formInput0 = Object.values(postBody)[0] = loadedSqlTbl = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)

    let todaysDateRaw = new Date()
    let todaysDateRaw_iso = todaysDateRaw.toISOString()
    let todaysDateRaw_split = todaysDateRaw_iso.split('T')
    let todaysDate = todaysDateRaw_split[0]
    console.log(`todaysDate==> ${todaysDate}`)

    let oneYearAgoRaw_pre = todaysDateRaw
    oneYearAgoRaw_pre.setFullYear(todaysDateRaw.getFullYear() - 1)

    let oneYearAgoRaw_iso = oneYearAgoRaw_pre.toISOString()
    let oneYearAgoRaw_split = oneYearAgoRaw_iso.split('T')
    let oneYearAgo = oneYearAgoRaw_split[0]
    console.log(`oneYearAgo==> ${oneYearAgo}`)

    let storeNameArr = ['Indiana', 'Saint Matthews', 'Middletown', 'Springhurst', 'Gardiner Lane']
    let storeAbbrevArr = ['IND', 'SM', 'MT', 'SH', 'GL']

    function showSearchResults(rows) {

      let nhcrtRows = rows

      for (let i = 0; i < nhcrtRows.length; i++) {
        for (let j = 0; j < storeNameArr.length; j++) {

          storeName = storeNameArr[j]
          storeAbbrev = storeAbbrevArr[j]

          function calcResStockFilter_UPC(storeName, storeAbbrev) {
            if (nhcrtRows[i]['stoName'] == storeName) {
              let rsltsObj = {}
              rsltsObj['ri_t0d'] = i
              rsltsObj[`${storeAbbrev}_UPCs`] = nhcrtRows[i]['invScanCode']
              if (nhcrtRows[i]['invLastreceived'] > oneYearAgo ||
                nhcrtRows[i]['invLastsold'] > oneYearAgo ||
                nhcrtRows[i]['invOnhand'] > 0) {
                rsltsObj[`${storeAbbrev}stocked`] = nhcrtRows[i]['invScanCode']
                if (nhcrtRows[i]['stoName'] == 'Indiana') {
                  srcRsINDstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Saint Matthews') {
                  srcRsSMstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Middletown') {
                  srcRsMTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Springhurst') {
                  srcRsSHstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Gardiner Lane') {
                  srcRsGLstocked.push(rsltsObj)
                }
              } else {
                rsltsObj[`${storeAbbrev}_NOTstocked`] = nhcrtRows[i]['invScanCode']
                if (nhcrtRows[i]['stoName'] == 'Indiana') {
                  srcRsIND_NOTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Saint Matthews') {
                  srcRsSM_NOTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Middletown') {
                  srcRsMT_NOTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Springhurst') {
                  srcRsSH_NOTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Gardiner Lane') {
                  srcRsGL_NOTstocked.push(rsltsObj)
                }
              }
              // searchResults.push(rsltsObj)
            }
            searchResults.push(srcRsINDstocked, srcRsIND_NOTstocked, srcRsSMstocked, srcRsSM_NOTstocked, srcRsMTstocked, srcRsMT_NOTstocked,
              srcRsSHstocked, srcRsSH_NOTstocked, srcRsGLstocked, srcRsGL_NOTstocked)
          }
          calcResStockFilter_UPC(storeName, storeAbbrev)
        }
      }
      // console.log(`JSON.stringify(searchResults)==> ${JSON.stringify(searchResults)}`)
    }

    // srcRsINDstocked = []
    // srcRsIND_NOTstocked = []
    // srcRsSMstocked = []
    // srcRsSM_NOTstocked = []
    // srcRsMTstocked = []
    // srcRsMT_NOTstocked = []
    // srcRsSHstocked = []
    // srcRsSH_NOTstocked = []
    // srcRsGLstocked = []
    // srcRsGL_NOTstocked = []


    function queryNhcrtTable() {
      connection.query(`SELECT * FROM ${formInput0}`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-stockFilter_UPC', { //render searchResults to vw-MySqlTableHub page
          title: 'stockFilter_UP (using nhcrt table)',
          searchResRows: searchResults,
          loadedSqlTbl: loadedSqlTbl,
          srcRsINDstocked: srcRsINDstocked,
          srcRsIND_NOTstocked: srcRsIND_NOTstocked,
          srcRsSMstocked: srcRsSMstocked,
          srcRsSM_NOTstocked: srcRsSM_NOTstocked,
          srcRsMTstocked: srcRsMTstocked,
          srcRsMT_NOTstocked: srcRsMT_NOTstocked,
          srcRsSHstocked: srcRsSHstocked,
          srcRsSH_NOTstocked: srcRsSH_NOTstocked,
          srcRsGLstocked: srcRsGLstocked,
          srcRsGL_NOTstocked: srcRsGL_NOTstocked,

        })
      })
    }

    queryNhcrtTable()

  })
}