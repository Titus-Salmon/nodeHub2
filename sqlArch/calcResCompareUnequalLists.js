const express = require('express')
const router = express.Router()
const mysql = require('mysql')

// const connection = mysql.createConnection({
//   host: process.env.TEST_STUFF_T0D_HOST,
//   user: process.env.TEST_STUFF_T0D_USER,
//   password: process.env.TEST_STUFF_T0D_PW,
//   database: process.env.TEST_STUFF_T0D_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResCompareUnequalLists: router.post('/calcResCompareUnequalLists', (req, res, next) => {

    let tableA = req.body['tableAPost']
    let tableB = req.body['tableBPost']

    // listAmatcher = []
    // listBmatcher = []
    // longerTableMatcher = []
    // shorterTableMatcher = []
    listMatcher = []

    function showSearchResults(rows) {

      let tableArows = rows[0]
      let tableBrows = rows[1]
      var longerTable, shorterTable

      if (tableArows.length > tableBrows.length) {
        longerTable = tableArows
        shorterTable = tableBrows
      } else {
        longerTable = tableBrows
        shorterTable = tableArows
      }

      for (let i = 0; i < longerTable.length; i++) {
        let rsltObj = {}
        for (let j = 0; j < shorterTable.length; j++) {
          if (longerTable[i]['column_one'] == shorterTable[j]['column_one']) {
            rsltObj[`match`] = `long${i}\/short${j}match==><l${i}>${longerTable[i]['column_one']}<s${j}>${shorterTable[j]['column_one']}`
            listMatcher.push(rsltObj)
          } else {
            for (let k = 0; k < listMatcher.length; k++) {
              if (!listMatcher[k]['miss']) {
                rsltObj[`miss`] = `long${i}\/short${j}miss==><l${i}>${longerTable[i]['column_one']}<s${j}>${shorterTable[j]['column_one']}`
              } else {
                // for (let k = 0; k < listMatcher.length; k++) {
                // rsltObj[`miss`] = `long${i}\/short${j}miss==><l${i}>${longerTable[i]['column_one']}<s${j}>${shorterTable[j]['column_one']}`
                if (listMatcher[k]['miss'] !== `long${i}\/short${j}miss==><l${i}>${longerTable[i]['column_one']}<s${j}>${shorterTable[j]['column_one']}`) {
                  rsltObj[`miss`] = `long${i}\/short${j}miss==><l${i}>${longerTable[i]['column_one']}<s${j}>${shorterTable[j]['column_one']}`
                  // listMatcher.push(rsltObj)
                }
                // }
              }

            }
            listMatcher.push(rsltObj)
          }
        }
      }
      console.log(`listMatcher[0]==> ${listMatcher[0]}`)
      console.log(`JSON.stringify(listMatcher[0])==> ${JSON.stringify(listMatcher[0])}`)
    }




    function queryCompareListsTable() {
      connection.query(`SELECT * FROM ${tableA} ORDER BY column_one;
      SELECT * FROM ${tableB} ORDER BY column_one;`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-compareUnequalLists', { //render searchResults to vw-MySqlTableHub page
          title: 'compareUnequalLists',
          listMatcher: listMatcher,
        })
      })
    }

    queryCompareListsTable()

  })
}