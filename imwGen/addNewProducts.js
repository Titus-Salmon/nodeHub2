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

  addNewProducts: router.post('/addNewProducts', (req, res, next) => {

    let imwProductValues = [] //clear searchResults from previous search
    const postBody = req.body
    let itemID = postBody['itemIDPost']
    let suppUnitID = postBody['suppUnitIDPost']

    imwProductValues.push(itemID, suppUnitID)

    res.render('vw-imwGenerator', { //render searchResults to vw-MySqlTableHub page
      title: `vw-imwGenerator`,
      imwProductVals: JSON.stringify(imwProductValues),
      // loadedSqlTbl: frmInptsObj.loadedSqlTbl,
      // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
    })

  })
}