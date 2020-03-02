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

    let searchResultsNonPag = [] //clear searchResultsNonPag from previous search
    let searchResultsPag = [] //clear searchResultsPag from previous search
    srcRsCSV_Pag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSV_nonPag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSVrvwPag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSVrvw_nonPag = [] //why does this break if instantiated with "let"? A question for another time...
    csvContainer = [] //why does this break if instantiated with "let"? A question for another time...
    const postBody = req.body

    let frmInptsObj = {} //provide empty object to populate with form inputs & values generated from calcResFormInputs.js module
    cAlcRsFrmInputs.clcRsFrmInpts(postBody, frmInptsObj)

    let genericHeaderObj = {} //provide empty object to populate with generic headers generated from genericHdrObj.js module
    gEnericHdrObj.gnrcHdrObj(postBody, genericHeaderObj)

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
            firstPage: 0
            // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
          })
        })
    }
    queryNejTablePaginated()
  })
}