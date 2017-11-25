import {
    LEADERBOARD_FETCH,
    LEADERBOARD_FETCH_FAIL,
    LEADERBOARD_FETCH_SUCCESS
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
