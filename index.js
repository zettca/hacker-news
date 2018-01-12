const url = require('url');
const cors = require('cors')
const jwt = require('express-jwt');
const express = require('express');
const compression = require('compression');

const lib = require('./lib/helpers.js');
const config = require('./config.json');

const app = express();

app.use(compression());
app.use(cors({ credentials: true, origin: true }));

// serve React app
const clientPath = __dirname + "/client/build";
app.use('/', express.static(clientPath));
app.use("/static", express.static(clientPath + "/static"));

app.get('/auth/github/:code', lib.handleAuth);

app.all('/api/*', jwt({ secret: config.secret }), lib.validateUser);
app.get('/api/item/:id', lib.handleAPIItems);
app.get('/api/stories/:cat/:page', lib.handleAPIStories);

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App running at ${port}...`);
});
