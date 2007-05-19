
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from 'redux/slices/user';

import { txTemplateApi, tokensApi } from 'services/index';

export const rootReducer = combineReducers({
    user: userReducer,
    [tokensApi.reducerPath]: tokensApi.reducer,
    [txTemplateApi.reducerPath]: txTemplateApi.reducer
});

export type RootState = ReturnType<typeof rootReducer>;


