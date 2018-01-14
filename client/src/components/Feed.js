import React from 'react';
import { resolve } from "url";
import FeedPage from './FeedPage';
import { fetchAuthed } from "../helpers";

class Feed extends React.Component {
    constructor() {
        super();
        this.state = {
            loadingPage: false,
            pagesData: []
        }
    }

    handleScroll() { // onScroll
        const BUFFER = 20, el = document.documentElement;
        const
            pageScroll = el.scrollTop + el.clientHeight,
            pageEnd = el.scrollHeight - BUFFER;

        const { loadingPage, pagesData } = this.state;
        if (!loadingPage && pageScroll > pageEnd) {
            console.log("hit page bottom, loading more items...");
            this.loadPage(pagesData.length);
        }
    }

    loadPage(pageNum) {
        const { pagesData } = this.state;

        this.setState({ loadingPage: true });
        this.forceUpdate();

        const jwt = localStorage.getItem("jwt");
        const host = process.env.REACT_APP_SERVER_HOST || "";
        fetchAuthed(resolve(host, "/api/stories/top/") + pageNum, jwt)
            .then(res => res.json())
            .then((data) => {
                pagesData.push(data);
                this.setState({
                    loadingPage: false,
                    pagesData: pagesData
                });
            })
            .catch((err) => console.log(err));
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
        this.loadPage(0);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
    }

    render() {
        const { loadingPage, pagesData } = this.state;
        return (
            <section>
                {pagesData.map((el, i) => (<FeedPage page={i} key={i} data={el} />))}
                <span>{loadingPage ? "Loading page..." : ""}</span>
            </section>);
    }
}

export default Feed;
