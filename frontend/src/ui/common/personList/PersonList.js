import React, { Component } from 'react';

class PersonList extends Component {
    componentDidMount() {
        // fetch here
        this.props.leaderboardFetch();
    }

    render() {
        console.log(this.props) // TODO: remove this, for debugging

        if (!this.props.data) {
            return <div className="person-list-wrapper">Fetching...</div>;
        }

        const { computedData } = this.props.data;
        return (
            <div className="person-list-wrapper">
                <ul className="person-list">
                    {
                        computedData.map((person, i) => (
                            <li className="person-list-entry" key={i}>
                                <img className="person-list-entry-img" src={require('../../../resources/images/placeholder.png')} />
                                <div className="person-list-entry-texts">
                                    <span className="person-list-entry-id">{i}</span>
                                    <span className="person-list-entry-spotted">
                                        <img className="person-list-entry-spotted-icon" src={require('../../../resources/images/icons/cross.png')} />
                                        {person.length}
                                    </span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

export default PersonList;