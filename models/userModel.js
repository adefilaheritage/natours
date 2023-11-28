const mongoose = require('mongoose');
// const slugify = require('slugify');
const validator = require('validator');
// const sizeOf = require('image-size');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please tell us your name'],
        // unique: true,
        // trim: true,
        // maxlength: [40, 'A user name must have less than or equal to 40 characters'],
        // minlength: [3, 'A user name must have more than or equal to 3 characters']
    },
    email:{
        type: String,
        required: [true, 'Please provide your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
        // trim: true,
        // maxlength: [40, 'An email address must have less than or equal to 40 characters'],
        // minlength: [3, 'An email address must have more than or equal to 3 characters'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'password must be greater than or equal to eight characters'],
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
});

userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //Delete the passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
