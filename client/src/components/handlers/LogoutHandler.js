import React from "react";
import { Redirect } from "react-router-dom";

class LogoutHandler extends React.Component {
    constructor() {
        super();
        this.state = { done: false };
    }

    componentDidMount() {
        localStorage.removeItem("jwt");
        this.setState({ done: true });
    }

    render() {
        const { done } = this.state;
        return (done
            ? <Redirect to={"/"} />
            : <div>Logging out...</div>
        );
    }
}

export default LogoutHandler;
