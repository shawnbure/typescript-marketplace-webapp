import { RootState } from 'redux/store/index';

export const selectTheme: (state: RootState) => string = (state) => state.user.theme;
