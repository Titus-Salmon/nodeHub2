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
    deleteRBtable: router.post('/deleteRBTable', (req, res, next) => {
        const deleteTablePostBody = req.body
        let tableName = deleteTablePostBody['delTblNamePost']
        

        let mySqlQuery = `DROP TABLE ${tableName};`

        connection.query(mySqlQuery, (error, response) => {
            console.log(`error==>${error}` || `response==>${response}`)
        })

        res.render('vw-MySqlTableHub', {
            title: `vw-MySqlTableHub - ${tableName} Deleted`,
            // sqlTableCreated: {
            //     tableName: tableName,
            //     columnNames: columnNames,
            //     basicColumnNames: tableHeadersArray
            // },
        })
    })
}