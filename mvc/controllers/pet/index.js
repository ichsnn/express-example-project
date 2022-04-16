const db = require('../../db');
exports.engine = 'ejs';

exports.before = (req, res, next) => {
    var pet = db.pets[req.params.pet_id];
    if (!pet) return 'route';
    req.pet = pet;
    next();
};

exports.show = (req, res, next) => {
    res.render('show', { pet: req.pet });
};

exports.edit = (req, res, next) => {
    res.render('edit', { pet: req.pet });
};

exports.update = (req, res, next) => {
    var body = req.body;
    req.pet.name = body.pet.name;
    res.message('Information updated!');
    res.redirect('/pet/' + req.pet.id);
};
