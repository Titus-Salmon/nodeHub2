const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  rainbowCatDisplay
} = require('../rainbowCat/rainbowCatDisplay')




router.get('/', function (req, res, next) {
  res.render('vw-rainbowCatTableHub', {
    title: 'vw-rainbowCatTableHub',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/rainbowCatDisplay', rainbowCatDisplay)


module.exports = router;