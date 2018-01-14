import React from 'react';
import { resolve } from "url";
import { ago } from "time-ago";
import Comment from "./Comment";
import { fetchAuthed } from "../helpers";

class PostDetails extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        const { id } = this.props.match.params;

        const jwt = localStorage.getItem("jwt");
        const host = process.env.REACT_APP_SERVER_HOST || "";
        fetchAuthed(resolve(host, "/api/item/") + id, jwt)
            .then(res => res.json())
            .then((data) => {
                this.setState({ data });
            });
    }

    render() {
        const { data } = this.state;
        if (!data) return (<span>Loading Story...</span>);
        console.log(data);
        const kids = data.kids && data.kids.map((cId) => (<Comment id={cId} key={cId} depth={0} />));
        const timeMs = data.time * 1000;

        return (
            <section>
                <h2>
                    <a href={data.url}>{data.title}</a>
                </h2>
                <div className="big">
                    <span>{new Date(timeMs).toLocaleString()}</span>
                </div>
                <div className="big">
                    submited {ago(timeMs)}
                </div>
                <div className="big">
                    by <strong><i>{data.by}</i></strong>
                </div>
                <div>
                    {kids || "No comments..."}
                </div>
            </section>);
    }
}

export default PostDetails;
