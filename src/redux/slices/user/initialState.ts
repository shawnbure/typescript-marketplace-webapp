
import { DARK } from 'constants/ui';
import { UserState } from './interfaces';

export const initialState: UserState = {
    theme: DARK,
    accessToken: '',
    refreshToken: '',
    accessTokenExpirationTime: 0,
};

export default initialState;