import { Route, Redirect } from "react-router-dom";
import * as Dapp from "@elrondnetwork/dapp";
import { routePaths } from "constants/router";

export const AuthProtected: (Props: any) => any = ({ children }) => {

    const {
        loggedIn,
    } = Dapp.useContext();

    if (!loggedIn) {
        return (
            <Redirect to={routePaths.home} />
        );
    }

    return (
        <>{children}</>
    )
};

export default AuthProtected;
