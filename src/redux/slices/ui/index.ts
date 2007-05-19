import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: initialState,
    reducers: {
        
        toggleShouldDisplayWalletSidebar: (state) => {
            
            state.shouldDisplayWalletSidebar = !state.shouldDisplayWalletSidebar;

        },

        setShouldDisplayWalletSidebar: (state, action) => {

            state.shouldDisplayWalletSidebar = action.payload;

        },

    }
});

export const uiActions = uiSlice.actions;

export const {
    
    setShouldDisplayWalletSidebar,
    toggleShouldDisplayWalletSidebar,
    
} = uiActions;

export default uiSlice.reducer;
