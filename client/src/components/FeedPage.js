import React from 'react';
import { resolve } from "url";
import Story from './Story';
import { fetchAuthed } from "../helpers";

class FeedPage extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        const { data } = this.props;

        const jwt = localStorage.getItem("jwt");
        const host = process.env.REACT_APP_SERVER_HOST || "";
        Promise.all(data.map((id) => {
            return fetchAuthed(resolve(host, "/api/item/") + id, jwt).then(res => res.json());
        })).then(data => {
            this.setState({ data });
        });
    }

    render() {
        const { data } = this.state; // stories
        if (!data || data.error) return null;
        return (
            <section>
                {(data.length > 0)
                    ? data.map((el) => (<Story id={el.id} key={el.id} data={el} />))
                    : "Loading stories..."}
            </section>);
    }
}

export default FeedPage;
