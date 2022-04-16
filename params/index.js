const express = require('express');
const app = express();

const users = [
    { name: 'Ichsan' },
    { name: 'Rudi' },
    { name: 'Ini Budi' },
    { name: 'Bandit' }
];

function createError(status, message) {
    const err = new Error(message);
    err.status = status;
    return err;
}

// Convert :to and :from to integers

app.param(['to', 'from'], (req, res, next, num, name) => {
    req.params[name] = parseInt(num, 10);
    if(isNaN(req.params[name])) {
        next(createError(400, 'failed to parseInt ' + num));
    } else {
        next();
    }
})

// Load user by id
app.param('user', (req, res, next, id) => {
    if(req.user = users[id]) {
        next();
    } else {
        next(createError(404, 'failed to find user'));
    }
})

// GET index

app.get('/', (req, res) => {
    res.send('Visit /user/0 or /users/0-2');
})

// GET :user

app.get('/users/:from-:to', (req, res, next) => {
    const from = req.params.from;
    const to = req.params.to;
    var names = users.map((user) => {
        return user.name;
    })
    res.send('users ' + names.slice(from, to+1).join(', '));
})

app.listen(3000, () => {
    console.log(`Server running on port 3000`)
})
