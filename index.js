const url = require('url');
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const lib = require('./lib/helpers.js');

const app = express();

app.use(compression());
app.use(cookieParser());
app.use('/app', express.static(__dirname + "/client/build/"));

app.get('/', lib.handleRequests);
app.get('/auth', lib.handleAuth);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App running at ${port}...`);
});
