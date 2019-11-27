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
    populateRBtable
  } = require('../sqlArch/populateRBtable')
  const {
    queryRBdb
  } = require('../sqlArch/queryRBdb')
  

router.get('/', function (req, res, next) {
  res.render('vw-MySqlTableHub', {
    title: 'vw-MySqlTableHub',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/createRBtable', createRBtable)
router.post('/populateRBtable', populateRBtable)
router.post('/queryRBdb', queryRBdb)


module.exports = router;