const express = require('express');
const bodyParser = require ('body-parser');
const db = require('./db');
const routes = require('./routes');

db.connect();

const app = express();

app.use(bodyParser.json());
app.use('/', routes);

app.use((error, req, res, next) => {
    res.send(error.message);
});

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));

module.exports = app;

