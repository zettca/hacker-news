const url = require('url');
const express = require('express');
const cookieParser = require('cookie-parser');
const lib = require('./lib/helpers.js');

const app = express();

app.use(cookieParser());
app.use('/app', lib.requireAuth, express.static(__dirname + "/client/build/"));

app.get('/', lib.handleRequests);
app.get('/auth', lib.handleAuth);

app.get('/item/:id', lib.handleReqItem);
app.get('/stories/:cat', lib.handleReqStories);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running at ${port}...`);
});
