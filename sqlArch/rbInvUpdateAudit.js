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

    let rbInvJoinArr = []

    function displayRbInvJoin(rows) {
      for (let i = 0; i < rows.length; i++) {
        let rbInvJoinObj = {}
        rbInvJoinObj['ri_t0d'] = i + 1
        rbInvJoinObj['invPK'] = rows[i]['invPK']
        rbInvJoinObj['invCPK'] = rows[i]['invCPK']
        rbInvJoinObj['invScanCode'] = rows[i]['invScanCode']
        rbInvJoinObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //   if (Object.keys(rows[i])[j].includes('_sku')) {
        //     rbInvJoinObj['ediSKU'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //   }
        // }

        rbInvJoinObj['invName'] = rows[i]['invName']
        rbInvJoinObj['invSize'] = rows[i]['invSize']
        rbInvJoinObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
        rbInvJoinObj['posTimeStamp'] = rows[i]['posTimeStamp']
        rbInvJoinObj['invDateCreated'] = rows[i]['invDateCreated']
        rbInvJoinObj['invEmpFkCreatedBy'] = rows[i]['invEmpFkCreatedBy']
        rbInvJoinObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
        rbInvJoinObj['oupName'] = rows[i]['oupName']
        rbInvJoinObj['stoName'] = rows[i]['stoName']
        rbInvJoinObj['brdName'] = rows[i]['brdName']
        rbInvJoinObj['dptName'] = rows[i]['dptName']
        rbInvJoinObj['dptNumber'] = rows[i]['dptNumber']
        rbInvJoinObj['sibIdealMargin'] = rows[i]['sibIdealMargin']
        rbInvJoinObj['venCompanyname'] = rows[i]['venCompanyname']
        rbInvJoinObj['invLastreceived'] = rows[i]['invLastreceived']
        rbInvJoinObj['invLastsold'] = rows[i]['invLastsold']
        rbInvJoinObj['invLastcost'] = rows[i]['invLastcost']

        for (let j = 0; j < Object.keys(rows[i]).length; j++) {
          //extract cost from EDI catalog (all catalogs have some '_cost' column, except kehe, which has '_tier3')
          //!Object.keys(rows[i])[j].includes('_case_cost') will EXCLUDE '_case_cost' columns (such as cw_case_cost for Charlotte's Web)
          if (Object.keys(rows[i])[j].includes('_cost') && !Object.keys(rows[i])[j].includes('_case_cost') &&
            !Object.keys(rows[i])[j].includes('_display_cost') || Object.keys(rows[i])[j].includes('_tier3')) { //exclude _display_cost columns
            //from Jack N Jill
            rbInvJoinObj['ediCost'] = rows[i][`${Object.keys(rows[i])[j]}`]
          }
        }

        rbInvJoinObj['sibBasePrice'] = rows[i]['sibBasePrice']

        for (let j = 0; j < Object.keys(rows[i]).length; j++) {
          //extract msrp from EDI catalog (all catalogs have some '_msrp' column)
          if (Object.keys(rows[i])[j].includes('_msrp')) {
            rbInvJoinObj['ediPrice'] = rows[i][`${Object.keys(rows[i])[j]}`]
            // console.log(`rbInvJoinObj['ediPrice']==>${rbInvJoinObj['ediPrice']}`)
          }
        }

        rbInvJoinObj['invOnhand'] = rows[i]['invOnhand']
        rbInvJoinObj['invOnorder'] = rows[i]['invOnorder']
        rbInvJoinObj['invIntransit'] = rows[i]['invIntransit']
        rbInvJoinObj['pi1Description'] = rows[i]['pi1Description']
        rbInvJoinObj['pi2Description'] = rows[i]['pi2Description']
        rbInvJoinObj['pi3Description'] = rows[i]['pi3Description']
        rbInvJoinObj['invPowerField3'] = rows[i]['invPowerField3']
        rbInvJoinObj['invPowerField4'] = rows[i]['invPowerField4']

        rbInvJoinArr.push(rbInvJoinObj)
      }
      console.log('rows.length~~~>', rows.length)
      console.log(`Object.keys(rows[0][0])==>${Object.keys(rows[0][0])}`)

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
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0][0]==>', rows[0][0])
      // displayRbInvJoin(rows)

      // res.render('vw-rbInvAudit', {
      //   title: 'vw-rbInvAudit',
      //   rbInvJoinArr: rbInvJoinArr
      // })
    })

  })
}