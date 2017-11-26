import React, { Component } from 'react';
import {
    locationsParse,
    sightingsToScale,
    sightingsToBlur,
    sightingsToBrightness,
} from '../../utilities/cameraFunctions';

import PersonList from '../common/personList';

class MapView extends Component {
    countUniques(computedData, rawData, visibilityFilter) {
        let count = 0;
        if (!visibilityFilter) {
            computedData.map(el => count += 1);
            if (rawData['-1']) count += rawData['-1'].length;
        } else {
            computedData.map(person => (
                person.map(sighting => {
                    if (sighting.location === visibilityFilter) count += 1;
                })
            ));

            if (rawData['-1']) {
                rawData['-1'].map(sighting => {
                    if (sighting.location === visibilityFilter) count += 1;
                });
            }
        }

        return count;
    }

    countTotalPeople(computedData, rawData, visibilityFilter) {
        let count = 0;
        if (!visibilityFilter) {
            computedData.map(el => count += el.length);
            if (rawData['-1']) count += rawData['-1'].length;
        } else {
            computedData.map(person => {
                if (person.some(sighting => sighting.location === visibilityFilter)) count += 1;
            });

            if (rawData['-1']) {
                rawData['-1'].map(sighting => {
                    if (sighting.location === visibilityFilter) count += 1;
                });
            }
        }

        return count;
    }

    render() {
        let uniques, totalPeople;

        if (this.props.data) {
            const { computedData, rawData } = this.props.data;
            const { visibilityFilter } = this.props;

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
                                            onClick={() => console.log(camera.name)}
                                        ></button>
                                        <div className="map-camera-point-label">{camera.name}</div>
                                    </div>
                                )
                            })
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
