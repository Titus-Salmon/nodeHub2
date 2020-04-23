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

    wishlistIgnore = []
    wishlistUpdate = []

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

    let todaysDateRaw1 = new Date()
    let todaysDateRaw1_iso = todaysDateRaw1.toISOString()
    let todaysDateRaw1_split = todaysDateRaw1_iso.split('T')
    let todaysDate1 = todaysDateRaw1_split[0]
    console.log(`todaysDate1==> ${todaysDate1}`)

    //v//////////one year ago///////////////////////////////////////
    let oneYearAgoRaw_pre = todaysDateRaw1
    oneYearAgoRaw_pre.setFullYear(todaysDateRaw1.getFullYear() - 1)

    let oneYearAgoRaw_iso = oneYearAgoRaw_pre.toISOString()
    let oneYearAgoRaw_split = oneYearAgoRaw_iso.split('T')
    let oneYearAgo = oneYearAgoRaw_split[0]
    console.log(`oneYearAgo==> ${oneYearAgo}`)
    //^//////////one year ago///////////////////////////////////////

    //v//////////one month ago///////////////////////////////////////
    let today = new Date()
    let todayInMilliseconds = today.getTime()
    let oneMonthAgoInMilliseconds = todayInMilliseconds - 2592000000
    let todayISO = new Date(today).toISOString()
    console.log(`todayISO==> ${todayISO}`)
    let oneMonthAgoISO = new Date(oneMonthAgoInMilliseconds).toISOString()
    console.log(`oneMonthAgoISO==> ${oneMonthAgoISO}`)
    let oneMonthAgoISO_split = oneMonthAgoISO.split('T')
    let oneMonthAgo = oneMonthAgoISO_split[0]
    console.log(`oneMontghAgo==> ${oneMonthAgo}`)
    //^//////////one month ago///////////////////////////////////////

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

      let nhcrtRows = rows[0]
      let wishlistRows = rows[1]

      console.log(`nhcrtRows[0]==> ${nhcrtRows[0]}`)
      console.log(`JSON.stringify(nhcrtRows[0])==> ${JSON.stringify(nhcrtRows[0])}`)
      console.log(`wishlistRows[0]==> ${wishlistRows[0]}`)
      console.log(`JSON.stringify(wishlistRows[0])==> ${JSON.stringify(wishlistRows[0])}`)

      // let wishlistCheckerObj = {}

      for (let k = 0; k < wishlistRows.length; k++) {
        let wishlistCheckerObj = {}
        if (wishlistRows[k]['rb_approved'] > oneMonthAgo) {
          wishlistCheckerObj['upc'] = wishlistRows[k]['upc_code']
          wishlistCheckerObj['dateApproved'] = wishlistRows[k]['rb_approved']
          wishlistUpdate.push(wishlistCheckerObj)
        } else {
          wishlistCheckerObj['upc'] = wishlistRows[k]['upc_code']
          wishlistCheckerObj['dateApproved'] = wishlistRows[k]['rb_approved']
          wishlistIgnore.push(wishlistCheckerObj)
        }
      }

      console.log(`JSON.stringify(wishlistUpdate[0])==> ${JSON.stringify(wishlistUpdate[0])}`)
      console.log(`JSON.stringify(wishlistIgnore[0])==> ${JSON.stringify(wishlistIgnore[0])}`)

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

      srcRsINDstockedSani = JSON.stringify(srcRsINDstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      console.log(`typeof srcRsINDstockedSani==> ${typeof srcRsINDstockedSani}`)
      // console.log(`srcRsINDstockedSani==> ${srcRsINDstockedSani}`)
      srcRsIND_NOTstockedSani = JSON.stringify(srcRsIND_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSMstockedSani = JSON.stringify(srcRsSMstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSM_NOTstockedSani = JSON.stringify(srcRsSM_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsMTstockedSani = JSON.stringify(srcRsMTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsMT_NOTstockedSani = JSON.stringify(srcRsMT_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSHstockedSani = JSON.stringify(srcRsSHstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSH_NOTstockedSani = JSON.stringify(srcRsSH_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsGLstockedSani = JSON.stringify(srcRsGLstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsGL_NOTstockedSani = JSON.stringify(srcRsGL_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")

    }


    function queryNhcrtTable() {
      connection.query(`
      SELECT * FROM ${tableName};
      SELECT * FROM rb_wishlist;`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        console.log(`srcRsINDstocked[0] called from queryNhcrtTable==> ${srcRsINDstocked[0]}`)

        connection.query(`
        UPDATE rb_inventory_titus_20200415
        SET inv_in_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsINDstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_in_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsIND_NOTstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_sm_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsSMstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_sm_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsSM_NOTstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_mt_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsMTstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_mt_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsMT_NOTstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_sh_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsSHstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_sh_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsSH_NOTstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_gl_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsGLstockedSani});
        
        UPDATE rb_inventory_titus_20200415
        SET inv_gl_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsGL_NOTstockedSani});`, function (err, rows, fields) {
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

      })
    }
    queryNhcrtTable()

    function update_rb_inventory() {

      // srcRsINDstockedSani = JSON.stringify(srcRsINDstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // console.log(`typeof srcRsINDstockedSani==> ${typeof srcRsINDstockedSani}`)
      // console.log(`srcRsINDstockedSani==> ${srcRsINDstockedSani}`)
      // srcRsIND_NOTstockedSani = JSON.stringify(srcRsIND_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // srcRsSMstockedSani = JSON.stringify(srcRsSMstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // srcRsSM_NOTstockedSani = JSON.stringify(srcRsSM_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // srcRsMTstockedSani = JSON.stringify(srcRsMTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // srcRsMT_NOTstockedSani = JSON.stringify(srcRsMT_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // srcRsSHstockedSani = JSON.stringify(srcRsSHstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // srcRsSH_NOTstockedSani = JSON.stringify(srcRsSH_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // srcRsGLstockedSani = JSON.stringify(srcRsGLstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // srcRsGL_NOTstockedSani = JSON.stringify(srcRsGL_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")

      connection.query(`
      UPDATE rb_inventory_titus_20200415
      SET inv_in_stock = '1'
      WHERE trim(inv_upc)
      IN (${srcRsINDstockedSani})
      
      SET inv_in_stock = '0'
      WHERE trim(inv_upc)
      IN (${srcRsIND_NOTstockedSani})
      
      SET inv_sm_stock = '1'
      WHERE trim(inv_upc)
      IN (${srcRsSMstockedSani})
      
      SET inv_sm_stock = '0'
      WHERE trim(inv_upc)
      IN (${srcRsSM_NOTstockedSani})
      
      SET inv_mt_stock = '1'
      WHERE trim(inv_upc)
      IN (${srcRsMTstockedSani})
      
      SET inv_mt_stock = '0'
      WHERE trim(inv_upc)
      IN (${srcRsMT_NOTstockedSani})
      
      SET inv_sh_stock = '1'
      WHERE trim(inv_upc)
      IN (${srcRsSHstockedSani})
      
      SET inv_sh_stock = '0'
      WHERE trim(inv_upc)
      IN (${srcRsSH_NOTstockedSani})
      
      SET inv_gl_stock = '1'
      WHERE trim(inv_upc)
      IN (${srcRsGLstockedSani})
      
      SET inv_gl_stock = '0'
      WHERE trim(inv_upc)
      IN (${srcRsGL_NOTstockedSani});`, function (err, rows, fields) {
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