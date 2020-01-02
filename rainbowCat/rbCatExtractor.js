var express = require('express');
var router = express.Router();

const mysql = require('mysql');

const connection = mysql.createConnection(process.env.RAINBOWCAT_CONNECTION_STRING);
connection.connect();


module.exports = {
  rbCatExtractor: router.post('/rbCatExtractor', (req, res, next) => {
    const rbCatExtractorPostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let rainbowCatQuery = rbCatExtractorPostBody['rbCatExtractorPost']
    console.log(`rainbowCatQuery==> ${rainbowCatQuery}`)

    function ongDiscoExtractor(rows) {
      let ongDisco = rows['ongDisco']
      return ongDisco
    }

    let mySqlQuery = `${rainbowCatQuery}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log('rows==>', rows)
      ongDiscoExtractor(rows)

      res.render('vw-MysqlTableHub', {
        title: `Extracted data from Heroku rainbow--cat <<${ongDisco}>>`,
        ongDisco: ongDisco
      })
    })

  })
}