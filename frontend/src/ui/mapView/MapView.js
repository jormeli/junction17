import React, { Component } from 'react';

class MapView extends Component {
    componentWillMount() {
        // trigger fetching map data
        this.props.mapDataFetch();
    }

    render() {
        return (
            <div className="map-wrapper">
                <div className="map-left-column">
                    <img className="map-image" src={require('../../resources/images/junction_map.png')} />
                    <div className="map-camera-points">
                        <div className="map-camera-point" style={styles.camera1}></div>
                        <div className="map-camera-point" style={styles.camera2}></div>
                    </div>
                </div>

                <div className="map-right-column">
                    <div className="map-camera-video"></div>
                    <div className="map-camera-stats">
                        <h2>Eteisen kamera</h2>
                        <ul className="map-camera-stats-list">
                            <li className="map-camera-stat">
                                <span className="map-camera-stat-label">Ihmisiä nähty:</span>
                                <span className="map-camera-stat-value">107</span>
                            </li>
                            <li className="map-camera-stat">
                                <span className="map-camera-stat-label">Uniikkeja ihmisiä nähty:</span>
                                <span className="map-camera-stat-value">63</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    camera1: {
        top: 400,
        left: 305,
    },
    camera2: {
        top: 360,
        left: 1060,
    },
};

export default MapView;
