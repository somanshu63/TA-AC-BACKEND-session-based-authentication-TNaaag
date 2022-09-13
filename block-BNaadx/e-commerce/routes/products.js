var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var User = require('../models/user')
var Comment = require('../models/comment')

//get products
router.get('/', (req, res, next) => {
    var error = req.flash('error')[0]
    Product.find({}, (err, products) => {
        if(err) return next(err);
        if(req.session.userId){
            User.findById(req.session.userId, (err, user) => {
              if(err) return next(err);
              res.render('products', {user, products, error});
            });
          }else{
            var user = "";
            res.render('products', {user, products, error})
          }
    });
});

//open products form
router.get('/form', (req, res, next) => {
    if(req.session.userId){
        User.findById(req.session.userId, (err, user) => {
          if(err) return next(err);
          res.render('productsForm', {user});
        });
      }else{
        var user = "";
        res.render('productsForm', {user})
      }
});

// add product
router.post('/', (req, res, next) => {
    console.log(req.body);
    Product.create(req.body, (err, product) => {
        if(err) return next(err);
        res.redirect('/products')
    });
});

//single product
router.get('/:id', (req, res, next) => {
    var id = req.params.id;
    var error = req.flash('error')[0];
    Product.findById(id, (err, product) => {
        if(err) return next(err);
        Comment.find({productId: product.id}, (err, comments) => {
            if(err) return next(err);
            if(req.session.userId){
                User.findById(req.session.userId, (err, user) => {
                  if(err) return next(err);
                  res.render('singleProduct', {user, product, error, comments});
                });
              }else{
                var user = "";
                res.render('singleProduct', {user, product, error, comments})
              }
        });
    });
});

//like product
router.get('/:id/like', (req, res, next) => {
    var id = req.params.id;
    if(req.session.userId){
        Product.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, product) => {
            if(err) return next(err);
            res.redirect('/products/' + id);
        });
    }else{
        req.flash('error', 'you have to login first')
        res.redirect('/products/'+id);
    }
});

//add comment
router.post('/:id/comment', (req, res, next) => {
    var productId = req.params.id;
    req.body.productId = productId;
    Comment.create(req.body, (err, comment) => {
        if(err) return next(err);
        res.redirect('/products/' + productId);
    });
});


//dislike product
router.get('/:id/dislike', (req, res, next) => {
    var id = req.params.id;
    if(req.session.userId){
        Product.findById(id, (err, product) => {
            if(err) return next(err);
            if(product.likes > 0){
                Product.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, product) => {
                    if(err) return next(err);
                    res.redirect('/products/' + id);
                });
            }else{
                res.redirect('/products/' + id);
            }
        });
    }
});

//edit product
router.get('/:id/edit', (req, res, next) => {
    var id = req.params.id;
    Product.findById(id, (err, product) => {
        if(err) return next(err);
        if(req.session.userId){
            User.findById(req.session.userId, (err, user) => {
              if(err) return next(err);
              res.render('productUpdateForm', {user, product});
            });
          }else{
            var user = "";
            res.render('productUpdateForm', {user, product})
          }
    });
});

//update product
router.post('/:id', (req, res, next) => {
    var id = req.params.id;
    Product.findByIdAndUpdate(id, req.body, (err, product) => {
        if(err) return next(err);
        res.redirect('/products/' + id);
    });
});

//delete product
router.get('/:id/delete', (req, res, next) => {
    var id = req.params.id;
    Product.findByIdAndDelete(id, (err, product) => {
        if(err) return next(err);
        res.redirect('/products')
    });
});


module.exports = router;
