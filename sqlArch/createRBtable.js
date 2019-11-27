const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})

module.exports = {
  createRBtable: router.post('/createRBtable', (req, res, next) => {
    const createTablePostBody = req.body
    let tableName = createTablePostBody['tblNamePost']
    let columnNames = []
    let tableHeaders = createTablePostBody['crtTblPost']
    let tableHeadersArray = tableHeaders.split(',')
    for (let i = 0; i < tableHeadersArray.length; i++) {
      let columnName = tableHeadersArray[i] + ' VARCHAR(255)'
      console.log(`columnName==> ${columnName}`)
      columnNames.push(columnName)
    }

    let mySqlQuery = `CREATE TABLE ${tableName} (record_id int NOT NULL AUTO_INCREMENT, ${columnNames}, PRIMARY KEY (record_id));`

    // let sqlQuery = 'CREATE TABLE ' + tableName + ' (record_id int NOT NULL AUTO_INCREMENT, ' + columnNames + ', PRIMARY KEY (record_id));'
    connection.query(mySqlQuery, (error, response) => {
      console.log(error || response);
    });

    res.render('vw-MySqlTableHub', {
      title: 'vw-MySqlTableHub',
      sqlTableCreated: {
        tableName: tableName,
        columnNames: columnNames,
        basicColumnNames: tableHeadersArray
      },
    });
  })
}