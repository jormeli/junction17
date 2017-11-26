import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import cameras, { watchFetchMapData } from './cameras';
import leaderboard, { watchFetchLeaderboard } from './leaderboard';
import images, { watchFetchImages } from './images';
import locations, { watchFetchLocation } from './locations';

export default combineReducers({
    cameras,
    leaderboard,
    images,
    locations
});

export function* appSaga() {
    yield all([
        watchFetchMapData(),
        watchFetchLeaderboard(),
        watchFetchImages(),
        watchFetchLocation()
    ]);
}
