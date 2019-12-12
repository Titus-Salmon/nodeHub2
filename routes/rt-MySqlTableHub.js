const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  createRBtable
} = require('../sqlArch/createRBtable')
const {
  deleteRBtable
} = require('../sqlArch/deleteRBtable')
const {
  populateRBtable
} = require('../sqlArch/populateRBtable')
const {
  queryRBdb
} = require('../sqlArch/queryRBdb')
const {
  nhcrtDisplay
} = require('../sqlArch/nhcrtDisplay')
const {
  nhcrtEdiJoin
} = require('../sqlArch/nhcrtEdiJoin')
const {
  save2CSVnhcrtEdiJoin
} = require('../sqlArch/save2CSVnhcrtEdiJoin')
const {
  loadTable_MySqlHub
} = require('../sqlArch/loadTable_MySqlHub')
const {
  calcResults
} = require('../sqlArch/calcResults')




router.get('/', function (req, res, next) {
  res.render('vw-MySqlTableHub', {
    title: 'vw-MySqlTableHub',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/createRBtable', createRBtable)
router.post('/deleteRBtable', deleteRBtable)
router.post('/populateRBtable', populateRBtable)
router.post('/queryRBdb', queryRBdb)
router.post('/nhcrtDisplay', nhcrtDisplay)
router.post('/nhcrtEdiJoin', nhcrtEdiJoin)
router.post('/save2CSVnhcrtEdiJoin', save2CSVnhcrtEdiJoin)
router.post('/loadTable_MySqlHub', loadTable_MySqlHub)
router.post('/calcResults', calcResults)


module.exports = router;