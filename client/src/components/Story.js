import React from 'react';
import './Story.css';

const apiBase = "https://hacker-news.firebaseio.com/v0/";

function timeSince(timestamp) {
    const now = new Date();
    const secsPast = (now.getTime() - timestamp * 1000) / 1000;
    if (secsPast < 60) return parseInt(secsPast, 10) + 's';
    if (secsPast < 3600) return parseInt(secsPast / 60, 10) + 'm';
    if (secsPast < 24 * 3600) return parseInt(secsPast / 3600, 10) + 'h';
    if (secsPast < 7 * 24 * 3600) return parseInt(secsPast / 24 * 3600, 10) + 'd';
    return parseInt(secsPast / 7 * 24 * 3600, 10) + 'w';
}

class Story extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        fetch(`${apiBase}/item/${this.props.id}.json`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({ data });
            });
    }

    render() {
        let storyData = this.state.data;
        if (!storyData || Object.keys(storyData).length === 0) return null;
        return (
            <article className="Story">
                <div className="Story-score">
                    <span>{storyData.score}</span>
                </div>
                <div className="Story-desc">
                    <a href={storyData.url}>
                        <h3 className="Story-title">{storyData.title}</h3>
                    </a>
                    <div className="group">
                        <span>{storyData.descendants} comments</span>
                    </div>
                    <div className="group">
                        <span>posted by <strong>{storyData.by}</strong></span>
                        <span>{timeSince(storyData.time)} ago</span>
                    </div>
                </div>
            </article>);
    }
}

export default Story;
