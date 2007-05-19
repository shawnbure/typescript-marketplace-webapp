
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from 'redux/slices/user';

import { NFTQueryAPI } from 'services/NFT';

export const rootReducer = combineReducers({
    user: userReducer,
    [NFTQueryAPI.reducerPath]: NFTQueryAPI.reducer
});

export type RootState = ReturnType<typeof rootReducer>;


