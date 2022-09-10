var express = require('express');
const session = require('express-session');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  var {email ,password} = req.body;
  //empty user or password
  if(!email && !password){
    res.redirect('/users/login');
  }
  User.findOne({email: email}, (err, user) => {
    if(err) return next(err);
    //no user
    if(!user){
      return res.redirect('/users/login');
    }

    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result){
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      console.log(req.session)
      res.redirect('/users/dashboard/' + req.session.userId);
    });
  });  
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard');
});

router.get('/dashboard/:id', (req, res, next) => {
  var id = req.params.id;
  User.findById(id, (err, user) => {
    if(err) return next(err);
    res.render('userDashboard', {user})
  });
});

router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) return next(err);
    res.render('index', {title: 'user registered succesfully'})
  });
});

module.exports = router;
