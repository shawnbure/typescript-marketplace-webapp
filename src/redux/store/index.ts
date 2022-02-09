import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { reduxBatch } from '@manaflair/redux-batch';

import { rootReducer } from 'redux/slices';
import { txTemplateApi, tokensApi, authApi, oracleApi, collectionsApi, depositApi, royaltiesApi, searchApi,} from 'services/index';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            // .concat(logger)
            .concat(searchApi.middleware)
            .concat(authApi.middleware)
            .concat(oracleApi.middleware)
            .concat(tokensApi.middleware)
            .concat(depositApi.middleware)
            .concat(royaltiesApi.middleware)
            .concat(txTemplateApi.middleware)
            .concat(collectionsApi.middleware),
    devTools: false,
    // devTools: process.env.NODE_ENV !== 'production',
    enhancers: [reduxBatch],
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;