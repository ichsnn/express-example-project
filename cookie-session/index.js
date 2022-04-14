const cookieSession = require('cookie-session');
const express = require('express');

const app = express();

app.use(cookieSession({ secret: 'ichsan is cool' }));

app.use(count);

function count(req, res) {
    req.session.count = (req.session.count || 0) + 1;
    res.send('viewed ' + req.session.count + ' times\n');
};

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
