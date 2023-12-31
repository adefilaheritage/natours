const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: "${value}". Please use another value!`
    return new AppError(message, 400);
};

const handleValidatorErrorDB = err => {
    //In Javascript, we use Object.values to loop over objects
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token, Please log in again!', 401);
// This is another way of writing the above line of code

// const handleJWTError = () => {
//     const message = 'Invalid token, Please log in again!';
//     return new AppError(message, 401);
// };

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });

    //Programming or other unknown error: don't leak error details    
    } else {
        // 1) Log error
        console.error('ERROR 💥', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
            err
        });
    }
};

module.exports = (err, req, res, next) => {
    console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        console.log('hererererer',err);
        let error = { ...err };
        if(error.reason != null){
            let test = error.reason.toString();
            if (test.startsWith('Error: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')) error = handleCastErrorDB(error);
        };
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error._message === 'Validation failed') error = handleValidatorErrorDB(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();


        sendErrorProd(error, res);
    }
};
