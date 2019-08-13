import React from 'react';
import { ago } from "time-ago";
import "./Comment.css"
import { fetchAPI } from "../helpers";

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
        fetchAPI("/item/" + id, jwt)
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

        const timeMs = data.time * 1000;

        return (
            <div className={`Comment ${collapsed ? " collapsed" : ""}`}>
                <div className="Comment-left" onClick={this.toggleCollapse.bind(this)}></div>
                <div className="Comment-right">
                    <div className="Comment-head">
                        <span className="Comment-author">{data.by}</span>
                        <span title={new Date(timeMs).toLocaleString()}>{ago(timeMs)}</span>
                    </div>
                    <div className={"Comment-text" + collapseCss}>
                        <span dangerouslySetInnerHTML={{ __html: data.text }} />
                    </div>
                    <div className={"Comment-kids" + collapseCss}>
                        {kids}
                    </div>
                </div>


            </div>);
    }
}

export default Comment;
