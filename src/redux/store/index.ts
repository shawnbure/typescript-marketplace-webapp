import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { reduxBatch } from '@manaflair/redux-batch';
import logger from 'redux-logger';

import { rootReducer } from 'redux/slices';
import { NFTQueryAPI } from 'services/NFT';

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(logger)
            .concat(NFTQueryAPI.middleware),
    devTools: process.env.NODE_ENV !== 'production',
    enhancers: [reduxBatch],
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;