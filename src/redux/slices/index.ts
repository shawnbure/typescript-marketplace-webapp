
import { combineReducers } from '@reduxjs/toolkit';

import uiReducer from 'redux/slices/ui';
import userReducer from 'redux/slices/user';

import { txTemplateApi, tokensApi, authApi, oracleApi, collectionsApi, accountsApi, depositApi, royaltiesApi} from 'services/index';

export const rootReducer = combineReducers({
    ui: uiReducer,
    user: userReducer,
    [authApi.reducerPath]: authApi.reducer,
    [oracleApi.reducerPath]: oracleApi.reducer,
    [tokensApi.reducerPath]: tokensApi.reducer,
    [depositApi.reducerPath]: depositApi.reducer,
    [accountsApi.reducerPath]: accountsApi.reducer,
    [royaltiesApi.reducerPath]: royaltiesApi.reducer,
    [txTemplateApi.reducerPath]: txTemplateApi.reducer,
    [collectionsApi.reducerPath]: collectionsApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;


