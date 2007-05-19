
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from 'redux/slices/user';

import { compiler } from 'services/resources';

export const rootReducer = combineReducers({
    user: userReducer,
    [compiler.reducerPath]: compiler.reducer
});

export type RootState = ReturnType<typeof rootReducer>;


