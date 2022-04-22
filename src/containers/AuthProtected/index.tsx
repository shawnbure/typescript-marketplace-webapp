import { Route, Navigate } from "react-router-dom";
import * as DappCore from "@elrondnetwork/dapp-core";
import { routePaths } from "constants/router";

export const AuthProtected: (Props: any) => any = ({ children }) => {

    /*
    const {
        loggedIn,
    } = Dapp.useContext();
    */
    const loggedIn = DappCore.getIsLoggedIn();

    if (!loggedIn) {
        return (
                <Navigate replace to={routePaths.home} />
        );
    }

    return (
        <>{children}</>
    )
};

export default AuthProtected;
