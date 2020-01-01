var express = require('express');
var router = express.Router();

const mysql = require('mysql');

const connection = mysql.createConnection(process.env.RAINBOWCAT_CONNECTION_STRING);
connection.connect();


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
        rainbowCatObj['P_K'] = rows[i]['prim_key']
        rainbowCatObj['Vendor'] = rows[i]['vendorName']
        rainbowCatObj['EDI'] = rows[i]['ediName']
        rainbowCatObj['IssDt'] = rows[i]['issueDate']
        rainbowCatObj['NdNw'] = rows[i]['needNewCat']
        rainbowCatObj['Updtd'] = rows[i]['updatedWLatest']
        rainbowCatObj['Rep'] = rows[i]['reporter']
        rainbowCatObj['Cmnts'] = rows[i]['comments']
        rainbowCatObj['Andr'] = rows[i]['andrea']
        rainbowCatObj['vndemail'] = rows[i]['vendorEmail']
        rainbowCatObj['ongDisco'] = rows[i]['ongDisco']

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