var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* get register form. */
router.get('/register', function(req, res, next) {
  var err = req.flash('error')[0];
  res.render('register', {err});
});

//save user
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/users/register');
    }
    req.flash('success', 'user registered successfully')
    res.redirect('/users/login')
  });
});


//get login form
router.get('/login', function(req, res, next) {
  var success = req.flash('success')[0];
  var error = req.flash('error')[0];
  res.render('login', { success, error });
});

//login user
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if(!email || !password){
    req.flash('error', 'email/password required');
    return res.redirect('/users/login')
  }
  User.findOne({email}, (err, user) => {
    if(err) return next(err);
    if(!user){
      req.flash('error', 'user is not registered');
      return res.redirect('/users/login')
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result){
        req.flash('error', 'password is wrong');
        return res.redirect('/users/login')
      }
      req.session.userId = user.id;
      req.flash('success', 'login successfull');
      res.redirect('/users/login');
    });
  });
});

module.exports = router;
