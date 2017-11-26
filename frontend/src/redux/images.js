import { takeEvery, put, call, select } from 'redux-saga/effects';
import {
    imageFetch,
    imageFetchFail,
    imageFetchSuccess
} from '../ui/leaderboard/actions';
import {
    IMAGE_FETCH,
    IMAGE_FETCH_FAIL,
    IMAGE_FETCH_SUCCESS,
    LEADERBOARD_FETCH_SUCCESS
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
    yield takeEvery(LEADERBOARD_FETCH_SUCCESS, fetchImages);
}

function* fetchImages() {
    try {
        const computedData = yield select(state => state.leaderboard.data.computedData);
        yield computedData.map(m => (
            m.map(function* (n) {
                try {
                    const image = yield call(imageFetcher, n.id);
                    yield put(imageFetchSuccess(n.id, image));
                } catch (e) {
                    put(imageFetchFail(n.id));
                }
            }
        )))
    } catch (e) {
        console.error(e);
    }
}

const imageFetcher = (id) => (
    fetch(`/api/image/${id}`)
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
