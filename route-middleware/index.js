const express = require('express');

const app = express();

// Example requests:
//     curl http://localhost:3000/user/0
//     curl http://localhost:3000/user/0/edit
//     curl http://localhost:3000/user/1
//     curl http://localhost:3000/user/1/edit (unauthorized since this is not you)
//     curl -X DELETE http://localhost:3000/user/0 (unauthorized since you are not an admin)

// Dummy database
const users = [
    { id: 0, name: 'ichsan', email: 'ichsan@mail.com', role: 'member' },
    { id: 1, name: 'messi', email: 'messi@lionel.com', role: 'member' },
    { id: 2, name: 'ronaldo', email: 'ronald@cr7.com', role: 'admin' },
    { id: 4, name: 'lewa', email: 'lewa@dowski.com', role: 'member' },
]

function loadUser(req, res, next) {
    // You would fetch your user from db
    const user = users.find(user => user.id.toString() === req.params.id);
    if (user) {
        req.user = user;
        next();
    } else {
        next(new Error('Failed to load user ' + req.params.id));
    }
}

function andRestrictToSelf(req, res, next) {
    // If our authenticated user is the user we are viewing
    // then everything is fine
    if (req.authenticatedUser.id === req.user.id) {
        next();
    } else {
        // You may want to implement specific exceptions
        // such as UnauthorizedError or similar so that you
        // can handle these can be special-cased in an error handler
        // (view ./examples/pages for this)
        next(new Error('Unauthorized'));
    }
}

function andRestrictTo(role) {
    return function (req, res, next) {
        if (req.authenticatedUser.role === role) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    }
}

// Middleware for faux authentication
// you would of course implement something real,
// but this illustrates how an authenticated user
// may interact with middleware

app.use((req, res, next) => {
    req.authenticatedUser = users[0];
    next();
})

app.get('/', (req, res, next) => {
    res.redirect('/user/0');
})

app.get('/user/:id', loadUser, (req, res) => {
    res.send('Viewing user ' + req.user.name)
})

app.get('/user/:id/edit', loadUser, andRestrictToSelf, (req, res) => {
    res.send('Editing user ' + req.user.name);
});

app.delete('/user/:id', loadUser, andRestrictTo('admin'), (req, res) => {
    res.send('Deleted user ' + req.user.name);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
})