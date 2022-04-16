const escapeHtml = require('escape-html');
const express = require('express');

const verbose = process.env.NODE_ENV !== 'test';

const app = express();

app.map = function (a, route) {
    route = route || '';
    for (var key in a) {
        switch (typeof a[key]) {
            // {'/path': {...}}
            case 'object':
                app.map(a[key], route + key);
                break;
            case 'function':
                if (verbose) console.log('%s %s', key, route);
                app[key](route, a[key]);
                break;
        }
    }
}

const users = {
    list: function (req, res) {
        res.send('user list');
    },
    get: function (req, res) {
        res.send('user ' + escapeHtml(req.params.uid));
    },
    delete: function (req, res) {
        res.send('delete users')
    }
}

const pets = {
    list: function (req, res) {
        res.send('user ' + escapeHtml(req.params.uid) + '\'s pets');
    },
    delete: function (req, res) {
        res.send('delete ' + escapeHtml(req.params.uid) + '\' pet ' + escapeHtml(req.params.pid));
    }
}

app.map({
    '/users': {
        get: users.list,
        delete: users.delete,
        '/:uid': {
            get: users.get,
            '/pets': {
                get: pets.list,
                '/:pid': {
                    delete: pets.delete
                }
            }
        }
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000')
})