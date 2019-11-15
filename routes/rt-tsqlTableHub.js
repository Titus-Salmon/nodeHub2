const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  createTsqlTableSimple
} = require('../sqlArch/createTsqlTableSimple')

const {
  deleteTsqlTableSimple
} = require('../sqlArch/deleteTsqlTableSimple')

const {
  queryCatapultDB
} = require('../sqlArch/queryCatapultDB')

const {
  populateTsqlTable
} = require('../sqlArch/populateTsqlTable')



// const {
//   populateTableSimple
// } = require('../sqlArch/populateTableSimple')

// const {
//   searchEditCalcUniversal_brandTargeting
// } = require('../sqlArch/searchEditCalcUniversal_brandTargeting')

// const {
//   loadTableUniversal_brandTargeting
// } = require('../sqlArch/loadTableUniversal_brandTargeting')

// const {
//   saveResultsToCSV
// } = require('../sqlArch/saveResultsToCSV')

// const {
//   save2CSVReview
// } = require('../sqlArch/save2CSVreview')
//^//destructuring////////////////////////////////


// router.get('/', ensureAuthenticated, function (req, res, next) {
//   res.render('vw-retailCalcUniversal_brandTargeting', {
//     title: 'Universal Retail Price Calculator (with Brand Targeting',
//     username: req.user.name,
//     userEmail: req.user.email,
//     userEmail_stringified: JSON.stringify(req.user.email),
//   });
// });

router.get('/', function (req, res, next) {
  res.render('vw-tsqlTableHub', {
    title: 'T-SQL Table Hub',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/createEmptyTsqlTable', createTsqlTableSimple)
router.post('/deleteTsqlTable', deleteTsqlTableSimple)
router.post('/queryCatapultDB', queryCatapultDB)
router.post('/populateTsqlTable', populateTsqlTable)

// router.post('/populateTableSimple', populateTableSimple)


// router.post('/results', searchEditCalcUniversal_brandTargeting)
// router.post('/loadTableUniversal_brandTargeting', loadTableUniversal_brandTargeting)
// router.post('/saveCSV', saveResultsToCSV)
// router.post('/saveCSVreview', save2CSVReview)



module.exports = router;