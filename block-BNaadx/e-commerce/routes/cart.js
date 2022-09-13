var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var User = require('../models/user');


//get cart
router.get('/', (req, res, next) => {
    if(req.session.userId){
        User.findById(req.session.userId, (err, user) => {
          if(err) return next(err);
          Cart.findOne({userId: req.session.userId}).populate('products').exec((err, cart) => {
            if(err) return next(err);
            res.render('cart', {user, cart})
          });
        });
      }else{
        req.flash('error', 'to show cart, you have to login first')
        res.redirect('/products')
      }
});

//add data to cart
router.get('/:productId/add', (req, res, next) => {
    if(req.session.userId){
        var productId = req.params.productId;
        var userId = req.session.userId;
        req.body.userId = userId
        req.body.products = productId
        console.log(req.body)
        Cart.findOne({userId: userId}, (err, cart) => {
            if(err) return next(err);
            if(!cart){
                Cart.create(req.body, (err, cart) => {
                    if(err) return next(err);
                    res.redirect('/products');
                });
            }else{
                Cart.findOne({products: productId}, (err, cart) => {
                    if(err) return next(err);
                    if(!cart){
                        Cart.findOneAndUpdate({userId: userId}, {$push: {products: productId}}, (err, cart) => {
                            if(err) return next(err);
                            res.redirect('/products')
                        });
                    }else{
                        req.flash('error', 'already added to cart');
                        res.redirect('/products');
                    }
                });   
            }
        });
    }else {
        req.flash('error', 'you have to login first to add items in your cart');
        res.redirect('/products');
    }    
});


//remove item from cart
router.get('/:id/remove', (req, res, next) => {
    var userId = req.session.userId;
    var productId = req.params.id;
    Cart.findOneAndUpdate({userId: userId}, {$pull: {products: productId}}, (err, cart) => {
        if(err) return next(err);
        res.redirect('/cart');
    });
});



module.exports = router;
