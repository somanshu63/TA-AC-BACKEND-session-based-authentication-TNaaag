var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var slug = require('slug');


var articleSchema = new Schema({
    title: String,
    description: String,
    likes: {type: Number, default: 0},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    author: String,
    slug: {type: String, unique: true}
});

articleSchema.pre('save', function(next) {
    if(this.title && this.isModified('slug')){
        this.slug = slug(this.title);
        next();
    }else{
        next()
    }
})

module.exports = mongoose.model('Article', articleSchema);