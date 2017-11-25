import { takeEvery, put, call } from 'redux-saga/effects';
// import action types and actions
import {
    LEADERBOARD_FETCH,
    LEADERBOARD_FETCH_FAIL,
    LEADERBOARD_FETCH_SUCCESS
} from './actionTypes';
import {
    leaderboardFetchFail,
    leaderboardFetchSuccess
} from '../ui/leaderboard/actions';

const initialState = {
    data: null,
    error: null
};

const leaderboard = (state = initialState, action) => {
    switch (action.type) {
        case LEADERBOARD_FETCH_FAIL:
            return {
                ...state,
                error: 'Something went wrong'
            };

        case LEADERBOARD_FETCH_SUCCESS:
            return {
                ...state,
                data: action.payload,
                error: null
            };

        default:
            return state;
    }
}

export default leaderboard;

// watcher saga
export function* watchFetchLeaderboard() {
    yield takeEvery(LEADERBOARD_FETCH, fetchLeaderboard);
}

// worker saga
function* fetchLeaderboard() {
    try {
        const payload = yield call(leaderboardFetcher);
        yield put(leaderboardFetchSuccess(payload));
    } catch (e) {
        console.error(e);
        yield put(leaderboardFetchFail());
    }
}

const leaderboardFetcher = () => (
    fetch('/api/people')
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw Error();
        }
    })
    .then(data => mapToLeaderboard(data))
    .catch(err => {
        console.error(err);
        throw Error();
    })
);

const mapToLeaderboard = data => ({
    rawData: data,
    computedData: Object.keys(data)
        .filter(key => key !== '-1')
        .sort((a, b) => data[a].length < data[b].length)
        .map(key => data[key])
});