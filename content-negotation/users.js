const users = require('./db');

exports.html = (req, res) => {
    res.send(
        '<ul>' +
            users
                .map((user) => {
                    return `<li>${user.name}</li>`;
                })
                .join('') +
            '</ul>'
    );
};

exports.text = (req, res) => {
    res.send(
        users
            .map((user) => {
                return ` - ${user.name} \n`;
            })
            .join('')
    );
};

exports.json = (req, res) => {
    res.json(users);
}
