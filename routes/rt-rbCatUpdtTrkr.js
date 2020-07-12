const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  rbCatUpdtTrkrDisplay
} = require('../rbcatUpdateTracker/rbCatUpdtTrkrDisplay')

// const {
//   createRBtable
// } = require('../sqlArch/createRBtable')
// const {
//   deleteRBtable
// } = require('../sqlArch/deleteRBtable')
// const {
//   populateRBtable
// } = require('../sqlArch/populateRBtable')
// const {
//   queryRBdb
// } = require('../sqlArch/queryRBdb')
// const {
//   nhcrtDisplay
// } = require('../sqlArch/nhcrtDisplay')
// const {
//   nhcrtEdiJoin
// } = require('../sqlArch/nhcrtEdiJoin')
// const {
//   nhcrtInfraSalesJoin
// } = require('../sqlArch/nhcrtInfraSalesJoin')
// const {
//   save2CSVnhcrtEdiJoin
// } = require('../sqlArch/save2CSVnhcrtEdiJoin')
// const {
//   save2CSVnhcrtInfraSalesJoin
// } = require('../sqlArch/save2CSVnhcrtInfraSalesJoin')
// const {
//   save2CSVreviewNEJ
// } = require('../sqlArch/save2CSVreviewNEJ')
// const {
//   saveIMW_CSV
// } = require('../sqlArch/saveIMW_CSV')
// const {
//   save2XLSreviewNEJ
// } = require('../sqlArch/save2XLSreviewNEJ')
// const {
//   loadTable_MySqlHub
// } = require('../sqlArch/loadTable_MySqlHub')
// const {
//   calcResults
// } = require('../sqlArch/calcResults')
// const {
//   calcResultsGET
// } = require('../sqlArch/calcResultsGET')




router.get('/', function (req, res, next) {
  res.render('vw-rbCatUpdtTrkr', {
    title: 'vw-rbCatUpdtTrkr',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/rbCatUpdtTrkrDisplay', rbCatUpdtTrkrDisplay)
// router.post('/createRBtable', createRBtable)
// router.post('/deleteRBtable', deleteRBtable)
// router.post('/populateRBtable', populateRBtable)
// router.post('/queryRBdb', queryRBdb)
// router.post('/nhcrtDisplay', nhcrtDisplay)
// router.post('/nhcrtEdiJoin', nhcrtEdiJoin)
// router.post('/nhcrtInfraSalesJoin', nhcrtInfraSalesJoin)
// router.post('/save2CSVnhcrtEdiJoin', save2CSVnhcrtEdiJoin)
// router.post('/save2CSVnhcrtInfraSalesJoin', save2CSVnhcrtInfraSalesJoin)
// router.post('/save2CSVreviewNEJ', save2CSVreviewNEJ)
// router.post('/saveIMW_CSV', saveIMW_CSV)
// router.post('/save2XLSreviewNEJ', save2XLSreviewNEJ)
// router.post('/loadTable_MySqlHub', loadTable_MySqlHub)
// router.post('/calcResults', calcResults)
// router.get('/calcResults', calcResultsGET)


module.exports = router;