const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  addNewProducts
} = require('../imwGen/addNewProducts')
const {
  saveProdArrAsCSV
} = require('../imwGen/saveProdArrAsCSV')




router.get('/', function (req, res, next) {
  res.render('vw-imwGenerator', {
    title: 'vw-imwGenerator',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/addNewProducts', addNewProducts)
router.post('/saveProdArrAsCSV', saveProdArrAsCSV)


module.exports = router;