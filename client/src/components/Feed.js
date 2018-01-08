import React from 'react';
import Story from './Story';

const apiBase = "https://hacker-news.firebaseio.com/v0/";

class Feed extends React.Component {
    constructor() {
        super();
        this.state = {
            allStories: [],
            stories: [],
        }
    }

    componentDidMount() {
        const numToLoad = 10;
        fetch(`${apiBase}${this.props.category}stories.json`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    allStories: data,
                    stories: data.slice(0, numToLoad),
                });
            });
    }

    render() {
        const stories = this.state.stories.map((el) => (<Story id={el} key={el} />));
        return ((stories.length === 0)
            ? <span>Loading stories...</span>
            : <section>{stories}</section>);
    }
}

export default Feed;
