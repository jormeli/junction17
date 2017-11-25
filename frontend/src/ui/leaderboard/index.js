import { connect } from 'react-redux';
import { leaderboardFetch } from './actions';
import Leaderboard from './Leaderboard';

const mapStateToProps = state => ({
    data: state.leaderboard.data
});

export default connect(
    mapStateToProps,
    { leaderboardFetch }
)(Leaderboard);
