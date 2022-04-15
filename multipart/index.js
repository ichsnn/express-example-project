const express = require('express');
const multiparty = require('multiparty');
const format = require('util').format;

const app = express();

app.get('/', (req, res) => {
    res.send(
        '<form method="post" enctype="multipart/form-data">' +
            '<p>Title: <input type="text" name="title"/></p>' +
            '<p>Image: <input type="file" name="image"/></p>' +
            '<p><input type="submit" value="Upload"/></p>' +
            '</form>'
    );
});

app.post('/', (req, res, next) => {
    const form = new multiparty.Form();
    var image;
    var title;

    form.on('error', next);
    form.on('close', () => {
        res.send(
            format(
                '\nuploaded %s (%d Kb) as %s',
                image.filename,
                (image.size / 1024) | 0,
                title
            )
        );
    });

    // listen on field event for title
    form.on('field', (name, val) => {
        if (name !== 'title') return;
        title = val;
    });

    // listen on part event for image file
    form.on('part', (part) => {
        if (!part.filename) return;
        if (part.name !== 'image') return part.resume();
        image = {};
        image.filename = part.filename;
        image.size = 0;
        part.on('data', (buf) => {
            image.size += buf.length;
        });
    });

    // parse the form
    form.parse(req);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
