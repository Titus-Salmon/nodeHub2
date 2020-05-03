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

module.exports = {

  generateMinShelfQtyIMW: router.post(`/generateMinShelfQtyIMW`, (req, res, next) => {

    const postBody = req.body

    let movementTableName = postBody['movementTablePost']
    console.log(`movementTableName==> ${movementTableName}`)

    let storeAbbrev = postBody['storeAbbrevPost']
    console.log(`storeAbbrev==> ${storeAbbrev}`)

    let totalDays = postBody['totalDaysPost']
    console.log(`totalDays==> ${totalDays}`)

    let arFreq = postBody['arFreqPost']
    console.log(`arFreq==> ${arFreq}`)

    let srsObjArr = []

    function showSearchRes(rows) {

      let displayRows = rows
      console.log(`displayRows[0]==> ${displayRows[0]}`)

      for (let i = 0; i < displayRows.length; i++) {

        let srsObj = {}

        let soldPerTimeframe = displayRows[i]['quantity_sold'] * arFreq / totalDays

        srsObj['ri_t0d'] = i + 1
        srsObj['item_id'] = displayRows[i]['item_id']
        srsObj['dept_id'] = ''
        srsObj['dept_name'] = ''
        srsObj['recpt_alias'] = displayRows[i]['receipt_alias']
        srsObj['brand'] = ''
        srsObj['item_name'] = ''
        srsObj['size'] = ''
        srsObj['sugg_retail'] = ''
        srsObj['last_cost'] = ''
        srsObj['base_price'] = ''
        srsObj['auto_discount'] = ''
        srsObj['ideal_margin'] = ''
        srsObj['weight_profile'] = ''
        srsObj['tax1'] = ''
        srsObj['tax2'] = ''
        srsObj['tax3'] = ''
        srsObj['spec_tndr1'] = ''
        srsObj['spec_tndr2'] = ''
        srsObj['pos_prompt'] = ''
        srsObj['location'] = ''
        srsObj['alternate_id'] = ''
        srsObj['alt_rcpt_alias'] = ''
        srsObj['pkg_qty'] = ''
        srsObj['supp_unit_id'] = displayRows[i]['supplier_unit_id']
        srsObj['supplier_id'] = displayRows[i]['supplier_id']
        srsObj['unit'] = ''
        srsObj['num_pkgs'] = ''
        srsObj['category'] = ''
        srsObj['sub_category'] = ''
        srsObj['product_group'] = ''
        srsObj['product_flag'] = ''
        srsObj['rb_note'] = ''
        srsObj['edi_default'] = ''
        srsObj['powerfield_7'] = ''
        if (soldPerTimeframe > 0 && soldPerTimeframe < 5.9) {
          srsObj['temp_group'] = `${storeAbbrev}_5`
        }
        if (soldPerTimeframe > 5.9 && soldPerTimeframe < 10.9) {
          srsObj['temp_group'] = `${storeAbbrev}_10`
        }
        if (soldPerTimeframe > 10.9 && soldPerTimeframe < 15.9) {
          srsObj['temp_group'] = `${storeAbbrev}_15`
        }
        if (soldPerTimeframe > 15.9 && soldPerTimeframe < 20.9) {
          srsObj['temp_group'] = `${storeAbbrev}_20`
        }
        if (soldPerTimeframe > 20.9 && soldPerTimeframe < 25.9) {
          srsObj['temp_group'] = `${storeAbbrev}_25`
        }
        if (soldPerTimeframe > 25.9 && soldPerTimeframe < 30.9) {
          srsObj['temp_group'] = `${storeAbbrev}_30`
        }
        if (soldPerTimeframe > 30.9 && soldPerTimeframe < 35.9) {
          srsObj['temp_group'] = `${storeAbbrev}_35`
        }
        if (soldPerTimeframe > 35.9 && soldPerTimeframe < 40.9) {
          srsObj['temp_group'] = `${storeAbbrev}_40`
        }
        if (soldPerTimeframe > 40.9 && soldPerTimeframe < 45.9) {
          srsObj['temp_group'] = `${storeAbbrev}_45`
        }
        if (soldPerTimeframe > 45.9 && soldPerTimeframe < 50.9) {
          srsObj['temp_group'] = `${storeAbbrev}_50`
        }
        if (soldPerTimeframe > 50.9) {
          srsObj['temp_group'] = `${storeAbbrev}_greaterThan50.9???`
        }
        // srsObj['temp_group'] = ''
        srsObj['onhand_qty'] = ''
        srsObj['reorder_point'] = ''
        srsObj['mcl'] = ''
        srsObj['reorder_qty'] = ''
        srsObj['memo'] = ''
        srsObj['flrRsn'] = ''
        srsObj['dsd'] = ''
        srsObj['disc_mult'] = ''
        srsObj['case_pk_mult'] = ''
        srsObj['ovr'] = '1'

        srsObjArr.push(srsObj)
      }
    }

    function queryMovementTable() {
      connection.query(`
      SELECT * FROM ${movementTableName}`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchRes(rows)

          res.render('vw-imwUnitType', {
            title: `vw-imwUnitType`,
            srsObjArr: srsObjArr,
          })
        })
    }

    queryMovementTable()
  })
}