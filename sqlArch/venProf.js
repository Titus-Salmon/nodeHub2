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

const d3 = require('d3')
// const jsdom = require('jsdom')
// const fs = require('fs')

// var htmlStub = `
// <html>
//   <head></head>
//   <body>
//     <div id="dataviz-container"></div>
//     <script src="js/d3.v3.min.js"></script>
//   </body>
// </html>` // html file skull with a container div for the d3 dataviz


module.exports = {
  venProf: router.post('/venProf', (req, res, next) => {

    // // pass the html stub to jsDom
    // jsdom.env({
    //   features: {
    //     QuerySelector: true
    //   },
    //   html: htmlStub,
    //   done: function (errors, window) {
    //     // process the html document, like if we were at client side
    //     // code to generate the dataviz and process the resulting html file to be added here
    //   }
    // })

    var el = window.document.querySelector('#dataviz-container')
    var body = window.document.querySelector('body')

    // append the svg to the container selector
    d3.select(el)
      .append('svg:svg')
      .attr('width', 600).attr('height', 300)
      .append('circle')
      .attr('cx', 300).attr('cy', 150).attr('r', 30).attr('fill', '#26963c')

    // save result in an html file
    var svgsrc = window.document.innerHTML

    // fs.writeFile('index.html', svgsrc, function (err) {
    //   if (err) {
    //     console.log('error saving document', err)
    //   } else {
    //     console.log('The file was saved, open index.html to see the result')
    //     //do a res.render here
    //   }
    // })

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