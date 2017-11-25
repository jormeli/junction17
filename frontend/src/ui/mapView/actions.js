import {
    MAP_DATA_FETCH,
    MAP_DATA_FETCH_FAIL,
    MAP_DATA_FETCH_SUCCESS
} from '../../redux/actionTypes';

export const mapDataFetch = () => ({
    type: MAP_DATA_FETCH
});

export const mapDataFetchSuccess = payload => ({
    type: MAP_DATA_FETCH_SUCCESS,
    payload
});

export const mapDataFetchFail = () => ({
    type: MAP_DATA_FETCH_FAIL
});
