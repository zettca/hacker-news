const axios = require('axios');
const jwt = require('jsonwebtoken');

function checkValidCodes(authCode) {
    const opts = {
        method: 'post',
        url: 'https://github.com/login/oauth/access_token/',
        headers: { 'accept': 'application/json' },
        data: {
            client_id: process.env.GITHUB_APP_ID,
            client_secret: process.env.GITHUB_APP_SECRET,
            code: authCode
        }
    };

    return axios(opts).then(res => Promise.resolve(res.data));
}

function getUserData(token) {
    const opts = {
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
            'User-Agent': 'request',
            'Authorization': 'token ' + token,
        },
    };

    return axios(opts).then(res => Promise.resolve(res.data));
}

module.exports = {
    validateUser: function (req, res, next) {
        return (req.user)
            ? next() // valid user
            : res.status(401).json({ error: 'Unauthorized' });
    },

    handleAuth: function (req, res) {
        checkValidCodes(req.params.code)
            .then(data => getUserData(data.access_token))
            .then(userData => {
                console.log(`${userData.login} logged in...`);
                const token = jwt.sign({
                    id: userData.id,
                    login: userData.login,
                }, process.env.SECRET, { expiresIn: '7d' });
                res.json({ status: 'logged in', token, userData });
            });
    }
};
