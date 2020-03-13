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
  nhcrtInfraSF_Join
} = require('../sqlArch/nhcrtInfraSF_Join')
const {
  save2CSVreviewSfAud
} = require('../sqlArch/save2CSVreviewSfAud')
const {
  save2CSVnhcrtEdiJoin
} = require('../sqlArch/save2CSVnhcrtEdiJoin')
const {
  save2CSVreviewNEJ
} = require('../sqlArch/save2CSVreviewNEJ')
const {
  saveIMW_CSV
} = require('../sqlArch/saveIMW_CSV')
const {
  loadTable_MySqlHub
} = require('../sqlArch/loadTable_MySqlHub')
const {
  calcResults
} = require('../sqlArch/calcResults')
const {
  calcResultsGET
} = require('../sqlArch/calcResultsGET')

const {
  calcResultsSfAud
} = require('../sqlArch/calcResultsSfAud')
const {
  calcResultsSfAud2
} = require('../sqlArch/calcResultsSfAud2')
const {
  calcResultsSfAud3
} = require('../sqlArch/calcResultsSfAud3')
const {
  loadTable_calcResStockFilter_UPC
} = require('../sqlArch/loadTable_calcResStockFilter_UPC')
const {
  calcResStockFilter_UPC
} = require('../sqlArch/calcResStockFilter_UPC')




router.get('/', function (req, res, next) {
  res.render('vw-stockFilter_UPC', {
    title: 'vw-stockFilter_UPC',
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
router.post('/nhcrtInfraSF_Join', nhcrtInfraSF_Join)
router.post('/save2CSVnhcrtEdiJoin', save2CSVnhcrtEdiJoin)
router.post('/save2CSVreviewSfAud', save2CSVreviewSfAud)
router.post('/save2CSVreviewNEJ', save2CSVreviewNEJ)
router.post('/saveIMW_CSV', saveIMW_CSV)
router.post('/loadTable_MySqlHub', loadTable_MySqlHub)
router.post('/calcResults', calcResults)
router.get('/calcResults', calcResultsGET)


router.post('/calcResultsSfAud', calcResultsSfAud)
router.post('/calcResultsSfAud2', calcResultsSfAud2)
router.post('/calcResultsSfAud3', calcResultsSfAud3)
router.post('/loadTable_calcResStockFilter_UPC', loadTable_calcResStockFilter_UPC)
router.post('/calcResStockFilter_UPC', calcResStockFilter_UPC)


module.exports = router;