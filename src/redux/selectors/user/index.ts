import { RootState } from 'redux/store/index';

export const selectTheme: (state: RootState) => string = (state) => state.user.theme;
export const selectAccessToken: (state: RootState) => string = (state) => state.user.accessToken;
export const selectRefreshToken: (state: RootState) => string = (state) => state.user.refreshToken;
export const selectAccessTokenExpirationTime: (state: RootState) => number = (state) => state.user.accessTokenExpirationTime;