import { takeEvery, put, call } from 'redux-saga/effects';

// location actions
export const locationsFetch = () => ({
    type: 'LOCATIONS_FETCH'
});

export const locationsFetchFail = () => ({
    type: 'LOCATIONS_FETCH_FAIL'
});

export const locationsFetchSuccess = payload => ({
    type: 'LOCATIONS_FETCH_SUCCESS',
    payload
});

const initialState = {
    locations: {}
}

const locations = (state = initialState, action) => {
    switch (action.type) {
        case 'LOCATIONS_FETCH_SUCCESS':
            return {
                ...state,
                locations: action.payload
            }

        default:
            return state;
    }
}

export default locations;

export function* watchFetchLocation() {
    yield takeEvery('LOCATIONS_FETCH', fetchLocation);
}

function* fetchLocation() {
    try {
        const locations = yield call(locationsFetcher);
        yield put(locationsFetchSuccess(locations));
    } catch (e) {
        console.error(e);
        yield put(locationsFetchFail());
    }
}

const locationsFetcher = () => (
    fetch('/api/locations')
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