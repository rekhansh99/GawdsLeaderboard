const path = require('path');

const express = require('express');
const octokit = require('@octokit/rest')();
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

octokit.authenticate({
    type: 'oauth',
    key: 'ac565b80a7743d55e824',
    secret: '5a4e3217190e7025748b49e1fe8feac5af8a0516'
});

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/');

app.use(errorController.get404);

app.listen(3000);