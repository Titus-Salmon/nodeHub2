const express = require('express')
const router = express.Router()
const mysql = require('mysql')

// const gEnericHdrObj = require('../funcLibT0d/genericHdrObj')
// const cAlcRsFrmInputs = require('../funcLibT0d/calcResFormInputs')

const showSearchResults = require('../funcLibT0d/showSearchResults')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {
  calcResultsGET: router.get('/calcResults', (req, res, next) => {
    console.log(`req.query==> ${req.query}`)

    console.log(`encodeURIComponent(req.query)==> ${decodeURIComponent(req.query)}`)

    console.log(`JSON.stringify(req.query)==> ${JSON.stringify(req.query)}`)
    console.log(`req.query.page==> ${req.query.page}`)
    console.log(`req.query.tableName==> ${req.query.tableName}`)
    console.log(`req.query.numQueryRes==> ${req.query.numQueryRes}`)

    let page = parseInt(decodeURIComponent(req.query.page))
    let tableName = decodeURIComponent(req.query.tableName)
    let numQueryRes = decodeURIComponent(req.query.numQueryRes)

    let offset = page * numQueryRes

    let upcHeaderGET = decodeURIComponent(req.query.upcHeader)
    let invLastcostHeaderGET = decodeURIComponent(req.query.invLastcostHeader)

    let formInputsObjGET = decodeURIComponent(req.query.formInputsObj)
    let genericHeaderObjGET = decodeURIComponent(req.query.genericHeaderObj_stringified)
    console.log(`genericHeaderObjGET==> ${genericHeaderObjGET}`)
    console.log(`JSON.parse(genericHeaderObjGET)==> ${JSON.parse(genericHeaderObjGET)}`)
    console.log(`genericHeaderObjGET.upcHeader==> ${genericHeaderObjGET.upcHeader}`)

    let searchResultsPagGET = decodeURIComponent(req.query.searchResultsPag)
    let srcRsCSV_PagGET = decodeURIComponent(req.query.srcRsCSV_Pag)
    let srcRsCSVrvwPagGET = decodeURIComponent(req.query.srcRsCSVrvwPag)

    let paginPostObjGET = decodeURIComponent(req.query.paginPostObj)

    // let imwProductValObj = decodeURIComponent(req.query.imwProductValObj)
    // let imwProductArr = decodeURIComponent(req.query.imwProductArr)

    // console.log(`imwProductArr from GET==> ${imwProductArr}`)
    // console.log(`typeof imwProductArr from GET==> ${typeof imwProductArr}`)
    // console.log(`JSON.stringify(imwProductArr) from GET==> ${JSON.stringify(imwProductArr)}`)

    let pageLinkArray = []
    let numPagesPlaceholder = [] //holds the value for total number of pages; should only be one value
    // let srsObjArr = []

    let currentPage = page
    console.log(`currentPage from GET==> ${currentPage}`)

    function queryEDI_Table_GET() {
      //The COUNT(*) function returns the number of rows in a result set returned by a SELECT statement.
      //The COUNT(*) returns the number of rows including duplicate, non-NULL and NULL rows.
      connection.query( //1st query is pagination query; 2nd query is getting EDLP data; 3rd query is non-paginated query;
        //4th query is for getting COUNT (# of total rows)
        `SELECT * FROM ${tableName} GROUP BY ${upcHeaderGET},
      ${invLastcostHeaderGET} ORDER BY ${upcHeaderGET} 
      LIMIT ${offset},${numQueryRes};

      SELECT * FROM rb_edlp_data;
      
      SELECT * FROM ${tableName} GROUP BY ${upcHeaderGET},
      ${invLastcostHeaderGET} ORDER BY ${upcHeaderGET};
      
      SELECT COUNT(*) FROM ${tableName};`,
        function (err, rows, fields) {
          if (err) throw err

          let nejRowsPagin = rows[0] //targets 1st query on NEJ table
          let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
          let nejRowsNonPagin = rows[2] //targets 3rd query on NEJ table

          let countRows = rows[3]

          // showSearchRes.showSearchRes(rows, numQueryRes, pageLinkArray, srsObjArr, numPagesPlaceholder)

          // showSearchResults.showSearchResults(rows, genericHeaderObjGET, formInputsObjGET, searchResultsNonPag, srcRsCSV_nonPag, srcRsCSVrvw_nonPag,
          //   edlpRows, nejRowsNonPagin)

          showSearchResults.showSearchResults(rows, genericHeaderObjGET, formInputsObjGET, searchResultsPagGET, srcRsCSV_PagGET,
            srcRsCSVrvwPagGET, edlpRows, nejRowsPagin)

          res.render('vw-imwGenerator', {
            title: `vw-imwGenerator from GET`,
            srsObjArr: srsObjArr,
            imwProductValObj: imwProductValObj,
            imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
            // objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
            tableName: tableName,
            numQueryRes: numQueryRes,
            pageLinkArray: pageLinkArray,
            currentPage: currentPage,
            numberOfPages: numPagesPlaceholder[0],
            lastPage: numPagesPlaceholder[0] - 1,
            firstPage: 0
          })
        })
    }

    queryEDI_Table_GET()
  })
}