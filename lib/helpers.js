const uuidv4 = require('uuid/v4');
const request = require('request');
const querystring = require('querystring');

const UserData = require('./UserData.js');
const { githubAuthId, githubAuthSecret } = require('../config.json');

const
    authUri = "https://github.com/login/oauth/authorize/",
    validateUri = "https://github.com/login/oauth/access_token/";

const authDB = {};

const qs = (url, obj) => url + "?" + querystring.stringify(obj);
const authUrl = qs(authUri, { client_id: githubAuthId });

function checkValidCodes(authCode, callback) {
    const url = qs(validateUri, {
        client_id: githubAuthId,
        client_secret: githubAuthSecret,
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
                res.end();
            }
        });
    },

    handleRequests: function (req, res) {
        console.log(req.cookies);
        const sidCookie = req.cookies.sid;

        if (sidCookie === undefined) { // first time ever known
            var sid = uuidv4();
            console.log("new user connected: " + sid);
            res.cookie("sid", sid, { maxAge: 100 * 24 * 3600, httpOnly: true });
            authDB[sid] = new UserData(sid);
        } else if (authDB[sidCookie] === undefined) { // first time since server restart
            console.log("adding user to db: " + sidCookie);
            authDB[sidCookie] = new UserData(sidCookie);
        }

        if (authDB[sidCookie].isAuthenticated()) {
            const name = authDB[sidCookie].data && authDB[sidCookie].data.name;
            res.write(`<h1>Hello ${name || "user"}, welcome to The Hacker News feed!</h1>`);
        } else {
            res.write(`<h1>Login via <a href="${authUrl}">GitHub</a></h1>`);
        }

        res.end();
    },
}
