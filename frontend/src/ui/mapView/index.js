import { connect } from 'react-redux';
import MapView from './MapView';
import { mapDataFetch } from './actions';

const mapStateToProps = state => ({
    data: state.leaderboard.data
});

export default connect(mapStateToProps, { mapDataFetch })(MapView);
