import { takeEvery, put, call } from 'redux-saga/effects';
import {
    MAP_DATA_FETCH,
    MAP_DATA_FETCH_FAIL,
    MAP_DATA_FETCH_SUCCESS
} from './actionTypes';
import {
    mapDataFetchFail,
    mapDataFetchSuccess
} from '../ui/mapView/actions';

const initialState = {
    data: null
};

const cameras = (state = initialState, action) => {
    switch (action.type) {
        case MAP_DATA_FETCH_SUCCESS:
            return {
                ...state,
                data: action.payload
            };

        default:
            return state;
    }
}

export default cameras;

// watcher saga
export function* watchFetchMapData() {
    yield takeEvery(MAP_DATA_FETCH, fetchMapData);
}

// worker saga
function* fetchMapData() {
    try {
        const data = yield call(mapDataFetcher);
        yield put(mapDataFetchSuccess(data));
    } catch (e) {
        console.error(e);
        yield put(mapDataFetchFail());
    }
}

const mapDataFetcher = () => (
    fetch('/api/location/test')
    .then(res => {
        if (res.ok) {
            return res.json();
        } else {
            throw Error();
        }
    })
    .catch(err => {
        console.error(err);
        throw Error();
    })
);
