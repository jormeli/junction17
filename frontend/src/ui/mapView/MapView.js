import React, { Component } from 'react';

class MapView extends Component {
    componentWillMount() {
        // TODO: dispatch here
        this.props.mapDataFetch();
    }

    render() {
        return (
            <div className="map-wrapper">
                <div className="map-left-column">

                </div>

                <div className="map-right-column">

                </div>

            </div>
        );
    }
}

export default MapView;
