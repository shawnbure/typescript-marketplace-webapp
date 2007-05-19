import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        
        setTheme: (state, action) => {

            state.theme = action.payload;

        },
        
    }
});

export const userActions = userSlice.actions;
export const { setTheme } = userActions;
export default userSlice.reducer;
