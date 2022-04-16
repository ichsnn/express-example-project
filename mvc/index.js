const express = require('express');
const logger = require('morgan');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');

const app = express();

// set default template engine to "ejs"
// which prevents the need for using file extensions
app.set('view engine', 'ejs');

// set views for error and 404 pages
app.set('views', path.join(__dirname, 'views'));

// define custom res.message() method
// which stores messages in the session
app.response.message = function(msg) {    
    // reference `req.session` via the `this.req` reference
    var sess = this.req.session;
    // simply add the msg to an array for later
    sess.message = sess.messages || [];
    sess.message.push(msg);
    return this;
};

// log
app.use(logger('dev'));

// server static files
app.use(express.static(path.join(__dirname, 'public')));

// session support
app.use(
    session({
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // dont'create session until something stored
        secret: 'some secret here',
    })
);

// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }));

// allowing overring method in query (?_method=put)
app.use(methodOverride('_method'));

// expose the "message" local variable when views are rendered
app.use((req, res, next) => {
    const msgs = req.session.message || [];

    // expose "message" local variable
    res.locals.message = msgs;

    // expose "hasMessage"
    res.locals.hasMessage = !!msgs.length;

    /* This is equivalent:
    res.locals({
        messages: msgs,
        hasMessages: !! msgs.length
    });
    */

    next();
    // empty or "flush" the message so the
    // don't build up
    req.session.message = [];
});

// load controllers
require('./lib/boot')(app, {verbose: !module.parent});

app.use((err, req, res, next) => {
    // log it
    if(!module.parent) console.error(err.stack);

    // error page
    res.status(500).render('5xx');
})

// assume 404 since no middleware responded
app.use((req, res, next) => {
    res.status(404).render('404', {url: req.originalUrl});
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
