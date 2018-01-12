import React from 'react';
import Story from './Story';
import { fetchDataWithJWT } from "../helpers";

const apiBase = "http://localhost:8080/api/";

class FeedPage extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() {
        const { page } = this.props;
        fetchDataWithJWT(`${apiBase}stories/top/${page}`, localStorage.getItem("jwt"))
            .then((data) => {
                this.setState({ data });
            })
            .catch((err) => console.log(err));
    }

    render() {
        const { data } = this.state;
        if (!data || data.error) return null;
        const stories = this.state.data.map((el) => (<Story id={el} key={el} />));
        return ((stories.length === 0)
            ? <span>Loading stories...</span>
            : <section>{stories}</section>);
    }
}

export default FeedPage;
