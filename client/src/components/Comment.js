import React from 'react';
import "./Comment.css"
import { fetchDataWithJWT } from "../helpers";

const apiBase = "http://localhost:8080/api/";

class Comment extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        const { id } = this.props;
        fetchDataWithJWT(`${apiBase}item/${id}`, localStorage.getItem("jwt"))
            .then((data) => {
                this.setState({ data });
            });
    }

    cleanComment(text) {
        return text.length <= 140 ? text : text.substring(0, 140) + "...";
    }

    render() {
        const { data } = this.state;
        const { depth } = this.props;
        if (!data || data.deleted) return null;
        const comments = data.kids && data.kids.map((cId) => (<Comment id={cId} key={cId} depth={depth} />));
        console.log(data);
        return (
            <div>
                <div className="Comment-data">
                    <span>
                        <strong>{data.by}:</strong>
                    </span>
                    <span>{this.cleanComment(data.text)}</span>
                </div>
                <div className="Comment-kids">
                    {comments || null}
                </div>
            </div>);
    }
}

export default Comment;
