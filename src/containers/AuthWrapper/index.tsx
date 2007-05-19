import React, { useEffect } from 'react';
import * as Dapp from "@elrondnetwork/dapp";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

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
            
            <Dapp.Authenticate routes={[]} unlockRoute="/login">
                {children}
            </Dapp.Authenticate>

            <ToastContainer
                theme={'dark'}
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />
        </>
    )
}

export default AuthWrapper;
