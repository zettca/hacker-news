import React from 'react';
import { ago } from "time-ago";
import Comment from "./Comment";
import { fetchAPI } from "../helpers";

class PostDetails extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        const { id } = this.props.match.params;

        const jwt = localStorage.getItem("jwt");
        fetchAPI("/item/" + id, jwt)
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
                <div>
                    submited <i title={new Date(timeMs).toLocaleString()}>{ago(timeMs)}</i> by <strong>{data.by}</strong>
                </div>
                <div>
                    {kids || "No comments..."}
                </div>
            </section>);
    }
}

export default PostDetails;
