var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('name', "somanshu");
  console.log(req.cookies)
  res.send('hello');
});

module.exports = router;
