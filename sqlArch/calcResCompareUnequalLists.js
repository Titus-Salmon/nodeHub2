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
    longerTableMatcher = []
    shorterTableMatcher = []

    longerTableMisser = []
    shorterTableMisser = []

    // listMatcher = []
    // listMisser = []

    function showSearchResults(rows) {

      let tableArows = rows[0]
      console.log(`typeof tableArows==> ${typeof tableArows}`)
      console.log(`tableArows.length1==> ${tableArows.length}`)
      let tableBrows = rows[1]
      console.log(`tableBrows.length1==> ${tableBrows.length}`)
      var longerTable, shorterTable

      if (tableArows.length > tableBrows.length) {
        longerTable = tableArows
        shorterTable = tableBrows
      } else {
        longerTable = tableBrows
        shorterTable = tableArows
      }

      console.log(`longerTable.length1==> ${longerTable.length}`)
      console.log(`shorterTable.length1==> ${shorterTable.length}`)

      for (let i = 0; i < longerTable.length; i++) {
        let rsltObjLongerMatch = {}
        let rsltObjShorterMatch = {}
        for (let j = 0; j < shorterTable.length; j++) {
          if (longerTable[i]['column_one'] == shorterTable[j]['column_one']) {
            rsltObjLongerMatch[`match`] = `long${i}\/short${j}match==><l${i}>${longerTable[i]['column_one']}<s${j}>${shorterTable[j]['column_one']}`
            rsltObjShorterMatch[`match`] = `long${i}\/short${j}match==><l${i}>${longerTable[i]['column_one']}<s${j}>${shorterTable[j]['column_one']}`
            longerTableMatcher.push(rsltObjLongerMatch)
            shorterTableMatcher.push(rsltObjShorterMatch)
            longerTable.splice(i, 1)
            shorterTable.splice(j, 1)
          }
        }
      }

      for (let k = 0; k < longerTable.length; k++) {
        let rsltObjLongerMiss = {}
        rsltObjLongerMiss[`miss`] = `longerMiss==>${longerTable[k]['column_one']}`
        longerTableMisser.push(rsltObjLongerMiss)
      }

      for (let m = 0; m < shorterTable.length; m++) {
        let rsltObjShorterMiss = {}
        rsltObjShorterMiss[`miss`] = `shorterMiss==>${shorterTable[m]['column_one']}`
        shorterTableMisser.push(rsltObjShorterMiss)
      }

      console.log(`tableArows.length2==> ${tableArows.length}`)
      console.log(`tableBrows.length2==> ${tableBrows.length}`)

      console.log(`longerTable.length2==> ${longerTable.length}`)
      console.log(`shorterTable.length2==> ${shorterTable.length}`)

      //
      //need to pop array element out if it has been caught as a miss
      //pop out of where?


      // for (let m = 0; m < longerTable.length; m++) {
      //   let rsltObjMiss = {}
      //   for (let n = 0; n < shorterTable.length; n++) {
      //     if (longerTable[m]['column_one'] !== shorterTable[n]['column_one']) {
      //       rsltObjMiss[`miss`] = `long${m}\/short${n}miss==><l${i}>${longerTable[m]['column_one']}<s${n}>${shorterTable[n]['column_one']}`
      //       listMisser.push(rsltObjMiss)
      //     }
      //   }
      // }



      console.log(`longerTableMatcher[0]==> ${longerTableMatcher[0]}`)
      console.log(`JSON.stringify(longerTableMatcher[0])==> ${JSON.stringify(longerTableMatcher[0])}`)
    }




    function queryCompareListsTable() {
      connection.query(`SELECT * FROM ${tableA} ORDER BY column_one;
      SELECT * FROM ${tableB} ORDER BY column_one;`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-compareUnequalLists', { //render searchResults to vw-MySqlTableHub page
          title: 'compareUnequalLists',
          // listMatcher: listMatcher,
          // listMisser: listMisser,
          longerTableMatcher: longerTableMatcher,
          shorterTableMatcher: shorterTableMatcher,
          longerTableMisser: longerTableMisser,
          shorterTableMisser: shorterTableMisser,
        })
      })
    }

    queryCompareListsTable()

  })
}