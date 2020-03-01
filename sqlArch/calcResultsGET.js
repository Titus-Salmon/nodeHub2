const express = require('express')
const router = express.Router()
const mysql = require('mysql')

// const gEnericHdrObj = require('../funcLibT0d/genericHdrObj')
// const cAlcRsFrmInputs = require('../funcLibT0d/calcResFormInputs')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {
  calcResultsGET: function () {

  }
}