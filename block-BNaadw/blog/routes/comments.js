var express = require('express');
const article = require('../models/article');
var router = express.Router();
var Comment = require('../models/comment');


//open update comment form
router.get('/:id/edit', (req, res, next) => {
    var id = req.params.id;
    Comment.findById(id, (err, comment) => {
        if(err) return next(err);
        res.render('commentUpdateForm', {comment})
    });
});

//update comment
router.post('/:id', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        if(err) return next(err);
        article.findById(comment.articleId, (err, article) => {
            if(err) return next(err);
            res.redirect('/articles/' + article.slug)
        });
    });
});

module.exports = router;
