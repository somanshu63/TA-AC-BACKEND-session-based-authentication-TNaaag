var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true},
    password: {type: String, minlength: 5},
    city: String,
    fullName: String
});

userSchema.pre('save', function(next) {
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password, 10, (err, hash) => {
            this.password = hash;
            next();
        });
    }
    else{
        next();
    }
    if(this.firstName && this.lastName){
        this.fullName = this.firstName + ' ' + this.lastName;
        next();
    }
});

userSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, (err, result) => {
        return cb(err, result);
    });
}


userSchema.methods.generateFullName = function() {
    return this.firstName + this.lastName;
}

module.exports = mongoose.model('User', userSchema);