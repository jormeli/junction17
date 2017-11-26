import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import MapView from './MapView';
import { mapDataFetch, setVisibilityFilter } from './actions';

// const getVisibilityFilter = state => state.visibilityFilter;
// const getLeaderboard = state => state.data;

// const getFilteredNumbers = createSelector(
//     [ getVisibilityFilter, getLeaderboard ],
//     (visibilityFilter, computedData)
// )

const mapStateToProps = state => ({
    data: state.leaderboard.data,
    visibilityFilter: state.leaderboard.visibilityFilter
});

export default connect(
    mapStateToProps,
    {
        mapDataFetch,
        setVisibilityFilter
    }
)(MapView);
