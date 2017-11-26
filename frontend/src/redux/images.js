import { takeEvery, put, call, select } from 'redux-saga/effects';
import {
    imageFetch,
    imageFetchFail,
    imageFetchSuccess
} from '../ui/leaderboard/actions';
import {
    IMAGE_FETCH,
    IMAGE_FETCH_FAIL,
    IMAGE_FETCH_SUCCESS
} from '../redux/actionTypes';
import { } from '../ui/leaderboard/actions';

const initialState = {};

const images = (state = {}, action) => {
    switch (action.type) {
        case IMAGE_FETCH_SUCCESS:
            return {
                ...state,
                [action.id]: action.payload
            };

        case IMAGE_FETCH_FAIL:
            return {
                ...state,
                [action.id]: 'ERROR'
            }

        default:
            return state;
    }
}

export default images;

// watcher saga
export function* watchFetchImages() {
    yield takeEvery(IMAGE_FETCH, fetchImage);
}

// worker saga
function* fetchImage(action) {
    try {
        const computedData = yield select(state => state.leaderboard.data.computedData)
        const payload = yield call(imageFetch, action.id);
    } catch (e) {
        console.error(e);
        yield put(imageFetchFail(action.id));
    }
}

const imageFetcher = (id) => (
    fetch(`/api/images/${id}`)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.error(err);
        throw Error();
    })
);
