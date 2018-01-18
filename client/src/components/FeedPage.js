import React from 'react';
import Story from './Story';

class FeedPage extends React.PureComponent {
    render() {
        const { data } = this.props; // stories
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
