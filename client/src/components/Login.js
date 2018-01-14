import React from 'react';
import "./Login.css";
import { stringify } from "querystring";

const oAuthUri = "https://github.com/login/oauth/authorize/?" + stringify({
    client_id: process.env.REACT_APP_GITHUB_ID,
});

class Login extends React.Component {
    render() {
        const token = localStorage.getItem("jwt");
        const text = token ? `Logout` : "Sign in with GitHub";
        const url = token ? "/logout" : oAuthUri;
        return (
            <a className="button Login" href={url}>
                <span>{text}</span>
            </a>);
    }
}

export default Login;
