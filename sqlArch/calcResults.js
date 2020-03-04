const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const gEnericHdrObj = require('../funcLibT0d/genericHdrObj')
const cAlcRsFrmInputs = require('../funcLibT0d/calcResFormInputs')
const paginPost = require('../funcLibT0d/paginPost')
const showSearchResults = require('../funcLibT0d/showSearchResults')

// const NodeCache = require('node-cache')
const {
  formInputsObjCache,
  genericHeaderObjCache
} = require('../nodeCacheStuff/cache1')
// genericHeaderObjCache = new NodeCache()

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResults: router.post('/calcResults', (req, res, next) => {

    let searchResultsNonPag = [] //clear searchResultsNonPag from previous search
    let searchResultsPag = [] //clear searchResultsPag from previous search
    srcRsCSV_Pag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSV_nonPag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSVrvwPag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSVrvw_nonPag = [] //why does this break if instantiated with "let"? A question for another time...
    csvContainer = [] //why does this break if instantiated with "let"? A question for another time...
    const postBody = req.body

    // const formInputsObjCache = new NodeCache()
    // const genericHeaderObjCache = new NodeCache()

    formInputsObjCacheChecker = formInputsObjCache.get('formInputsObjCache_key');
    if (formInputsObjCacheChecker !== undefined) {
      formInputsObjCache.del('formInputsObjCache_key')
    }
    genericHeaderObjCacheChecker = genericHeaderObjCache.get('genericHeaderObjCache_key');
    if (genericHeaderObjCacheChecker !== undefined) {
      genericHeaderObjCache.del('genericHeaderObjCache_key')
    }

    let frmInptsObj = {} //provide empty object to populate with form inputs & values generated from calcResFormInputs.js module
    cAlcRsFrmInputs.clcRsFrmInpts(postBody, frmInptsObj)
    // const formInputsObjCache = new NodeCache()
    formInputsObjCache.set('formInputsObjCache_key', frmInptsObj)
    console.log(`formInputsObjCache from POST==> ${formInputsObjCache}`)
    console.log(`JSON.stringify(formInputsObjCache) from POST==> ${JSON.stringify(formInputsObjCache)}`)

    let genericHeaderObj = {} //provide empty object to populate with generic headers generated from genericHdrObj.js module
    gEnericHdrObj.gnrcHdrObj(postBody, genericHeaderObj)
    // const genericHeaderObjCache = new NodeCache()
    genericHeaderObjCache.set('genericHeaderObjCache_key', genericHeaderObj)
    console.log(`genericHeaderObjCache from POST==> ${genericHeaderObjCache}`)
    console.log(`JSON.stringify(genericHeaderObjCache) from POST==> ${JSON.stringify(genericHeaderObjCache)}`)

    let pageLinkArray = []
    let numPagesPlaceholder = []

    let paginPostObj = {}
    paginPost.paginPost(postBody, paginPostObj, pageLinkArray, numPagesPlaceholder)

    function queryNejTablePaginated() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      //filters by UPC & catapult cost (want to grab any differing cost items & make decision on what to do in showSearchResults())
      connection.query( //1st query is pagination query; 2nd query is getting EDLP data; 3rd query is non-paginated query;
        //4th query is for getting COUNT (# of total rows)
        `SELECT * FROM ${frmInptsObj.formInput0} GROUP BY ${genericHeaderObj.upcHeader},
      ${genericHeaderObj.invLastcostHeader} ORDER BY ${genericHeaderObj.upcHeader} 
      LIMIT ${paginPostObj['offsetPost']},${paginPostObj['numQueryRes']};

      SELECT * FROM rb_edlp_data;
      
      SELECT * FROM ${frmInptsObj.formInput0} GROUP BY ${genericHeaderObj.upcHeader},
      ${genericHeaderObj.invLastcostHeader} ORDER BY ${genericHeaderObj.upcHeader};
      
      SELECT COUNT(*) FROM ${frmInptsObj.formInput0};`,

        function (err, rows, fields) {
          if (err) throw err

          let nejRowsPagin = rows[0] //targets 1st query on NEJ table
          let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
          let nejRowsNonPagin = rows[2] //targets 3rd query on NEJ table

          let countRows = rows[3]
          console.log(`JSON.stringify(countRows) from calaResults.js==> ${JSON.stringify(countRows)}`)
          let totalRows = countRows[0]['COUNT(*)']

          console.log(`totalRows from calcResults.js==> ${totalRows}`)

          let numPages = Math.ceil(totalRows / numQueryRes) //round up to account for fractions of pages (i.e. 22.3 pages ==> 23 pages)
          console.log(`numPages==> ${numPages}`)
          numPagesPlaceholder.push(numPages)

          // let pageLinkObj = {}
          for (let j = 0; j < numPages; j++) {
            let pageLinkObj = {}
            pageLinkObj[`page${j}`] = j
            pageLinkArray.push(pageLinkObj)
          }

          showSearchResults.showSearchResults(rows, genericHeaderObj, frmInptsObj, searchResultsNonPag, srcRsCSV_nonPag, srcRsCSVrvw_nonPag,
            edlpRows, nejRowsNonPagin)

          showSearchResults.showSearchResults(rows, genericHeaderObj, frmInptsObj, searchResultsPag, srcRsCSV_Pag, srcRsCSVrvwPag,
            edlpRows, nejRowsPagin)

          res.render('vw-MySqlTableHub', { //render searchResults to vw-MySqlTableHub page
            title: `Retail Price Calculator (using nhcrtEdiJoin table: <<${frmInptsObj.loadedSqlTbl}>>)`,
            searchResRows: searchResultsPag,
            loadedSqlTbl: frmInptsObj.loadedSqlTbl,
            numQueryRes: paginPostObj.numQueryRes,
            currentPage: paginPostObj.currentPage,
            pageLinkArray: pageLinkArray,
            numberOfPages: numPagesPlaceholder[0],
            lastPage: numPagesPlaceholder[0] - 1,
            firstPage: 0,
            tableName: frmInptsObj.formInput0,
            formInputsObj: frmInptsObj,
            upcHeader: genericHeaderObj.upcHeader,
            invLastcostHeader: genericHeaderObj.invLastcostHeader,
            searchResultsPag: searchResultsPag,
            searchResultsPag_stringified: JSON.stringify(searchResultsPag),
            offsetPost: paginPostObj.offsetPost,
            offsetPost: paginPostObj.offsetPost,
            genericHeaderObj_stringified: JSON.stringify(genericHeaderObj),
            formInputsObj_stringified: JSON.stringify(frmInptsObj)
            // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
          })
        })
    }
    queryNejTablePaginated()
  }),


  // calcResultsGET: router.get('/calcResults', (req, res, next) => {

  //   console.log(`JSON.stringify(formInputsObjCache) from GET==> ${JSON.stringify(formInputsObjCache)}`)
  //   console.log(`JSON.stringify(genericHeaderObjCache) from GET==> ${JSON.stringify(genericHeaderObjCache)}`)

  //   let searchResultsPagGETarr = [] //clear searchResultsPag from previous search
  //   srcRsCSV_PagGETarr = []
  //   srcRsCSVrvwPagGETarr = []

  //   console.log(`req.query==> ${req.query}`)

  //   console.log(`encodeURIComponent(req.query)==> ${decodeURIComponent(req.query)}`)

  //   console.log(`JSON.stringify(req.query)==> ${JSON.stringify(req.query)}`)
  //   console.log(`req.query.page==> ${req.query.page}`)
  //   console.log(`req.query.tableName==> ${req.query.tableName}`)
  //   console.log(`req.query.numQueryRes==> ${req.query.numQueryRes}`)

  //   let page = parseInt(decodeURIComponent(req.query.page))
  //   let tableName = decodeURIComponent(req.query.tableName)
  //   let numQueryRes = decodeURIComponent(req.query.numQueryRes)

  //   let offset = page * numQueryRes

  //   // console.log(`req.query.formInputsObj_stringified==> ${req.query.formInputsObj_stringified}`)
  //   // let formInputsObjGET = JSON.parse(decodeURIComponent(req.query.formInputsObj_stringified))
  //   // console.log(`formInputsObjGET==> ${formInputsObjGET}`)
  //   // let genericHeaderObjGET = JSON.parse(decodeURIComponent(req.query.genericHeaderObj_stringified))
  //   // console.log(`genericHeaderObjGET==> ${genericHeaderObjGET}`)
  //   // console.log(`JSON.stringify(genericHeaderObjGET)==> ${JSON.stringify(genericHeaderObjGET)}`)
  //   // console.log(`genericHeaderObjGET.upcHeader==> ${genericHeaderObjGET.upcHeader}`)

  //   let paginPostObjGET = decodeURIComponent(req.query.paginPostObj)


  //   let pageLinkArray = []
  //   let numPagesPlaceholder = [] //holds the value for total number of pages; should only be one value
  //   // let srsObjArr = []

  //   let currentPage = page
  //   console.log(`currentPage from GET==> ${currentPage}`)

  //   function queryEDI_Table_GET() {
  //     //The COUNT(*) function returns the number of rows in a result set returned by a SELECT statement.
  //     //The COUNT(*) returns the number of rows including duplicate, non-NULL and NULL rows.
  //     connection.query( //1st query is pagination query; 2nd query is getting EDLP data; 3rd query is non-paginated query;
  //       //4th query is for getting COUNT (# of total rows)
  //       `SELECT * FROM ${tableName} GROUP BY ${genericHeaderObjGET.upcHeader},
  //     ${genericHeaderObjGET.invLastcostHeader} ORDER BY ${genericHeaderObjGET.upcHeader} 
  //     LIMIT ${offset},${numQueryRes};

  //     SELECT * FROM rb_edlp_data;

  //     SELECT * FROM ${tableName} GROUP BY ${genericHeaderObjGET.upcHeader},
  //     ${genericHeaderObjGET.invLastcostHeader} ORDER BY ${genericHeaderObjGET.upcHeader};

  //     SELECT COUNT(*) FROM ${tableName};`,
  //       function (err, rows, fields) {
  //         if (err) throw err

  //         let nejRowsPagin = rows[0] //targets 1st query on NEJ table
  //         let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
  //         let nejRowsNonPagin = rows[2] //targets 3rd query on NEJ table

  //         let countRows = rows[3]

  //         // showSearchRes.showSearchRes(rows, numQueryRes, pageLinkArray, srsObjArr, numPagesPlaceholder)

  //         // showSearchResults.showSearchResults(rows, genericHeaderObjGET, formInputsObjGET, searchResultsNonPag, srcRsCSV_nonPag, srcRsCSVrvw_nonPag,
  //         //   edlpRows, nejRowsNonPagin)

  //         showSearchResults.showSearchResults(rows, genericHeaderObjGET, formInputsObjGET, searchResultsPagGETarr, srcRsCSV_PagGETarr,
  //           srcRsCSVrvwPagGETarr, edlpRows, nejRowsPagin)

  //         res.render('vw-imwGenerator', {
  //           title: `vw-imwGenerator from GET`,
  //           srsObjArr: srsObjArr,
  //           imwProductValObj: imwProductValObj,
  //           imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
  //           // objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
  //           tableName: tableName,
  //           numQueryRes: numQueryRes,
  //           pageLinkArray: pageLinkArray,
  //           currentPage: currentPage,
  //           numberOfPages: numPagesPlaceholder[0],
  //           lastPage: numPagesPlaceholder[0] - 1,
  //           firstPage: 0
  //         })
  //       })
  //   }

  //   queryEDI_Table_GET()
  // })
}