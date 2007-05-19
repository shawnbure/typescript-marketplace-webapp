import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        
        setTheme: (state, action) => {

            state.theme = action.payload;

        },
        
        setAccessToken: (state, action) => {

            state.accessToken = action.payload;

        },

        setRefreshToken: (state, action) => {

            state.refreshToken = action.payload;

        },

        setAccessTokenExpirationTime: (state, action) => {

            state.accessTokenExpirationTime = action.payload;

        },

        setUserTokenData: (state, action) => {

            const {

                accessToken,
                refreshToken,
                accessTokenExpirationTime,

            } = action.payload;

            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.accessTokenExpirationTime = accessTokenExpirationTime;

        },

    }
});

export const userActions = userSlice.actions;

export const {
    
    setTheme,
    setAccessToken,
    setRefreshToken,
    setUserTokenData,
    setAccessTokenExpirationTime

} = userActions;

export default userSlice.reducer;
