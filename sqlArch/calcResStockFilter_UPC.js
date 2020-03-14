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

    searchResults = [] //clear searchResults from previous search
    console.log('calcResStockFilter_UPC says: searchResults from router.post level===>', searchResults)
    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    console.log('calcResStockFilter_UPC says: searchResultsForCSV from router.post level===>', searchResultsForCSV)
    csvContainer = []
    console.log('calcResStockFilter_UPC says: csvContainer from router.post level===>', csvContainer)


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

    // let oneYearAgoRaw = todaysDateRaw.setFullYear(todaysDateRaw.getFullYear() - 1)
    // console.log(`oneYearAgoRaw==> ${oneYearAgoRaw}`)
    let oneYearAgoRaw_iso = oneYearAgoRaw_pre.toISOString()
    let oneYearAgoRaw_split = oneYearAgoRaw_iso.split('T')
    let oneYearAgo = oneYearAgoRaw_split[0]
    console.log(`oneYearAgo==> ${oneYearAgo}`)

    let storeNameArr = ['Indiana', 'Saint Matthews', 'Middletown', 'Springhurst', 'Gardiner Lane']
    let storeAbbrevArr = ['IND', 'SM', 'MT', 'SH', 'GL']


    function showSearchResults(rows) {

      let nhcrtRows = rows
      // let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table

      console.log(`JSON.stringify(nhcrtRows[0])==> ${JSON.stringify(nhcrtRows[0])}`)
      console.log(`nhcrtRows.length==> ${nhcrtRows.length}`)

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
                rsltsObj[`${storeAbbrev}_Comments1`] = 'stocked'
              } else {
                rsltsObj[`${storeAbbrev}_Comments1`] = 'NOTstocked'
              }
              searchResults.push(rsltsObj)
            }
          }
          calcResStockFilter_UPC(storeName, storeAbbrev)
        }

        // calcResStockFilter_UPC('Indiana', 'IND')
        // calcResStockFilter_UPC('Saint Matthews', 'SM')
        // calcResStockFilter_UPC('Middletown', 'MT')
        // calcResStockFilter_UPC('Springhurst', 'SH')
        // calcResStockFilter_UPC('Gardiner Lane', 'GL')
      }


      // for (let i = 0; i < nhcrtRows.length; i++) { //Add searched-for table entries from db to searchResults array, for
      //   //displaying in the dynamic DOM table. Also add margin data, & retail & charm calcs to display in DOM table

      //   function sfAud3(storeName, inStockCode) { //i.e. storeName = 'Indiana', inStockCode = 'IND'

      //     let parsedInvVal = parseInt(nhcrtRows[i]['invOnhand'])

      //     function sfAud3Results(shouldBeStockedOrNot) {
      //       if (nhcrtRows[i]['stoName'] == storeName) {
      //         let srcRsObj = {}
      //         srcRsObj['ri_t0d'] = i
      //         srcRsObj['invMismatchUPC'] = nhcrtRows[i]['invScanCode']
      //         srcRsObj['invMismatchSKU'] = nhcrtRows[i]['ordSupplierStockNumber']
      //         srcRsObj['invMismatchName'] = nhcrtRows[i]['invName']
      //         srcRsObj['invMismatchStore'] = nhcrtRows[i]['stoName']
      //         srcRsObj['invMismatchSFdata'] = nhcrtRows[i][inStockCode]
      //         srcRsObj['invMismatchCPLTdata'] = nhcrtRows[i]['invOnhand']
      //         srcRsObj['invMismatchLastRecd'] = nhcrtRows[i]['invLastreceived']
      //         srcRsObj['invMismatchLastSold'] = nhcrtRows[i]['invLastsold']

      //         srcRsObj['Comments2'] = shouldBeStockedOrNot

      //         if (('2020-03-05' > nhcrtRows[i]['invLastreceived'] && nhcrtRows[i]['invLastreceived'] > '2019-12-05') ||
      //           ('2020-03-05' > nhcrtRows[i]['invLastsold'] && nhcrtRows[i]['invLastsold'] > '2019-12-05')) {
      //           srcRsObj['LastRecd0_3'] = nhcrtRows[i]['invLastreceived']
      //           if (nhcrtRows[i][inStockCode] !== '-') {
      //             srcRsObj['Comments1'] = 'SFsaysStockedBut0_3'
      //           }
      //           if (nhcrtRows[i][inStockCode] == '-') {
      //             srcRsObj['Comments1'] = 'SFsaysNOTStockedBut0_3'
      //             if (parsedInvVal > 0) {
      //               srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
      //             }
      //           }
      //         }
      //         if (('2019-12-05' > nhcrtRows[i]['invLastreceived'] && nhcrtRows[i]['invLastreceived'] > '2019-09-05') ||
      //           ('2019-12-05' > nhcrtRows[i]['invLastsold'] && nhcrtRows[i]['invLastsold'] > '2019-09-05')) {
      //           srcRsObj['LastRecd3_6'] = nhcrtRows[i]['invLastreceived']
      //           if (nhcrtRows[i][inStockCode] !== '-') {
      //             srcRsObj['Comments1'] = 'SFsaysStockedBut3_6'
      //           }
      //           if (nhcrtRows[i][inStockCode] == '-') {
      //             srcRsObj['Comments1'] = 'SFsaysNOTStockedBut3_6'
      //             if (parsedInvVal > 0) {
      //               srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
      //             }
      //           }
      //         }
      //         if (('2019-09-05' > nhcrtRows[i]['invLastreceived'] && nhcrtRows[i]['invLastreceived'] > '2019-06-05') ||
      //           ('2019-09-05' > nhcrtRows[i]['invLastsold'] && nhcrtRows[i]['invLastsold'] > '2019-06-05')) {
      //           srcRsObj['LastRecd6_9'] = nhcrtRows[i]['invLastreceived']
      //           if (nhcrtRows[i][inStockCode] !== '-') {
      //             srcRsObj['Comments1'] = 'SFsaysStockedBut6_9'
      //           }
      //           if (nhcrtRows[i][inStockCode] == '-') {
      //             srcRsObj['Comments1'] = 'SFsaysNOTStockedBut6_9'
      //             if (parsedInvVal > 0) {
      //               srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
      //             }
      //           }
      //         }
      //         if (('2019-06-05' > nhcrtRows[i]['invLastreceived'] && nhcrtRows[i]['invLastreceived'] > '2019-03-05') ||
      //           ('2019-06-05' > nhcrtRows[i]['invLastsold'] && nhcrtRows[i]['invLastsold'] > '2019-03-05')) {
      //           srcRsObj['LastRecd9_12'] = nhcrtRows[i]['invLastreceived']
      //           if (nhcrtRows[i][inStockCode] !== '-') {
      //             srcRsObj['Comments1'] = 'SFsaysStockedBut9_12'
      //           }
      //           if (nhcrtRows[i][inStockCode] == '-') {
      //             srcRsObj['Comments1'] = 'SFsaysNOTStockedBut9_12'
      //             if (parsedInvVal > 0) {
      //               srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
      //             }
      //           }
      //         }
      //         if (('2019-03-05' > nhcrtRows[i]['invLastreceived']) &&
      //           ('2019-03-05' > nhcrtRows[i]['invLastsold'])) {
      //           srcRsObj['LastRecd12plus'] = nhcrtRows[i]['invLastreceived']
      //           if (nhcrtRows[i][inStockCode] !== '-') {
      //             srcRsObj['Comments1'] = 'SFsaysStockedBut12plus'
      //           }
      //           if (nhcrtRows[i][inStockCode] == '-') {
      //             srcRsObj['Comments1'] = 'SFsaysNOTStockedBut12plus'
      //             if (parsedInvVal > 0) {
      //               srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
      //             }
      //           }
      //         }
      //         searchResults.push(srcRsObj)
      //       }
      //     }

      //     if (nhcrtRows[i][inStockCode] == '-') {
      //       if ((nhcrtRows[i]['invLastsold'] == '' || nhcrtRows[i]['invLastsold'] == undefined) &&
      //         (nhcrtRows[i]['invLastreceived'] == '' || nhcrtRows[i]['invLastreceived'] == undefined)) {
      //         sfAud3Results('NO LAST SOLD/RECD DATA')
      //       }
      //       if (nhcrtRows[i]['invLastsold'] > '2019-03-05') {
      //         sfAud3Results('SHOULD_be_stocked')
      //       }
      //       if (nhcrtRows[i]['invLastreceived'] > '2019-03-05') {
      //         sfAud3Results('SHOULD_be_stocked')
      //       }
      //       if (parsedInvVal > 0) {
      //         sfAud3Results('SHOULD_be_stocked')
      //       }


      //     }

      //     if (nhcrtRows[i][inStockCode] !== '-') {
      //       if ((nhcrtRows[i]['invLastsold'] == '' || nhcrtRows[i]['invLastsold'] == undefined) &&
      //         (nhcrtRows[i]['invLastreceived'] == '' || nhcrtRows[i]['invLastreceived'] == undefined)) {
      //         sfAud3Results('NO LAST SOLD/RECD DATA')
      //       } else {
      //         if (nhcrtRows[i]['invLastsold'] < '2019-03-05' && nhcrtRows[i]['invLastreceived'] < '2019-03-05' && parsedInvVal <= 0) {
      //           sfAud3Results('should_NOT_be_stocked')
      //         }
      //       }
      //       // if (nhcrtRows[i]['invLastsold'] < '2019-03-05' && nhcrtRows[i]['invLastreceived'] < '2019-03-05' && parsedInvVal <= 0) {
      //       //   sfAud3Results('should_NOT_be_stocked')
      //       // }


      //     }
      //   }

      //   sfAud3('Indiana', 'IND')
      //   sfAud3('Saint Matthews', 'SM')
      //   sfAud3('Middletown', 'MT')
      //   sfAud3('Springhurst', 'SH')
      //   sfAud3('Gardiner Lane', 'GL')

      // }
      console.log(`JSON.stringify(searchResults)==> ${JSON.stringify(searchResults)}`)
    }



    function queryNhcrtTable() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      // connection.query(`SELECT * FROM ${formInput0} ORDER BY invLastreceived;`, function (err, rows, fields) {
      //   if (err) throw err
      //   showSearchResults(rows)

      //   res.render('vw-nhcrtResults3', { //render searchResults to vw-MySqlTableHub page
      //     title: 'sfAud3 (using nhcrt table)',
      //     searchResRows: searchResults,
      //     loadedSqlTbl: loadedSqlTbl
      //   })
      // })
      connection.query(`SELECT * FROM ${formInput0}`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-stockFilter_UPC', { //render searchResults to vw-MySqlTableHub page
          title: 'stockFilter_UP (using nhcrt table)',
          searchResRows: searchResults,
          loadedSqlTbl: loadedSqlTbl
        })
      })

    }

    queryNhcrtTable()

  })
}