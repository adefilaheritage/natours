const mongoose = require('mngoose');
const slugify = require('slugify');
const validator = require('validator');
const sizeOf = require('image-size');
const imageType = require('image-type');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A user name must have less than or equal to 40 characters'],
        minlength: [3, 'A user name must have more than or equal to 3 characters']
    },
    email:{
        type: String,
        required: [true, 'Please enter a valid email address'],
        unique: true,
        trim: true,
        maxlength: [40, 'An email address must have less than or equal to 40 characters'],
        minlength: [3, 'An email address must have more than or equal to 3 characters'],
    },
    photo:{
        const isPng = (filePath) => {
            try {
                const buffer = fs.readFileSync(filePath);
                const type = imageType(buffer);

                return type && type.mime === 'image/png';
            } catch (error) {
                console.error('Error reading file:', error);
                return false;
            };
        }
    },
    password: {
        type: alphaNum,
        isAlphaNum: true,
    },
    passwordConfirm: {
        type: alphaNum,
        isAlphaNum: true,
    }
});

//neme, email, photo, password, passwordConfirm