import React from 'react';
import { ago } from "time-ago";
import { Link } from "react-router-dom";
import { Textfit } from "react-textfit";
import './Story.css';
import { fetchDataWithJWT } from "../helpers";

const apiBase = "http://localhost:8080/api/";

class Story extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        fetchDataWithJWT(`${apiBase}item/${this.props.id}`, localStorage.getItem("jwt"))
            .then((data) => {
                this.setState({ data });
            });
    }

    render() {
        const storyData = this.state.data;
        if (!storyData || Object.keys(storyData).length === 0) return null;
        return (
            <article className="Story">
                <div className="Story-score">
                    <span>{storyData.score}</span>
                </div>
                <div className="Story-main">
                    <div className="Story-title">
                        <Textfit
                            mode="single"
                            max={28}>
                            <a target="_blank" href={storyData.url}>{storyData.title}</a>
                        </Textfit>
                    </div>
                    <div className="Story-desc">
                        <div className="group">
                            <Link to={`/post/${storyData.id}`}>
                                {storyData.descendants + " comments"}
                            </Link>
                        </div>
                        <div className="group">
                            <span>submitted {ago(storyData.time * 1000)}</span>
                            <span>by <i>{storyData.by}</i></span>
                        </div>
                    </div>
                </div>
            </article>);
    }
}

export default Story;
