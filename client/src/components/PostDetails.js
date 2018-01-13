import React from 'react';
import { ago } from "time-ago";
import Comment from "./Comment";
import { fetchAuthed } from "../helpers";

const apiBase = "http://localhost:8080/api/";

class PostDetails extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        const itemId = this.props.match.params.id;
        const jwt = localStorage.getItem("jwt");
        fetchAuthed(`${apiBase}item/${itemId}`, jwt)
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
