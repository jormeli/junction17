import {
    MAP_DATA_FETCH,
    MAP_DATA_FETCH_FAIL,
    MAP_DATA_FETCH_SUCCESS,
    SET_VISIBILITY_FILTER
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

export const setVisibilityFilter = location => ({
    type: SET_VISIBILITY_FILTER,
    visibilityFilter: location
});
