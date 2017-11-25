import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';

import cameras from './cameras';
import {
    watchFetchMapData
} from './cameras';

// TODO: import reducers here, combine and export as AppReducer

export default combineReducers({
    cameras
});

export function* appSaga() {
    yield all([
        watchFetchMapData()
    ]);
}
