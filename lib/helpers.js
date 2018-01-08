const uuidv4 = require('uuid/v4');
const request = require('request');
const querystring = require('querystring');
const mongo = require('mongodb').MongoClient;

const UserData = require('./UserData.js');
const config = require('../config.json');

const
    authUri = "https://github.com/login/oauth/authorize/",
    validateUri = "https://github.com/login/oauth/access_token/";

const authDB = {};

const qs = (url, obj) => url + "?" + querystring.stringify(obj);
const authUrl = qs(authUri, { client_id: config.githubAuthId });

function checkValidCodes(authCode, callback) {
    const url = qs(validateUri, {
        client_id: config.githubAuthId,
        client_secret: config.githubAuthSecret,
        code: authCode,
    });

    request.post(url, { json: true }, (err, res, body) => {
        const isValid = !err && body.token_type === "bearer";
        callback(isValid, body);
    });
}

function getUserData(token, callback) {
    const opts = {
        url: "https://api.github.com/user",
        headers: {
            "User-Agent": "request",
            "Authorization": "token " + token,
        },
    }

    request.get(opts, (err, res, body) => callback(body));
}

module.exports = {
    requireAuth: function (req, res, next) {
        const user = req.cookies.sid && authDB[req.cookies.sid];
        if (user && user.isAuthenticated()) return next();
        res.write('unauthorized');
        res.end();
    },
    handleAuth: function (req, res) {
        checkValidCodes(req.query.code, (success, body) => {
            if (success) {
                const user = authDB[req.cookies.sid];
                user.authenticate();
                user.setToken(body.access_token);
                getUserData(user.token, (data) => {
                    user.setData(JSON.parse(data));
                });
                res.redirect("/");
                res.end();
            } else {
                res.send("authentication error...");
            }
        });
    },

    handleRequests: function (req, res) {
        console.log(req.cookies);
        let sid = req.cookies.sid; // session ID

        if (sid === undefined) { // first time ever known
            sid = uuidv4();
            console.log("new user connected: " + sid);
            res.cookie("sid", sid, { maxAge: 100 * 24 * 3600, httpOnly: true });
        }

        if (authDB[sid] === undefined) { // first time since server restart
            console.log("adding user to db: " + sid);
            authDB[sid] = new UserData(sid);
        }

        const user = authDB[sid];
        // TODO: use proper routing
        if (user.isAuthenticated()) {
            res.redirect("/app");
        } else {
            res.write(`<h1>Login via <a href="${authUrl}">GitHub</a></h1>`);
        }
        res.end();
    },
}
