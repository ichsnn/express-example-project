const express = require('express');
const app = express();
const users = require('./db');

app.use(require('cors')());

app.get('/', (req, res) => {
    res.format({
        html: () => {
            res.send(
                '<ul>' +
                    users
                        .map((user) => {
                            return `<li>${user.name}</li>`;
                        })
                        .join('') +
                    '</ul>'
            );
        },

        text: () => {
            res.send(
                users
                    .map((user) => {
                        return ` - ${user.name} \n`;
                    })
                    .join('')
            );
        },

        json: () => {
            res.json(users);
        },
    });
});

const format = (path) => {
    const obj = require(path);
    return (req, res) => {
        res.format(obj);
    };
};

app.get('/users', format('./users'));

app.listen(3000, () => {
    console.log(`Server running on port 3000`);
});
