import { connect } from 'react-redux';
import PersonList from './PersonList';
import { leaderboardFetch } from '../../leaderboard/actions';

const mapStateToProps = state => ({
    data: state.leaderboard.data
});

export default connect(mapStateToProps, { leaderboardFetch })(PersonList);
