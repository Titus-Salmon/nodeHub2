const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const gEnericHdrObj = require('../funcLibT0d/genericHdrObj')
const cAlcRsFrmInputs = require('../funcLibT0d/calcResFormInputs')
const paginPost = require('../funcLibT0d/paginPost')
const showSearchResults = require('../funcLibT0d/showSearchResults')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResults: router.post('/calcResults', (req, res, next) => {

    var nejRowsPagin
    // let nejRowsPagin = rows[0] //targets 1st query on NEJ table
    let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
    // let rainbowCatRows = rows[2] //targets 3rd query on rcth (rainbow--cat table hub) table
    var nejRowsNonPagin
    // let nejRowsNonPagin = rows[2] //targets 3rd query on NEJ table

    // let searchResults = [] //clear searchResults from previous search
    let searchResultsNonPag = []
    let searchResultsPag = []
    let srcRsCSV_Pag = []
    let srcRsCSV_nonPag = []
    // searchResultsForCSV = []
    let srcRsCSVrvwPag = []
    let srcRsCSVrvw_nonPag = []
    // searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad/Nathan
    csvContainer = []
    const postBody = req.body

    let frmInptsObj = {} //provide empty object to populate with form inputs & values generated from calcResFormInputs.js module
    cAlcRsFrmInputs.clcRsFrmInpts(postBody, frmInptsObj)

    let genericHeaderObj = {} //provide empty object to populate with generic headers generated from genericHdrObj.js module
    gEnericHdrObj.gnrcHdrObj(postBody, genericHeaderObj)


    let paginPostObj = {}
    paginPost.paginPost(postBody, paginPostObj)

    let paginPostOption = postBody['paginPostOptionPost']

    function queryNhcrtEdiJoinTable() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      //filters by UPC & catapult cost (want to grab any differing cost items & make decision on what to do in showSearchResults())
      connection.query(`SELECT * FROM ${frmInptsObj.formInput0} GROUP BY ${genericHeaderObj.upcHeader},
      ${genericHeaderObj.invLastcostHeader} ORDER BY ${genericHeaderObj.upcHeader};
      SELECT * FROM rb_edlp_data;`,
        function (err, rows, fields) {
          if (err) throw err

          showSearchResults.showSearchResults(rows, genericHeaderObj, frmInptsObj, searchResults, searchResultsForCSVreview)

          res.render('vw-MySqlTableHub', { //render searchResults to vw-MySqlTableHub page
            title: `Retail Price Calculator (using nhcrtEdiJoin table: <<${frmInptsObj.loadedSqlTbl}>>)`,
            searchResRows: searchResults,
            loadedSqlTbl: frmInptsObj.loadedSqlTbl,
            // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
          })
        })

    }

    function queryNejTablePaginated() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      //filters by UPC & catapult cost (want to grab any differing cost items & make decision on what to do in showSearchResults())
      connection.query( //1st query is pagination query; 2nd query is getting EDLP data; 3rd query is non-paginated query
        `SELECT * FROM ${frmInptsObj.formInput0} GROUP BY ${genericHeaderObj.upcHeader},
      ${genericHeaderObj.invLastcostHeader} ORDER BY ${genericHeaderObj.upcHeader} 
      LIMIT ${paginPostObj['offsetPost']},${paginPostObj['numQueryRes']};

      SELECT * FROM rb_edlp_data;
      
      SELECT * FROM ${frmInptsObj.formInput0} GROUP BY ${genericHeaderObj.upcHeader},
      ${genericHeaderObj.invLastcostHeader} ORDER BY ${genericHeaderObj.upcHeader};`,

        function (err, rows, fields) {
          if (err) throw err

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
            // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
          })
        })
    }
    if (paginPostOption == 'no') { //if we choose to paginate, we don't return all results in scrRsObj, and therefore can't generate
      //a complete IMW or Retail Review. Therefore, YOU MUST CHOOSE NOT TO PAGINATE WHEN GENERATING IMW OR RETAIL REVIEW
      queryNhcrtEdiJoinTable() //returns all results of srcRsObj (use for IMW & Rtl Rvw)
    } else {
      queryNejTablePaginated() //returns only part of srcRsObj, determined by pagination settings. DO NOT USE FOR GENERATING
      //COMPLETE IMWs or complete Retail Reviews, although CAN be used to generate partial IMWs or partial Retail Reviews
    }
  })
}