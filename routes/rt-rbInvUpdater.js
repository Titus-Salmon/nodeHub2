const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  createNhcrtRbInvTable
} = require('../sqlArch/createNhcrtRbInvTable')
const {
  populateNhcrtRbInvTable
} = require('../sqlArch/populateNhcrtRbInvTable')
const {
  query_rb_inventory
} = require('../sqlArch/query_rb_inventory')
const {
  calcResRbInvUpdater
} = require('../sqlArch/calcResRbInvUpdater')
const {
  rbInvUpdateAudit
} = require('../sqlArch/rbInvUpdateAudit')




router.get('/', function (req, res, next) {
  res.render('vw-rbInvUpdater', {
    title: 'vw-rbInvUpdater',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/createNhcrtRbInvTable', createNhcrtRbInvTable)
router.post('/populateNhcrtRbInvTable', populateNhcrtRbInvTable)
router.post('/query_rb_inventory', query_rb_inventory)
router.post('/calcResRbInvUpdater', calcResRbInvUpdater)
router.post('/rbInvUpdateAudit', rbInvUpdateAudit)


module.exports = router;