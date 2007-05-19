import React, { useEffect } from 'react';
import * as Dapp from "@elrondnetwork/dapp";

import { Header, Footer } from 'components/index';

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
            <Header />
            <Dapp.Authenticate routes={[]} unlockRoute="/unlock">
                {children}
            </Dapp.Authenticate>
            <Footer />
        </>
    )
}

export default AuthWrapper;
