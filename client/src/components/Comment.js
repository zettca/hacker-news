import React from 'react';
import "./Comment.css"
import { fetchAuthed } from "../helpers";

const apiBase = "http://localhost:8080/api/";

const UnsafeContent = (props) => {
    const html = {
        __html: unescape(props.text)
    }
    return (<span dangerouslySetInnerHTML={html}></span>)
}

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
        fetchAuthed(`${apiBase}item/${id}`, jwt)
            .then(res => res.json())
            .then((data) => {
                this.setState({ data });
            });
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
        console.log(data);
        return (
            <div className="Comment">
                <div className="Comment-parent">
                    <div className="Comment-controls" onClick={this.toggleCollapse.bind(this)}>
                        [{collapsed ? "+" : "-"}]
                    </div>
                    <div>
                        <div className="Comment-head">
                            <span className="Comment-author">{data.by}</span>
                        </div>
                        <div className={"Comment-text" + collapseCss}>
                            {!collapsed && <UnsafeContent text={data.text} />}
                        </div>
                    </div>
                </div>
                <div className={"Comment-kids" + collapseCss}>
                    {kids}
                </div>
            </div>);
    }
}

export default Comment;
