const express = require('express');

const app = express();

app.use('/api/v1', require('./controllers/api_v1'))
app.use('/api/v2', require('./controllers/api_v2'))

app.get('/', (req, res) => {
    res.send('Hello from root route');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
