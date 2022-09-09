var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, minlength: 5},
    age: Number,
    phone: Number
});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) return next(err);
            this.password = hashed;
            next();
        });
    }
    else{
        next()
    }
});

module.exports = mongoose.model('User', userSchema);
