const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  keheUnfiWSdiff
} = require('../keheUnfiWSdiff/keheUnfiWSdiff')
// const {
//   saveCSVimwUnitType
// } = require('../imwUnitType/saveCSVimwUnitType')



router.get('/', function (req, res, next) {
  res.render('vw-keheUnfiWSdiff', {
    title: 'vw-keheUnfiWSdiff',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/keheUnfiWSdiff', keheUnfiWSdiff)
// router.post('/saveCSVimwUnitType', saveCSVimwUnitType)

module.exports = router;