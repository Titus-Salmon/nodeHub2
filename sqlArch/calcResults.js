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

    let searchResults = [] //clear searchResults from previous search
    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad/Nathan
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
      connection.query(`SELECT * FROM ${frmInptsObj.formInput0} GROUP BY ${genericHeaderObj.upcHeader},
      ${genericHeaderObj.invLastcostHeader} ORDER BY ${genericHeaderObj.upcHeader} 
      LIMIT ${paginPostObj['offsetPost']},${paginPostObj['numQueryRes']};
      SELECT * FROM rb_edlp_data;`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchResults.showSearchResults(rows, genericHeaderObj, frmInptsObj, searchResults, searchResultsForCSVreview)

          res.render('vw-MySqlTableHub', { //render searchResults to vw-MySqlTableHub page
            title: `Retail Price Calculator (using nhcrtEdiJoin table: <<${frmInptsObj.loadedSqlTbl}>>)`,
            searchResRows: searchResults,
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