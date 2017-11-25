import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import cameras, { watchFetchMapData } from './cameras';
import leaderboard, { watchFetchLeaderboard } from './leaderboard';

export default combineReducers({
    cameras,
    leaderboard
});

export function* appSaga() {
    yield all([
        watchFetchMapData(),
        watchFetchLeaderboard()
    ]);
}
