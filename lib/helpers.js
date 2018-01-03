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

let db = null;
mongo.connect(config.dbPath + "/data", (err, dataBase) => {
    if (err === null) {
        console.log("Connected to MongoDB...");
        db = dataBase;
    }
});

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

function findUser(db, sid, callback) {
    if (db === null) return;
    const users = db.collection("users");

    users.find({ sid: sid }).toArray((err, docs) => {
        if (docs.length === 1) {
            console.log(docs);
            callback(docs);
        } else if (docs.length > 1) {
            console.log("More than one user found.");
        } else {
            console.log("User not found.");
        }
    });
}

function insertUser(db, user, callback) {
    if (db === null) return;
    const users = db.collection("users");

    users.insert(user);
    callback();
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
        if (user.isAuthenticated()) {
            res.redirect("/app");
        } else {
            res.write(`<h1>Login via <a href="${authUrl}">GitHub</a></h1>`);
        }
        res.end();
    },

    handleReqItem: function (req, res) {
        const opts = {
            url: `https://hacker-news.firebaseio.com/v0/item/${req.params.id}.json`,
            json: true,
        }

        request.get(opts, (err, resp, body) => {
            res.send(body);
        });
    },

    handleReqStories: function (req, res) {
        const cat = ({
            top: "topstories",
            new: "newstories",
            best: "beststories",
        })[req.params.cat];
        const opts = {
            url: `https://hacker-news.firebaseio.com/v0/${cat}.json`,
            json: true,
        }

        request.get(opts, (err, resp, body) => {
            res.send(body);
        });
    }
}
