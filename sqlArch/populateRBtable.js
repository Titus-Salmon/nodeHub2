const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const csv = require('fast-csv');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  // multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})
//try using connection pool
// const cnxnPool = mysql.createPool({
//   host: process.env.RB_HOST,
//   user: process.env.RB_USER,
//   password: process.env.RB_PW,
//   database: process.env.RB_DB,
//   // multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

// router.use(fileUpload())

router.use(fileUpload({
  debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
}))

module.exports = {

  populateRBtable: router.post('/populateRBtable', (req, res, next) => {
    // let columnHeaderArray = []
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let fileToUpload = req.files.popTblPost;
    console.log(`fileToUpload==> ${fileToUpload}`)

    // Use the mv() method to place the file somewhere on your server
    fileToUpload.mv(process.cwd() + '/public/csv-to-insert/' + fileToUpload.name, function (err) {
      //might want to try and use the actual UNC path here (\\WEBSERVER...)
      if (err)
        return res.status(500).send(err);
    });

    let tableToPopulate = req.body['popTblNamePost']
    console.log(`req.body['popTblNamePost']==> ${req.body['popTblNamePost']}`)

    // let tableColumnNames = []

    // function loadTableColumnNames(result) {
    //   for (let i = 0; i < result['columns'].length; i++) {
    //     tableColumnNames.push(result['columns'][i]['name'])
    //   }
    //   console.log('tableColumnNames==>', tableColumnNames)
    // }

    // let query1 = 'SHOW COLUMNS FROM ' + tableToPopulate + ';'
    // connection.query(query1, (error, response) => {
    //   console.log(error || response);
    //   console.log(`response.length==> ${response.length}`)
    //   for (let i = 0; i < response.length; i++) {
    //     console.log(`response[i]['Field']==> ${response[i]['Field']}`)
    //     columnHeaderArray.push(response[i]['Field'])
    //   }
    // });


    let query2 = `LOAD DATA LOCAL INFILE './public/csv-to-insert/${fileToUpload.name}' INTO TABLE ${tableToPopulate} FIELDS TERMINATED BY ','
     ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;` //"IGNORE 1 LINES" skips the 1st row of the csv (which is the column name line)

    //try using connection pool:
    // cnxn.getConnection(function (err) {
    //   cnxn.query(query2, (error, response) => {
    //     if (error) {
    //       console.log('error===>', error)
    //     } else {
    //       console.log('response==>', response);
    //     }
    //   })
    // });

    connection.query(query2, (error, response) => {
      if (error) {
        console.log('error===>', error)
      } else {
        console.log('response==>', response);
        // res.render('vw-MySqlTableHub', {
        //   title: `vw-MySqlTableHub **Populated Table <<${tableToPopulate}>>**`,
        //   // tableColNames: tableColumnNames,
        //   sqlTablePopulated: {
        //     tablePopulated: tableToPopulate,
        //   },
        // });
      }
    }); //do you need to end this connection before res.render, or put res.render inside of connection.query?? (to fix [ERR_HTTP_HEADERS_SENT])
    //or will setting up a connection pool be the solution?

    connection.end()

    res.render('vw-MySqlTableHub', {
      title: `vw-MySqlTableHub **Populated Table <<${tableToPopulate}>>**`,
      // tableColNames: tableColumnNames,
      sqlTablePopulated: {
        tablePopulated: tableToPopulate,
      },
    });
  })
}

//or maybe your router.use(fileUpload()) should go down here???
// router.use(fileUpload({
//   debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
// }))