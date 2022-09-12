var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var Comment = require('../models/comment');
var User = require('../models/user');

/* GET articles. */
router.get('/', function(req, res) {
    Article.find({}, (err, articles) => {
        if(err) return next(err);
        User.findById(req.session.userId, (err, user) => {
            if(err) return next(err);
            res.render('articles', {articles, user});
        });
    });
});

// get article form
router.get('/new', (req, res) => {
    res.render('articleform');
});

//add article
router.post('/', (req, res, next) => {
    Article.create(req.body, (err, article) => {
        if (err) return next(err);
        res.redirect('/articles');
    });
});

// get single article
router.get('/:slug', (req, res, next) => {
    var session = req.session;
    if(typeof session.userId !== "undefined"){
        var slug = req.params.slug;
        Article.findOne({slug: slug}, (err, article) => {
            if (err) return next(err);
            Comment.find({articleId: article.id}, (err, comments) => {
                User.findById(req.session.userId, (err, user) => {
                    if (err) return next(err);
                res.render('singleArticle', {article, comments, user})
                });
            });
    });
    }else{
        req.flash('error', 'You have to login first');
        res.redirect('/users/login');
    }
});

//like
router.get('/:slug/like', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOneAndUpdate({slug: slug}, {$inc: {likes: 1}}, (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/'+ slug);
    });
});


//dislike
router.get('/:slug/dislike', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOneAndUpdate({slug: slug}, {$inc: {likes: -1}}, (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/'+ slug);
    });
});

//open edit form
router.get('/:slug/edit', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOne({slug: slug}, (err, article) => {
        if(err) return next(err);
        res.render('articleUpdateForm', {article});
    });
});

//update article
router.post('/:slug', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOneAndUpdate({slug: slug}, (req.body), (err, article) => {
        if(err) return next(err);
        res.redirect('/articles/'+slug);
    });
});

//delete article
router.get('/:slug/delete', (req, res, next) => {
    var slug = req.params.slug;
    Article.findOneAndDelete({slug: slug}, (err, article) => {
        if (err) return next(err);
        res.redirect('/articles')
    });
});

//add comments
router.post('/:id/comments', function(req, res, next) {
    var id = req.params.id;
    req.body.articleId = id;
    Comment.create(req.body, (err, comment) => {
        if (err) return next(err);
        Article.findById(id, (err, article) => {
            if (err) return next(err);
            res.redirect('/articles/'+ article.slug)
        });
    });
});


module.exports = router;
