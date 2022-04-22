import React, { useEffect } from 'react';
import * as DappCore from "@elrondnetwork/dapp-core";
import { AuthenticatedRoutesWrapper} from "@elrondnetwork/dapp-core";
import { routePaths, routes } from 'constants/router';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { Navbar } from 'components/index';
import { useAppDispatch } from 'redux/store';
import { setAccessToken, setJWT } from 'redux/slices/user';

import { toast } from "react-toastify";


export const AuthWrapper: (Props: { children: any }) => any = ({ children }) => {

    const dispatch = useAppDispatch();

    //const dappLogout = Dapp.useLogout(); 
    //const { loggedIn } = Dapp.useContext();
    const loggedIn = DappCore.getIsLoggedIn();
    //const refreshAccount = Dapp.useRefreshAccount();

    useEffect(() => {

        if (localStorage.address && localStorage._e_) {

            const jwtData = JSON.parse(localStorage._e_);
            const loggedInfo = JSON.parse(localStorage.address);

            // if(loggedInfo.data === ) {

            // }

            dispatch(setJWT(jwtData));

        };


    }, [])

    useEffect(() => {

        if (!loggedIn) {

            localStorage.removeItem("_e_");

            return;
        };

        //refreshAccount();
        DappCore.refreshAccount();

    }, [loggedIn]);


    useEffect(() => {


        return () => {

            // dappLogout({ callbackUrl: `` });
            DappCore.logout('');

        };

    }, []);

    return (
        <>
    
        {/* 
            <Dapp.Authenticate routes={[]} unlockRoute="/login">
                <Navbar />
                {children}
            </Dapp.Authenticate>
        */}
            <AuthenticatedRoutesWrapper routes={routes} unlockRoute={routePaths.login}>
                <Navbar />
                {children}
            </AuthenticatedRoutesWrapper>

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
