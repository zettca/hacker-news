import React from 'react';
import Comment from "./Comment";
import { fetchDataWithJWT } from "../helpers";

const apiBase = "http://localhost:8080/api/";

class PostDetails extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        const itemId = this.props.match.params.id;
        fetchDataWithJWT(`${apiBase}item/${itemId}`, localStorage.getItem("jwt"))
            .then((data) => {
                this.setState({ data });
            });
    }

    render() {
        const { data } = this.state;
        if (!data) return null;
        const comments = data.kids.map((cId) => (<Comment id={cId} key={cId} depth={0} />));
        console.log(data);
        return (
            <section>
                <a href={data.url}>
                    <h2>{data.title}</h2>
                </a>
                <div>{comments}</div>
            </section>);
    }
}

export default PostDetails;
