import React from 'react';
import FeedPage from './FeedPage';

class Feed extends React.Component {
    constructor() {
        super();
        this.state = {
            pages: [0]
        }
    }

    render() {
        const pages = this.state.pages.map((el) => (<FeedPage page={el} key={el} />));
        return (<section>{pages}</section>);
    }
}

export default Feed;
