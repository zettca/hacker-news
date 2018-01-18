import React from 'react';
import { ago } from "time-ago";
import { Link } from "react-router-dom";
import './Story.css';

class Story extends React.PureComponent {
    render() {
        const { data } = this.props;
        if (!data || Object.keys(data).length === 0) return null;
        return (
            <article className="Story">
                <div className="Story-title">
                    <a href={data.url}>{data.title}</a>
                </div>
                <div className="Story-score">

                </div>
                <div className="Story-desc">
                    <div>
                        <span>
                            {ago(data.time * 1000)} by <b>{data.by}</b>
                        </span>
                    </div>
                    <div>
                        <span>
                            <Link to={`/post/${data.id}`}>
                                {(data.descendants || 0) + " comments"}
                            </Link>
                        </span>
                        <span>
                            {data.score} points
                        </span>
                    </div>
                </div>
            </article>);
    }
}

export default Story;
