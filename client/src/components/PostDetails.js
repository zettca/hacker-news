import React from 'react';
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
        if (!data) return null;
        const kids = data.kids && data.kids.map((cId) => (<Comment id={cId} key={cId} depth={0} />));
        console.log(data);
        return (
            <section>
                <h2>
                    <a href={data.url}>{data.title}</a>
                </h2>
                <div>{kids || "No comments..."}</div>
            </section>);
    }
}

export default PostDetails;
