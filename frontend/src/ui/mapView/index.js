import { connect } from 'react-redux';
import MapView from './MapView';
import { mapDataFetch } from './actions';

export default connect(null, { mapDataFetch })(MapView);
