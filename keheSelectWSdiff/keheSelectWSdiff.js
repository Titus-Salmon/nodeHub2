const express = require('express')
const router = express.Router()

const mysql = require('mysql')

const connection = mysql.createConnection({ //for work use in RB DB
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

const keheSelectObjArrCache = require('../nodeCacheStuff/cache1')

module.exports = {

  keheSelectWSdiff: router.post(`/keheSelectWSdiff`, (req, res, next) => {

    let query = req.body['keheSelectJoinPost']

    // const postBody = req.body

    // let nhcrtTableName = postBody['nhcrtTablePost']
    // console.log(`nhcrtTableName==> ${nhcrtTableName}`)
    // let ediTableName = postBody['ediTablePost']
    // console.log(`ediTableName==> ${ediTableName}`)
    // let ediPrefix = postBody['ediPrefixPost']
    // console.log(`ediPrefix==> ${ediPrefix}`)

    let srsObjArr = []

    function showSearchRes(rows) {

      let displayRows = rows
      console.log(`displayRows[0]==> ${displayRows[0]}`)

      for (let i = 0; i < displayRows.length; i++) {

        let srsObj = {}

        // let oupNameVar = displayRows[i]['edi_tableEDIprefixUnitType'] //define variable for oupName
        // oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element

        srsObj['ri_t0d'] = i + 1
        srsObj['kehe_upc'] = displayRows[i]['kehe_upc']
        srsObj['s_upc'] = displayRows[i]['s_upc']
        srsObj['kehe_unit_type'] = displayRows[i]['kehe_unit_type']
        srsObj['s_unit_type'] = displayRows[i]['s_unit_type']

        if (displayRows[i]['kehe_unit_type'].toLowerCase().includes('ea')) {
          let unitIntSplit = displayRows[i]['kehe_unit_type'].split('-')
          let unitInt = unitIntSplit[1]
          srsObj['kehe_unit_cost'] = (displayRows[i]['kehe_tier3']) / (unitInt)
          srsObj['s_unit_cost'] = displayRows[i]['s_unit_cost']
        } else {
          srsObj['kehe_unit_cost'] = 'NA'
          srsObj['s_unit_cost'] = 'NA'
        }

        if (srsObj['kehe_unit_cost'] < srsObj['s_unit_cost']) {
          srsObj['lower_cost'] = 'KEHE'
        } else {
          srsObj['lower_cost'] = 'SELECT'
        }

        srsObj['note'] = 'nullT0d'

        if (Math.abs((srsObj['kehe_unit_cost'] - srsObj['s_unit_cost']) / (srsObj['kehe_unit_cost'])) > .25) {
          srsObj['note'] = '25diff'
        }
        if (Math.abs((srsObj['kehe_unit_cost'] - srsObj['s_unit_cost']) / (srsObj['kehe_unit_cost'])) > .5) {
          srsObj['note'] = '50diff'
        }
        if (Math.abs((srsObj['kehe_unit_cost'] - srsObj['s_unit_cost']) / (srsObj['kehe_unit_cost'])) > .75) {
          srsObj['note'] = '75diff'
        }

        srsObj['kehe_name'] = displayRows[i]['kehe_name']
        srsObj['s_name'] = displayRows[i]['s_name']

        srsObjArr.push(srsObj)

      }
      //V// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
      keheSelectObjArrCache.set('keheSelectObjArrCache_key', srsObjArr)
      console.log(`keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'].length==> ${keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'].length}`)
      console.log(`keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'][0]==> ${keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'][0]}`)
      console.log(`JSON.stringify(keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'][0])==> ${JSON.stringify(keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'][0])}`)
      //^// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
    }

    function queryNejUnitType_Table() {
      connection.query(`${query}`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchRes(rows)

          res.render('vw-keheSelectWSdiff', {
            title: `vw-keheSelectWSdiff`,
            srsObjArr: srsObjArr,
          })
        })
    }

    queryNejUnitType_Table()

  })
}