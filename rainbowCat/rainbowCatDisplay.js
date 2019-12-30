var express = require('express');
var router = express.Router();

const mysql = require('mysql');

// const connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);
// connection.connect();

const connection = mysql.createConnection({
  host: process.env.RAINBOWCAT_HOST,
  user: process.env.RAINBOWCAT_USERNAME,
  password: process.env.RAINBOWCAT_PASSWORD,
  port: process.env.RAINBOWCAT_PORT,
  database: process.env.RAINBOWCAT_DATABASE,
})

module.exports = {
  rainbowCatDisplay: router.post('/rainbowCatDisplay', (req, res, next) => {
    const rainbowCatDisplayPostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let rainbowCatQuery = rainbowCatDisplayPostBody['rainbowCatDisplayPost']
    console.log(`rainbowCatQuery==> ${rainbowCatQuery}`)

    let rainbowCatDisplayArr = []

    function displayrainbowCat(rows) {
      for (let i = 0; i < rows.length; i++) {
        let rainbowCatObj = {}
        rainbowCatObj['P_K'] = rows[i]['P_K']
        rainbowCatObj['Vendor'] = rows[i]['Vendor']
        rainbowCatObj['EDI'] = rows[i]['EDI']
        rainbowCatObj['IssDt'] = rows[i]['IssDt']
        rainbowCatObj['NdNw'] = rows[i]['NdNw']
        rainbowCatObj['Updtd'] = rows[i]['Updtd']
        rainbowCatObj['Rep'] = rows[i]['Rep']
        rainbowCatObj['Cmnts'] = rows[i]['Cmnts']
        rainbowCatObj['Andr'] = rows[i]['Andr']
        rainbowCatObj['vndemail'] = rows[i]['vndemail']

        rainbowCatDisplayArr.push(rainbowCatObj)
      }
      console.log('rows.length~~~>', rows.length)
    }


    let mySqlQuery = `${rainbowCatQuery}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log('rows==>', rows)
      // res.send(rows)
      displayrainbowCat(rows)

      res.render('vw-rainbowCatTableHub', {
        title: 'NodeHub rainbow--cat Query Results',
        rainbowCatDisplay: rainbowCatDisplayArr
      })
    })

  })
}