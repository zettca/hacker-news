import React from 'react';
import { ago } from "time-ago";
import { Link } from "react-router-dom";
import { Textfit } from "react-textfit";
import './Story.css';

class Story extends React.Component {
    render() {
        const { data } = this.props;
        if (!data || Object.keys(data).length === 0) return null;
        return (
            <article className="Story">
                <div className="Story-title">
                    <a target="_blank" href={data.url}>
                        {(data.title.length <= 32)
                            ? <Textfit
                                mode="single"
                                min={12}
                                max={32}>
                                {data.title}
                            </Textfit>
                            : <div>{data.title}</div>}
                    </a>
                </div>
                <div className="Story-score">
                    <span>{data.score} points</span>
                </div>
                <div className="Story-desc">
                    <div className="group">
                        <Link to={`/post/${data.id}`}>
                            {(data.descendants || 0) + " comments"}
                        </Link>
                    </div>
                    <div className="group">
                        <span>submitted {ago(data.time * 1000)}</span>
                        <span>by <i>{data.by}</i></span>
                    </div>
                </div>
            </article>);
    }
}

export default Story;
