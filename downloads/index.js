const express = require('express');
const path = require('path');
const resolvePath = require('resolve-path');

const app = express();

// path to where the files are stored on disk
const FILES_DIR = path.join(__dirname, 'files');

app.get('/', (req, res) => {
    res.send(
        '<ul>' +
            '<li><a href="/files/notes/todo.txt">Todo Text</a></li>' +
            '<li><a href="/files/3gp.txt">3gp File</a></li>' +
            '<li><a href="/files/missing.txt">Missing File</a></li>' +
            '</ul>'
    );
});

// /files/* is accessed via req.params[0]
// but here we name it :file
app.get('/files/:file(*)', (req, res, next) => {
    const filePath = resolvePath(FILES_DIR, req.params.file);
    res.download(filePath, (err) => {
        if (!err) return; // file sent
        if (err.status !== 404) return next(err);
        res.statusCode = 404;
        res.send('Cant find that file, sorry!');
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
