import React from "react";
import { Redirect } from "react-router-dom";
import { parse } from "querystring";

class LoginHandler extends React.Component {
    constructor() {
        super();
        this.state = { loaded: false };
    }

    componentDidMount() {
        // TODO: clean this
        const { search } = this.props.location;
        const { code } = parse(search.slice(1));

        fetch(`http://localhost:8080/auth/github/${code}`)
            .then(res => res.json())
            .then(data => {
                localStorage.setItem("jwt", data.token);
                this.setState({ loaded: true });
            });
    }

    render() {
        const { loaded } = this.state;
        return (loaded
            ? <Redirect to={"/"} />
            : <div>Logging in with GitHub...</div>
        );
    }
}

export default LoginHandler;
