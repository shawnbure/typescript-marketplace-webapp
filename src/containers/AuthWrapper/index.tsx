import React, { useEffect } from 'react';
import * as Dapp from "@elrondnetwork/dapp";

import { Navbar } from 'components/index';

export const AuthWrapper: (Props: { children: any }) => any = ({ children }) => {

    const { loggedIn } = Dapp.useContext();
    const refreshAccount = Dapp.useRefreshAccount();

    React.useEffect(() => {
        if (loggedIn) {
            refreshAccount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loggedIn]);

    return (
        <>
            <Navbar />
            <Dapp.Authenticate routes={[]} unlockRoute="/unlock">
                {children}
            </Dapp.Authenticate>
        </>
    )
}

export default AuthWrapper;
