const db = require('../../db');

exports.engine = 'hbs';

exports.before = (req, res, next) => {
    var id = req.params.user_id;
    if (!id) return next();
    // pretend to query a database...
    process.nextTick(() => {
        req.user = db.users[id];
        // can't find that user
        if (!req.user) return next('route');
        // found it, move on to the routes
        next();
    });
};

exports.list = (req, res, next) => {
    res.render('list', { users: db.users });
};

exports.edit = (req, res, next) => {
    res.render('edit', { user: req.user });
};

exports.show = (req, res, next) => {
    res.render('show', { user: req.user });
};

exports.update = (req, res, next) => {
    var body = req.body;
    req.user.name = body.user.name;
    res.message('Information updated!');
    res.redirect('/user/' + req.user.id);
};
