import {
    LEADERBOARD_FETCH,
    LEADERBOARD_FETCH_FAIL,
    LEADERBOARD_FETCH_SUCCESS,
    IMAGE_FETCH,
    IMAGE_FETCH_FAIL,
    IMAGE_FETCH_SUCCESS
} from '../../redux/actionTypes';

export const leaderboardFetch = () => ({
    type: LEADERBOARD_FETCH
});

export const leaderboardFetchFail = () => ({
    type: LEADERBOARD_FETCH_FAIL
});

export const leaderboardFetchSuccess = payload => ({
    type: LEADERBOARD_FETCH_SUCCESS,
    payload
});

export const imageFetch = id => ({
    type: IMAGE_FETCH,
    id
});

export const imageFetchFail = id => ({
    type: IMAGE_FETCH_FAIL,
    id
});

export const imageFetchSuccess = (id, payload) => ({
    type: IMAGE_FETCH_SUCCESS,
    id,
    payload
});
