const express = require('express')
const router = express.Router()

// const itmlstaccsntzr = require('../funcLibT0d/itmLstAccSanitizer')
// const mysql = require('mysql')

// const connection = mysql.createConnection({
//   host: process.env.RB_HOST,
//   user: process.env.RB_USER,
//   password: process.env.RB_PW,
//   database: process.env.RB_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

module.exports = {

  addNewProducts: router.post('/addNewProducts', (req, res, next) => {

    const sanitizeAndObjectifyFuncs = require('../funcLibT0d/sanitizeAndObjectifyFuncs')

    const postBody = req.body

    sanitizeAndObjectifyFuncs.sntzdItmLstObjGen(postBody)
    sanitizeAndObjectifyFuncs.objctfyImwPrdctArr()

    res.render('vw-imwGenerator', {
      title: `vw-imwGenerator`,
      imwProductValObj_t0d: sanitizeAndObjectifyFuncs.itemListObjs.imwProductValObj,
      imwProductArr_t0d: sanitizeAndObjectifyFuncs.itemListObjs.imwProductArr,
      objectifiedImwProdArr_t0d: sanitizeAndObjectifyFuncs.itemListObjs.objectifiedImwProdArr
    })

  })
}