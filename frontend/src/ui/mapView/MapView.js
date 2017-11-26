import React, { Component } from 'react';
import {
    locationsParse,
    sightingsToScale,
    sightingsToBlur,
    sightingsToBrightness,
} from '../../utilities/cameraFunctions';

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

        const locationsRaw = {
            'crowd': 1000,
            'entrance': 400,
        }

        const cameras = locationsParse(locationsRaw);

        const minSightings = cameras.reduce((min, cur) => cur.sightings < min ? cur.sightings : min, 100000);
        const maxSightings = cameras.reduce((max, cur) => cur.sightings > max ? cur.sightings : max, -1);

        return (
            <div className="map-wrapper">
                <div className="map-left-column">
                    <img className="map-image" src={require('../../resources/images/junction_map.png')} alt="kartta" />
                    <div className="map-camera-points">
                        {
                            cameras.map((camera) => {
                                return (
                                    <div className="map-camera-point" style={camera.position} key={camera.name}>
                                        <button
                                            className="map-camera-point-btn"
                                            style={{
                                                filter: `blur(${sightingsToBlur(camera.sightings, minSightings, maxSightings)}) brightness(${sightingsToBrightness(camera.sightings, minSightings, maxSightings)})`,
                                                transform: `scale(${sightingsToScale(camera.sightings, minSightings, maxSightings)})`,
                                            }}
                                            onClick={() => this.props.setVisibilityFilter(camera.name)}
                                        ></button>
                                        <div className="map-camera-point-label">{camera.name}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>

                <div className="map-right-column">
                        <div style={{'textAlign': 'center'}}>
                            <video width="500" height="800" autoplay="autoplay" loop="loop" style={{margin: 'auto' }}>
                            <source src="/video.mov" type="video/mp4" />
                            Your browser does not support the video tag.
                            </video>
                        </div>

                    <div className="map-camera-stats">

                        <button className="map-camera-selection-clear" onClick={() => this.props.setVisibilityFilter(null)}>
                            <img src={require('../../resources/images/icons/cross.png')} alt="" />
                        </button>

                        <h2>{this.props.visibilityFilter ? this.props.visibilityFilter : 'All cameras'}</h2>
                        <ul className="map-camera-stats-list">
                            <li className="map-camera-stat">
                                <span className="map-camera-stat-label">People seen:</span>
                                <span className="map-camera-stat-value">
                                    {!totalPeople ? '...' : totalPeople + 20}
                                </span>
                            </li>
                            <li className="map-camera-stat">
                                <span className="map-camera-stat-label">Unique people seen:</span>
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
