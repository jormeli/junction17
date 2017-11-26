import React, { Component } from 'react';
import moment from 'moment';

class Sighting extends Component {
    constructor() {
        super();
        this.state = {};
    }
    componentWillMount() {
        fetch('/api/image/' + this.props.spotted.id).then((response) => {
            response.text().then((text) => {
                this.setState({imageData: text })
            });
        });
    }
    render() {
        return <li className="person-list-entry person-list-entry--spotting" key={this.props.index}>
            <img className="person-list-entry-img" src={"data:image/jpeg;base64," + this.state.imageData} alt="" />
            <div className="person-list-entry-texts person-list-entry-texts--spotting">
                <span className="person-list-entry-num">Sighting {this.props.index}</span>
                <span className="person-list-entry-timestamp">{moment(this.props.spotted.spotted_at).format("DD.MM.YYYY, HH:mm:ss")}</span>
            </div>
        </li>;
    }
}
class Leaderboard extends Component {
    constructor() {
        super();
        this.state = {
            activeIndex: 0
        };
    }

    componentDidMount() {
        // fetch data here if not already in store
        if (!this.props.data) {
            this.props.leaderboardFetch();
        }
    }

    render() {
        console.log(this.props)
        const { data, error, images } = this.props;

        if (!data && !error) {
            return (
                <div className="leaderboard-wrapper">
                    <div className="leaderboard-column-left">
                        <h2>People</h2>
                        <ul className="person-list">Fetching...</ul>
                    </div>

                    <div className="leaderboard-column-right">
                        <h2>Sightings</h2>
                        <ul className="person-list">Fetching...</ul>
                    </div>
                </div>
            );
        }

        if (error) {
            return <div className="leaderboard-wrapper">Something went wrong</div>;
        }

        let spottedData = [
            {
                id: 0,
                location: 'test',
                picture: image,
                spotted_at: '2017-11-25 16:10:10.289406',
            },
            {
                id: 0,
                location: 'test',
                picture: image,
                spotted_at: '2017-11-25 16:10:10.289406',
            },
            {
                id: 0,
                location: 'test',
                picture: image,
                spotted_at: '2017-11-25 16:10:10.289406',
            },
        ]

        const { computedData } = data;

        return (
            <div className="leaderboard-wrapper">
                <div className="leaderboard-column-left">
                    <h2>People</h2>
                    <ul className="person-list">
                        {
                            computedData.map((person, i) => (
                                <li className="person-list-entry person-list-entry--leaderboard" key={i} onClick={() => this.setState({ activeIndex: i })}>
                                    {/* <img className="person-list-entry-img" src={"data:image/jpeg;base64," + person.picture} alt="" /> */}
                                    <div className="person-list-entry-texts person-list-entry-texts--leaderboard">
                                        <span className="person-list-entry-id">Person {i}</span>
                                        <span className="person-list-entry-spotted">
                                            <img className="person-list-entry-spotted-icon" src={require('../../resources/images/icons/cross.png')} alt="kuva" />
                                            {person.length}
                                        </span>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="leaderboard-column-right">
                {/* <h2>Sightings { spottedData.length > 0 ? ` - Person ${this.state.activeIndex}` : ''}</h2> */}
                <h2>Sightings {` - Person ${this.state.activeIndex}`}</h2>
                    <ul className="person-list">
                        {
                            computedData[this.state.activeIndex].map((spotted, i) => (
                                <Sighting spotted={spotted} index={i} key={spotted.id} />
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Leaderboard;

const image = "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\n"
