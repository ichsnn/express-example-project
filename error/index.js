const express = require('express');
const logger = require('morgan');

const app = express();

require('dotenv').config('./.env');

const test = process.env.NODE_ENV === 'test';

if (!test) app.use(logger('dev'));

// error handling middleware have an arity of 4
// instead of the typical (req, res, next),
// otherwise they behave exactly like regular
// middleware, you may have several of them,
// in different orders etc.

function error(err, req, res, next) {
    // log it
    if (!test) console.error(err.stack);

    // respon with 500 "Internal Server Error"
    res.status(500);
    res.send('Internal Server Error</br>' + `<pre>${err.stack}</pre>`);
}

app.get('/', (req, res) => {
    // Caught and passed down to the errorHandler middleware
    throw new Error('Something broke!');
});

app.get('/next', (req, res, next) => {
    // We can also pass exceptions to next()
    // The reason for process.nextTick() is to show that
    // next() can be called inside an async operation,
    // in real life it can be a DB read or HTTP request.
    process.nextTick(() => {
        next(new Error('Oh no!'));
    })
});

// the error handler is placed after routes
// if it were above it would not receive errors
// from app.get() etc
app.use(error);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
