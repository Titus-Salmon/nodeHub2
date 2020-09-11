var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})

const venProfArrCache = require('../nodeCacheStuff/cache1')

module.exports = {
  venProf: router.post('/venProf', (req, res, next) => {

    let vendorName = req.body['vendorNamePost']
    console.log(`vendorName==> ${vendorName}`)

    let venProfArr = []

    function displayvenProf(rows) {
      for (let i = 0; i < rows.length; i++) {
        let venProfObj = {}
        venProfObj['ri_t0d'] = i + 1
        venProfObj['date'] = rows[i]['date']
        venProfObj['kehe'] = rows[i]['kehe']

        venProfArr.push(venProfObj)
      }
      venProfArrCache.set('venProfArrCache_key', venProfArr)
      console.log('rows.length~~~>', rows.length)
      // console.log(`Object.keys(rows)==>${Object.keys(rows)}`)
      console.log(`Object.keys(rows[0])==>${Object.keys(rows[0])}`)
    }


    connection.query(`
    SELECT date, ${vendorName} FROM ois_venprof_mnth
    `, function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      // console.log(`rows[0]['invScanCode']==>${rows[0]['invScanCode']}`)
      // console.log(`rows[0]['invName']==>${rows[0]['invName']}`)
      // console.log('rows==>', rows)
      // res.send(rows)
      displayvenProf(rows)

      res.render('vw-venProf', {
        title: `Monthly profits by vendor: ${vendorName}`,
        venProfArr: venProfArr,
      })
    })

  })
}