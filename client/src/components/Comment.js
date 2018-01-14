import React from 'react';
import { resolve } from "url";
import "./Comment.css"
import { fetchAuthed } from "../helpers";

class Comment extends React.Component {
    constructor(props) {
        super();
        this.state = {
            collapsed: props.depth >= 3
        };
    }

    componentDidMount() {
        const { id } = this.props;

        const jwt = localStorage.getItem("jwt");
        const host = process.env.REACT_APP_SERVER_HOST || "";
        fetchAuthed(resolve(host, "/api/item/") + id, jwt)
            .then(res => res.json())
            .then((data) => {
                this.setState({ data });
            });
    }

    componentWillUnmount() {
        // TODO: abort fetches (AbortController)
    }

    toggleCollapse() {
        const { collapsed } = this.state;
        this.setState({ collapsed: !collapsed });
    }

    render() {
        const { collapsed, data } = this.state;
        const { depth } = this.props;
        if (!data || data.deleted) return null;
        const kids = data.kids && data.kids.map((cId) => (<Comment id={cId} key={cId} depth={depth + 1} />));
        const collapseCss = collapsed ? " collapsed" : "";

        return (
            <div className="Comment">
                <div className="Comment2">
                    <div className="Comment-controls" onClick={this.toggleCollapse.bind(this)}>
                        [{collapsed ? "+" : "-"}]
                    </div>
                    <div className="Comment-main">
                        <div>
                            <div className="Comment-head">
                                <span className="Comment-author">{data.by}</span>
                            </div>
                            <div className={"Comment-text" + collapseCss}>
                                <span dangerouslySetInnerHTML={{ __html: data.text }} />
                            </div>
                        </div>
                        <div className={"Comment-kids" + collapseCss}>
                            {kids}
                        </div>
                    </div>
                </div>
            </div>);
    }
}

export default Comment;
