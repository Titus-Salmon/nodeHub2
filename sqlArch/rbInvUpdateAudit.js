var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true
})

module.exports = {
  rbInvUpdateAudit: router.post('/rbInvUpdateAudit', (req, res, next) => {
    const rbInvUpdateAuditPostBody = req.body
    let rbInvOLD = rbInvUpdateAuditPostBody['rbInvOLDPost']
    console.log(`rbInvOLD==> ${rbInvOLD}`)
    let rbInvNEW = rbInvUpdateAuditPostBody['rbInvNEWPost']
    console.log(`rbInvNEW==> ${rbInvNEW}`)

    let rbInvJoinArr_ind = []
    let rbInvJoinArr_sm = []
    let rbInvJoinArr_mt = []
    let rbInvJoinArr_sh = []
    let rbInvJoinArr_gl = []

    function displayRbInvJoin(rows) {

      let indRows = rows[0]
      let smRows = rows[1]
      let mtRows = rows[2]
      let shRows = rows[3]
      let glRows = rows[4]

      for (let i = 0; i < indRows.length; i++) {
        let rbInvJoinObj_ind = {}
        rbInvJoinObj_ind['ri_t0d'] = i + 1
        rbInvJoinObj_ind['new_inv_upc'] = indRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_ind['new_inv_name'] = indRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_ind['new_inv_in_stock'] = indRows[i]['new_inv_in_stock']
        rbInvJoinObj_ind['old_inv_in_stock'] = indRows[i]['old_inv_in_stock']

        rbInvJoinArr_ind.push(rbInvJoinObj_ind)
      }

      for (let i = 0; i < smRows.length; i++) {
        let rbInvJoinObj_sm = {}
        rbInvJoinObj_sm['ri_t0d'] = i + 1
        rbInvJoinObj_sm['new_inv_upc'] = smRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sm['new_inv_name'] = smRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sm['new_inv_sm_stock'] = smRows[i]['new_inv_sm_stock']
        rbInvJoinObj_sm['old_inv_sm_stock'] = smRows[i]['old_inv_sm_stock']

        rbInvJoinArr_sm.push(rbInvJoinObj_sm)
      }

      for (let i = 0; i < mtRows.length; i++) {
        let rbInvJoinObj_mt = {}
        rbInvJoinObj_mt['ri_t0d'] = i + 1
        rbInvJoinObj_mt['new_inv_upc'] = mtRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_mt['new_inv_name'] = mtRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_mt['new_inv_mt_stock'] = mtRows[i]['new_inv_mt_stock']
        rbInvJoinObj_mt['old_inv_mt_stock'] = mtRows[i]['old_inv_mt_stock']

        rbInvJoinArr_mt.push(rbInvJoinObj_mt)
      }

      for (let i = 0; i < shRows.length; i++) {
        let rbInvJoinObj_sh = {}
        rbInvJoinObj_sh['ri_t0d'] = i + 1
        rbInvJoinObj_sh['new_inv_upc'] = shRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sh['new_inv_name'] = shRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sh['new_inv_sh_stock'] = shRows[i]['new_inv_sh_stock']
        rbInvJoinObj_sh['old_inv_sh_stock'] = shRows[i]['old_inv_sh_stock']

        rbInvJoinArr_sh.push(rbInvJoinObj_sh)
      }

      for (let i = 0; i < glRows.length; i++) {
        let rbInvJoinObj_gl = {}
        rbInvJoinObj_gl['ri_t0d'] = i + 1
        rbInvJoinObj_gl['new_inv_upc'] = glRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_gl['new_inv_name'] = glRows[i]['new_inv_upc'] //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_gl['new_inv_gl_stock'] = glRows[i]['new_inv_gl_stock']
        rbInvJoinObj_gl['old_inv_gl_stock'] = glRows[i]['old_inv_gl_stock']

        rbInvJoinArr_gl.push(rbInvJoinObj_gl)
      }
    }


    // let mySqlQuery = `${nhcrtEdiJoin}`

    connection.query(`
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_in_stock AS new_inv_in_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_in_stock AS old_inv_in_stock
    FROM ${rbInvNEW} updated
    JOIN ${rbInvOLD} orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_in_stock != orig.inv_in_stock
    ORDER BY updated.inv_in_stock;
    
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_sm_stock AS new_inv_sm_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_sm_stock AS old_inv_sm_stock
    FROM ${rbInvNEW} updated
    JOIN ${rbInvOLD} orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_in_stock != orig.inv_in_stock
    ORDER BY updated.inv_in_stock;
    
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_mt_stock AS new_inv_mt_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_mt_stock AS old_inv_mt_stock
    FROM ${rbInvNEW} updated
    JOIN ${rbInvOLD} orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_in_stock != orig.inv_in_stock
    ORDER BY updated.inv_in_stock;
    
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_sh_stock AS new_inv_sh_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_sh_stock AS old_inv_sh_stock
    FROM ${rbInvNEW} updated
    JOIN ${rbInvOLD} orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_in_stock != orig.inv_in_stock
    ORDER BY updated.inv_in_stock;
    
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_gl_stock AS new_inv_gl_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_gl_stock AS old_inv_gl_stock
    FROM ${rbInvNEW} updated
    JOIN ${rbInvOLD} orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_in_stock != orig.inv_in_stock
    ORDER BY updated.inv_in_stock;`, function (err, rows, fields) {
      if (err) throw err
      // console.log(`rows.length==>${rows.length}`)
      // console.log('rows[0][0]==>', rows[0][0])
      displayRbInvJoin(rows)

      res.render('vw-rbInvUpdater', {
        title: 'vw-rbInvUpdater',
        rbInvJoinArr_ind: rbInvJoinArr_ind,
        rbInvJoinArr_sm: rbInvJoinArr_sm,
        rbInvJoinArr_mt: rbInvJoinArr_mt,
        rbInvJoinArr_sh: rbInvJoinArr_sh,
        rbInvJoinArr_gl: rbInvJoinArr_gl
      })
    })

  })
}