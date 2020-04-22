const express = require('express')
const router = express.Router()
const mysql = require('mysql')

// const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResRbInvUpdater: router.post('/calcResRbInvUpdater', (req, res, next) => {

    // searchResultsCacheChecker = cacheMainStockFilter.get('searchResultsCache_key');
    // if (searchResultsCacheChecker !== undefined) { //clear searchResultsCache_key if it exists
    //   cacheMainStockFilter.del('searchResultsCache_key')
    // }

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
    // console.log('calcResRbInvUpdater says: searchResults from router.post level===>', searchResults)

    searchResultsSplitParsedArr = []

    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    // console.log('calcResRbInvUpdater says: searchResultsForCSV from router.post level===>', searchResultsForCSV)
    csvContainer = []
    // console.log('calcResRbInvUpdater says: csvContainer from router.post level===>', csvContainer)


    const postBody = req.body
    console.log('calcResRbInvUpdater says: postBody==>', postBody)
    // console.log('calcResRbInvUpdater says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    // console.log('calcResRbInvUpdater says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    let tableName = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('tableName==>', tableName)

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

    let saniRegex1 = /(\[)|(\])/g
    let saniRegex2 = /"/g
    let saniRegex3 = /\s/g

    // /* X(?=Y) 	Positive lookahead 	X if followed by Y
    //  * (?<=Y)X 	Positive lookbehind 	X if after Y
    //  * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
    // let splitRegex1 = /(?<=}),(?={)/g

    function showSearchResults(rows) {

      let nhcrtRows = rows

      for (let i = 0; i < nhcrtRows.length; i++) {
        for (let j = 0; j < storeNameArr.length; j++) {

          storeName = storeNameArr[j]
          storeAbbrev = storeAbbrevArr[j]

          function calcResRbInvUpdater(storeName, storeAbbrev) {
            if (nhcrtRows[i]['stoName'] == storeName) {
              // let rsltsObj = {}
              // rsltsObj['ri_t0d'] = i
              // rsltsObj[`${storeAbbrev}_UPCs`] = nhcrtRows[i]['invScanCode']
              if (nhcrtRows[i]['invLastreceived'] > oneYearAgo ||
                nhcrtRows[i]['invLastsold'] > oneYearAgo ||
                nhcrtRows[i]['invOnhand'] > 0) {
                // rsltsObj[`${storeAbbrev}stocked`] = nhcrtRows[i]['invScanCode']
                if (nhcrtRows[i]['stoName'] == 'Indiana') {
                  srcRsINDstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoName'] == 'Saint Matthews') {
                  srcRsSMstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoName'] == 'Middletown') {
                  srcRsMTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoName'] == 'Springhurst') {
                  srcRsSHstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoName'] == 'Gardiner Lane') {
                  srcRsGLstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
              } else {
                // rsltsObj[`${storeAbbrev}_NOTstocked`] = nhcrtRows[i]['invScanCode']
                if (nhcrtRows[i]['stoName'] == 'Indiana') {
                  srcRsIND_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoName'] == 'Saint Matthews') {
                  srcRsSM_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoName'] == 'Middletown') {
                  srcRsMT_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoName'] == 'Springhurst') {
                  srcRsSH_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoName'] == 'Gardiner Lane') {
                  srcRsGL_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
              }
            }
          }
          calcResRbInvUpdater(storeName, storeAbbrev)
        }
      }

      console.log(`srcRsINDstocked[0]==> ${srcRsINDstocked[0]}`)
      console.log(`typeof srcRsINDstocked[0]==> ${typeof srcRsINDstocked[0]}`)
      // console.log(`srcRsINDstocked==> ${srcRsINDstocked}`)
      // console.log(`JSON.stringify(srcRsINDstocked)==> ${JSON.stringify(srcRsINDstocked)}`)
      // console.log(`typeof JSON.stringify(srcRsINDstocked)==> ${typeof JSON.stringify(srcRsINDstocked)}`)
      // let JSONstringifySrcRsINDstocked = JSON.stringify(srcRsINDstocked)
      // console.log(`typeof JSONstringifySrcRsINDstocked==> ${typeof JSONstringifySrcRsINDstocked}`)

      srcRsINDstockedSani = JSON.stringify(srcRsINDstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      console.log(`typeof srcRsINDstockedSani==> ${typeof srcRsINDstockedSani}`)
      console.log(`srcRsINDstockedSani==> ${srcRsINDstockedSani}`)
      srcRsIND_NOTstockedSani = JSON.stringify(srcRsIND_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSMstockedSani = JSON.stringify(srcRsSMstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSM_NOTstockedSani = JSON.stringify(srcRsSM_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsMTstockedSani = JSON.stringify(srcRsMTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsMT_NOTstockedSani = JSON.stringify(srcRsMT_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSHstockedSani = JSON.stringify(srcRsSHstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSH_NOTstockedSani = JSON.stringify(srcRsSH_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsGLstockedSani = JSON.stringify(srcRsGLstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsGL_NOTstockedSani = JSON.stringify(srcRsGL_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")

      // searchResults.push(srcRsINDstockedSani, srcRsIND_NOTstockedSani, srcRsSMstockedSani, srcRsSM_NOTstockedSani,
      //   srcRsMTstockedSani, srcRsMT_NOTstockedSani, srcRsSHstockedSani, srcRsSH_NOTstockedSani,
      //   srcRsGLstockedSani, srcRsGL_NOTstockedSani)

      // let searchResultsToString = searchResults.toString()
      // searchResultsSplit = searchResultsToString.split(splitRegex1)
      // console.log(`searchResultsSplit.length==> ${searchResultsSplit.length}`)
      // console.log(`searchResultsSplit[0]==> ${searchResultsSplit[0]}`)
      // console.log(`typeof searchResultsSplit[0]==> ${typeof searchResultsSplit[0]}`)
      // console.log(`typeof JSON.parse(searchResultsSplit[0])==> ${typeof JSON.parse(searchResultsSplit[0])}`)

      // for (let k = 0; k < searchResultsSplit.length; k++) {
      //   let searchResultsSplitParsed = JSON.parse(searchResultsSplit[k])
      //   searchResultsSplitParsedArr.push(searchResultsSplitParsed)
      // }
      // console.log(`searchResultsSplitParsedArr[0]['ri_t0d']==> ${searchResultsSplitParsedArr[0]['ri_t0d']}`)
    }


    function queryNhcrtTable() {
      connection.query(`SELECT * FROM ${tableName}`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)
        // console.log(`searchResultsSplit[0] called from queryNhcrtTable==> ${searchResultsSplit[0]}`)
        // console.log(`JSON.stringify(srcRsINDstocked[0]) called from queryNhcrtTable==> ${JSON.stringify(srcRsINDstocked[0])}`)

        console.log(`srcRsINDstocked[0] called from queryNhcrtTable==> ${srcRsINDstocked[0]}`)

        // res.render('vw-rbInvUpdater', { //render searchResults to vw-MySqlTableHub page
        //   title: 'vw-rbInvUpdater (using nhcrtRbInv table)',
        //   searchResRows: searchResultsSplit,
        //   // loadedSqlTbl: loadedSqlTbl,
        //   srcRsINDstocked: srcRsINDstocked,
        //   srcRsIND_NOTstocked: srcRsIND_NOTstocked,
        //   srcRsSMstocked: srcRsSMstocked,
        //   srcRsSM_NOTstocked: srcRsSM_NOTstocked,
        //   srcRsMTstocked: srcRsMTstocked,
        //   srcRsMT_NOTstocked: srcRsMT_NOTstocked,
        //   srcRsSHstocked: srcRsSHstocked,
        //   srcRsSH_NOTstocked: srcRsSH_NOTstocked,
        //   srcRsGLstocked: srcRsGLstocked,
        //   srcRsGL_NOTstocked: srcRsGL_NOTstocked,
        //   searchResultsSplitParsedArr: searchResultsSplitParsedArr
        // })
      })
    }
    queryNhcrtTable()

    function update_rb_inventory() {
      connection.query(`
      UPDATE rb_inventory_titus_20200415
      SET inv_in_stock = '1'
      WHERE trim(inv_upc)
      IN (${INDstockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_in_stock = '0'
      WHERE trim(inv_upc)
      IN (${IND_NOTStockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_sm_stock = '1'
      WHERE trim(inv_upc)
      IN (${SMstockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_sm_stock = '0'
      WHERE trim(inv_upc)
      IN (${SM_NOTStockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_mt_stock = '1'
      WHERE trim(inv_upc)
      IN (${MTstockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_mt_stock = '0'
      WHERE trim(inv_upc)
      IN (${MT_NOTStockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_sh_stock = '1'
      WHERE trim(inv_upc)
      IN (${SHstockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_sh_stock = '0'
      WHERE trim(inv_upc)
      IN (${SH_NOTStockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_gl_stock = '1'
      WHERE trim(inv_upc)
      IN (${GLstockedUPCstring});
      
      UPDATE rb_inventory_titus_20200415
      SET inv_gl_stock = '0'
      WHERE trim(inv_upc)
      IN (${GL_NOTStockedUPCstring});`, function (err, rows, fields) {
        if (err) throw err

        res.render('vw-rbInvUpdater', { //render searchResults to vw-MySqlTableHub page
          title: 'vw-rbInvUpdater ==>> rb_inventory_titus_20200415 updated',
          // searchResRows: searchResultsSplit,
          // srcRsINDstocked: srcRsINDstocked,
          // srcRsIND_NOTstocked: srcRsIND_NOTstocked,
          // srcRsSMstocked: srcRsSMstocked,
          // srcRsSM_NOTstocked: srcRsSM_NOTstocked,
          // srcRsMTstocked: srcRsMTstocked,
          // srcRsMT_NOTstocked: srcRsMT_NOTstocked,
          // srcRsSHstocked: srcRsSHstocked,
          // srcRsSH_NOTstocked: srcRsSH_NOTstocked,
          // srcRsGLstocked: srcRsGLstocked,
          // srcRsGL_NOTstocked: srcRsGL_NOTstocked,
          // searchResultsSplitParsedArr: searchResultsSplitParsedArr
        })
      })
    }
    // update_rb_inventory()
  })
}