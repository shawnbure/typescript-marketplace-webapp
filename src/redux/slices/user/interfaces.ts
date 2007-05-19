import { DARK, LIGHT } from "constants/ui";
export interface UserState {
    accessToken: string;
    refreshToken: string;
    accessTokenExpirationTime: number;
    theme: typeof DARK | typeof LIGHT;
}