var express = require('express');
const session = require('express-session');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('register', {error});
});

router.get('/login', (req, res) => {
  var error = req.flash('error')[0];
  res.render('login', {error});
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/users/login');
});

router.post('/login', (req, res, next) => {
  var {email ,password} = req.body;
  //empty user or password
  if(!email && !password){
    req.flash('error', 'email/password is required')
    return res.redirect('/users/login');
  }
  User.findOne({email: email}, (err, user) => {
    if(err) return next(err);
    //no user
    if(!user){
      req.flash('error', 'email is not registered')
      return res.redirect('/users/login');
    }

    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result){
        req.flash('error', 'password is wrong')
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      console.log(req.session)
      res.redirect('/users/dashboard/' + req.session.userId);
    });
  });  
});

router.get('/dashboard', (req, res) => {
  var user;
  res.render('dashboard', {user});
});

router.get('/dashboard/:id', (req, res, next) => {
  var id = req.params.id;
  User.findById(id, (err, user) => {
    if(err) return next(err);
    res.render('dashboard', {user})
  });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err){
        req.flash('error', err.name);
        return res.redirect('/users/register');
    }
    res.render('index', {title: 'user registered succesfully'})
  });
});

module.exports = router;
