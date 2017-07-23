var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if (!req.isAuthenticated()){
    res.render('login', {title: 'Welcome!'});
  }
  else{
    res.render('index', {title: 'Welcome!'});
  }
});

module.exports = router;
