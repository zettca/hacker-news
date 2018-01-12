const request = require('request');
const querystring = require('querystring');
const mongo = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');

const UserData = require('./UserData.js');
const config = require('../config.json');

const
    apiBase = "https://hacker-news.firebaseio.com/v0/",
    validateUri = "https://github.com/login/oauth/access_token/";

const items = {};
const stories = { top: null, new: null, best: null };

const authDB = [];

const getCat = (cat) => Object.keys(stories).includes(cat) && cat || "top";

function slicePage(list, page) {
    page = Number(page);
    const NUM_PER_PAGE = 10;
    return list.slice(page * NUM_PER_PAGE, (page + 1) * NUM_PER_PAGE);
}

function checkValidCodes(authCode, callback) {
    const url = validateUri + "?" + querystring.stringify({
        client_id: config.githubAuthAppId,
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

    request.get(opts, (err, res, body) => {
        callback(JSON.parse(body));
    });
}

function updateStories(cat, page, callback) {
    const url = `${apiBase}${cat}stories.json`;
    request.get(url, { json: true }, (err, res, body) => {
        stories[cat] = body;
        callback(body);
    });
}

function updateItem(itemId, callback) {
    const url = `${apiBase}item/${itemId}.json`;
    request.get(url, { json: true }, (err, res, body) => {
        items[itemId] = body;
        if (callback) callback(body);
    });
}

module.exports = {
    validateUser: function (req, res, next) {
        return (req.user)
            ? next() // valid user
            : res.status(401).json({ error: "Unauthorized" });
    },
    handleAuth: function (req, res) {
        checkValidCodes(req.params.code, (success, body) => {
            if (success) {
                getUserData(body.access_token, (data) => {
                    if (!data) return;
                    console.log(`${data.login} logged in...`);
                    if (!authDB.includes(data.id)) authDB.push(data.id);
                    const token = jwt.sign({
                        id: data.id,
                        login: data.login,
                    }, config.secret, { expiresIn: "7d" });
                    res.json({ status: "logged in", token, data });
                });
            } else {
                res.status(401).json({ error: "oauth authentication error" });
            }
        });
    },
    handleAPIItems: function (req, res) {
        const itemId = req.params.id;
        if (items[itemId]) {
            res.json(items[itemId]);
        } else {
            updateItem(itemId, (item) => {
                res.json(item);
            });
        }
    },
    handleAPIStories: function (req, res) {
        const cat = getCat(req.params.cat), page = req.params.page;
        if (stories[cat]) {
            res.json(slicePage(stories[cat], page));
        } else {
            updateStories(cat, page, (stories) => {
                res.json(slicePage(stories, page));
            });
        }
    },
}
