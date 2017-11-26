import { connect } from 'react-redux';
import { leaderboardFetch, imageFetch } from './actions';
import Leaderboard from './Leaderboard';

const mapStateToProps = state => ({
    data: state.leaderboard.data,
    images: state.images
});

export default connect(
    mapStateToProps,
    { leaderboardFetch, imageFetch }
)(Leaderboard);
