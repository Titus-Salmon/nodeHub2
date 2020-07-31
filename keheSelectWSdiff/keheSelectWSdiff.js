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

    // let query = req.body['keheSelectJoinPost']
    let nhcrtName = req.body['nhcrtNamePost']

    // const postBody = req.body

    // let nhcrtTableName = postBody['nhcrtTablePost']
    // console.log(`nhcrtTableName==> ${nhcrtTableName}`)
    // let ediTableName = postBody['ediTablePost']
    // console.log(`ediTableName==> ${ediTableName}`)
    // let ediPrefix = postBody['ediPrefixPost']
    // console.log(`ediPrefix==> ${ediPrefix}`)

    let srsObjArr = []

    function showSearchRes(rows) {

      let query1 = rows[0]
      let query2 = rows[1]
      console.log(`query1[0]==> ${query1[0]}`)
      console.log(`query2[0]==> ${query2[0]}`)

      for (let i = 0; i < query2.length; i++) {

        let srsObj = {}

        for (let j = 0; j < query1.length; j++) {
          if (query2[i]['invScanCode'] == query1[j]['kehe_upc']) {

            srsObj['ri_t0d'] = i + 1
            srsObj['kehe_upc'] = query1[j]['kehe_upc']
            srsObj['s_upc'] = query1[j]['s_upc']
            srsObj['kehe_unit_type'] = query1[j]['kehe_unit_type']
            srsObj['s_unit_type'] = query1[j]['s_unit_type']

            if (query1[j]['kehe_unit_type'].toLowerCase().includes('ea')) {
              let unitIntSplit = query1[j]['kehe_unit_type'].split('-')
              let unitInt = unitIntSplit[1]
              srsObj['kehe_unit_cost'] = (query1[j]['kehe_tier3']) / (unitInt)
              srsObj['s_unit_cost'] = query1[j]['s_unit_cost']
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

            srsObj['kehe_name'] = query1[j]['kehe_name']
            srsObj['s_name'] = query1[j]['s_name']

            srsObj['invReceiptAlias'] = query2[i]['invReceiptAlias']
            srsObj['venCompanyname'] = query2[i]['venCompanyname']

            srsObjArr.push(srsObj)
          }
        }

      }
      //V// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
      keheSelectObjArrCache.set('keheSelectObjArrCache_key', srsObjArr)
      console.log(`keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'].length==> ${keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'].length}`)
      console.log(`keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'][0]==> ${keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'][0]}`)
      console.log(`JSON.stringify(keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'][0])==> ${JSON.stringify(keheSelectObjArrCache['data']['keheSelectObjArrCache_key']['v'][0])}`)
      //^// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
    }

    function queryNejUnitType_Table() {
      connection.query(`
      SELECT kehe.kehe_upc, kehe.kehe_unit_type, kehe.kehe_tier3, kehe.kehe_name,
      selct.s_upc, selct.s_unit_type, selct.s_unit_cost, selct.s_name 
      FROM edi_kehe_data kehe JOIN edi_select_data selct ON kehe.kehe_upc WHERE kehe.kehe_upc = selct.s_upc;

      SELECT DISTINCT invScanCode, venCompanyname, invReceiptAlias 
      FROM ${nhcrtName};
      `,
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