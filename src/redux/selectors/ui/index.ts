import { RootState } from 'redux/store/index';

export const selectShouldDisplayWalletSidebar: (state: RootState) => boolean = (state) => state.ui.shouldDisplayWalletSidebar;