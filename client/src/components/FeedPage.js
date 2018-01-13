import React from 'react';
import Story from './Story';
import { fetchAuthed } from "../helpers";

const apiBase = "http://localhost:8080/api/";

class FeedPage extends React.Component {
    constructor() {
        super();
        this.state = {
            storiesData: []
        }
    }

    componentDidMount() {
        const { data } = this.props;
        const jwt = localStorage.getItem("jwt");
        Promise.all(data.map((id) => {
            return fetchAuthed(`${apiBase}item/${id}`, jwt).then(res => res.json());
        })).then(storiesData => {
            this.setState({ storiesData });
        });
    }

    render() {
        const { storiesData } = this.state; // stories
        if (!storiesData || storiesData.error) return null;
        return (
            <section>
                {(storiesData.length > 0)
                    ? storiesData.map((el) => (<Story id={el.id} key={el.id} data={el} />))
                    : "Loading stories..."}
            </section>);
    }
}

export default FeedPage;
