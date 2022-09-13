var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.userId){
    User.findById(req.session.userId, (err, user) => {
      if(err) return next(err);
      res.render('index', {user});
    });
  }else{
    var user;
    res.render('index', {user})
  }
});

module.exports = router;
