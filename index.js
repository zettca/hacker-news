const url = require('url');
const express = require('express');
const cookieParser = require('cookie-parser');

const { handleRequests, handleAuth } = require('./lib/helpers.js');
const { endpointUri } = require('./config.json');

const endpoint = url.parse(endpointUri);

const app = express();

app.use(cookieParser());

app.get(endpoint.pathname, handleRequests);
app.get(endpoint.pathname + 'auth', handleAuth);

app.listen(endpoint.port, () => {
    console.log(`Server running at ${endpoint.host}...`);
});
