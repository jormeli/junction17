import React, { Component } from 'react';

class Leaderboard extends Component {
    componentDidMount() {
        // fetch data here
        this.props.leaderboardFetch();
    }

    render() {
        const { data, error } = this.props;

        if (!data && !error) {
            return <div className="leaderboard-wrapper">Fetching...</div>;
        }

        if (error) {
            return <div className="leaderboard-wrapper">Something went wrong</div>;
        }

        return (
            <div className="leaderboard-wrapper">
                Leaderboards here
            </div>
        );
    }
}

export default Leaderboard;
