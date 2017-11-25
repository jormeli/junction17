import React, { Component } from 'react';
import { nameToPos } from '../../utilities/cameraFunctions';

import PersonList from '../common/personList';

class MapView extends Component {
    componentWillMount() {
        // trigger fetching map data
        this.props.mapDataFetch();
    }

    countUniques(computedData, rawData) {
        let count = 0;
        computedData.map(el => count += 1);
        count += rawData['-1'].length;
        return count;
    }

    countTotalPeople(computedData, rawData) {
        let count = 0;
        computedData.map(el => count += el.length);
        count += rawData['-1'].length;
        return count;
    }

    render() {
        let uniques, totalPeople;

        if (this.props.data) {
            uniques = this.countUniques(this.props.data.computedData, this.props.data.rawData);
            totalPeople = this.countTotalPeople(this.props.data.computedData, this.props.data.rawData);
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
                    <img className="map-image" src={require('../../resources/images/junction_map.png')} />
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

const styles = {
    camera1: {
        top: 408,
        left: 313,
    },
    camera2: {
        top: 368,
        left: 1068,
    },
};

export default MapView;
