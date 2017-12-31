module.exports = class UserData{

    constructor(sid){
        this.sid = sid;
        this.authed = false;
        this.token = undefined;
        this.data = undefined;
    }

    authenticate() {
        this.authed = true;
    }

    isAuthenticated() {
        return this.authed;
    }

    setToken(token) {
        this.token = token;
    }

    setData(data) {
        this.data = data;
    }
};
