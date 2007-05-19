import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

export const uiSlice = createSlice({
    name: 'ui',
    initialState: initialState,
    reducers: {

        toggleShouldDisplayWalletSidebar: (state) => {

            if (!state.shouldDisplayWalletSidebar === true) {

                document.body.classList.add('overflow-hidden');
            
            } else {

                document.body.classList.remove('overflow-hidden');
            
            }

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
