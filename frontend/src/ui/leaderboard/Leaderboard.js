import React, { Component } from 'react';
import moment from 'moment';

class Sighting extends Component {
    // constructor() {
    //     super();
    //     this.state = {};
    // }
    // componentWillMount() {
    //     fetch('/api/image/' + this.props.spotted.id).then((response) => {
    //         response.text().then((text) => {
    //             this.setState({imageData: text })
    //         });
    //     });
    // }
    render() {
        return <li className="person-list-entry person-list-entry--spotting" key={this.props.index}>
            {/* <img className="person-list-entry-img" src={"data:image/jpeg;base64," + this.state.imageData} alt="" /> */}
            <img className="person-list-entry-img" src={"data:image/jpeg;base64," + this.props.image} alt="" />
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
                                <Sighting spotted={spotted} index={i} key={spotted.id} image={images[spotted.id]} />
                            ))
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Leaderboard;
