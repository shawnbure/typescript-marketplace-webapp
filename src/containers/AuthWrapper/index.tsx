import React, { useEffect } from 'react';
import * as Dapp from "@elrondnetwork/dapp";
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from 'components/index';

export const AuthWrapper: (Props: { children: any }) => any = ({ children }) => {

    const dappLogout = Dapp.useLogout();
    const { loggedIn } = Dapp.useContext();
    const refreshAccount = Dapp.useRefreshAccount();

    useEffect(() => {

        if (loggedIn) {
            refreshAccount();
        }

    }, [loggedIn]);


    // useEffect(() => {


    //     return () => {

    //         dappLogout({ callbackUrl: `` });

    //     };

    // }, []);

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
