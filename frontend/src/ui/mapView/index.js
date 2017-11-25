import { connect } from 'react-redux';
import MapView from './MapView';
import { mapDataFetch } from './actions';

// TODO: import action for fetching data

export default connect(null, { mapDataFetch })(MapView);
