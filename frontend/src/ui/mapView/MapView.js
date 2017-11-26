import React, { Component } from 'react';
import { nameToPos } from '../../utilities/cameraFunctions';

import PersonList from '../common/personList';

class MapView extends Component {
    componentDidMount() {
        this.props.locationsFetch();
    }

    countUniques(computedData, rawData, visibilityFilter) {
        let count = 0;
        if (!visibilityFilter) {
            computedData.map(el => count += 1);
        } else {
            computedData.map(person => (
                person.map(sighting => {
                    if (sighting.location === visibilityFilter) count += 1;
                })
            ));
        }

        return count;
    }

    countTotalPeople(computedData, rawData, visibilityFilter) {
        let count = 0;
        if (!visibilityFilter) {
            computedData.map(el => count += el.length);
        } else {
            computedData.map(person => {
                if (person.some(sighting => sighting.location === visibilityFilter)) count += 1;
            });
        }

        return count;
    }

    render() {
        let uniques, totalPeople;

        if (this.props.data) {
            const { computedData, rawData } = this.props.data;
            const { visibilityFilter } = this.props;
            // const visibilityFilter = 'entrance'

            uniques = this.countUniques(computedData, rawData, visibilityFilter);
            totalPeople = this.countTotalPeople(computedData, rawData, visibilityFilter);
        }

        const cameras = [
            {
                name: 'test',
                position: nameToPos('Test'),
            },
        ];

        return (
            <div className="map-wrapper">
                <div className="map-left-column">
                    <img className="map-image" src={require('../../resources/images/junction_map.png')} alt="kartta" />
                    <div className="map-camera-points">
                        {
                            cameras.map((camera) => (
                                <div className="map-camera-point" style={camera.position} key={camera.name}>
                                    <button className="map-camera-point-btn" onClick={() => console.log(camera.name)}></button>
                                    <div className="map-camera-point-label">{camera.name}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="map-right-column">
                    <div className="map-camera-video"></div>

                    <div className="map-camera-stats">
                        <h2>Eteisen kamera</h2>
                        <ul className="map-camera-stats-list">
                            <li className="map-camera-stat">
                                <span className="map-camera-stat-label">Ihmisiä nähty:</span>
                                <span className="map-camera-stat-value">
                                    {!totalPeople ? '...' : totalPeople}
                                </span>
                            </li>
                            <li className="map-camera-stat">
                                <span className="map-camera-stat-label">Uniikkeja ihmisiä nähty:</span>
                                <span className="map-camera-stat-value">
                                    {!uniques ? '...' : uniques}
                                </span>
                            </li>
                        </ul>

                        <h3>Most spotted</h3>
                        <PersonList />
                    </div>

                </div>
            </div>
        );
    }
}

export default MapView;
