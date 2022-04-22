/* eslint-disable */
import classNames from 'classnames';
import * as DappCore from "@elrondnetwork/dapp-core";
import * as DappCoreCom from "@elrondnetwork/core-components";

import { Route, Routes, useLocation, BrowserRouter as Router } from "react-router-dom";

import * as config from "configs/dappConfig";
import { useAppSelector } from 'redux/store';
import { routePaths, routes } from "constants/router";
import { selectTheme } from 'redux/selectors/user';
import { HomePage } from 'containers/pages';
import { DARK, LIGHT } from 'constants/ui';

import 'reactjs-popup/dist/index.css';
import '@fortawesome/fontawesome-svg-core/styles.css'
import AuthProtected from 'containers/AuthProtected';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createVerifiedPayload, generateId } from 'utils';
import { useGetAccessTokenMutation } from 'services/auth';
import { useDispatch } from 'react-redux';
import { setAccessToken, setJWT } from 'redux/slices/user';
import Layout from 'components/Layout';

export const App: () => JSX.Element = () => {

    const networkConfig: any = config.network;
    const dispatch = useDispatch();
    const theme = useAppSelector(selectTheme);
    const isLightThemeSelected: boolean = theme === LIGHT;

    //NEW FOR DAPPCORE
    const [loginToken, setLoginToken] = useState<string>(generateId(32));
    const [signature, setSignature] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    const generatedClasses: any = classNames('c-app', {
        'light-theme': isLightThemeSelected
    });

    const {
        TransactionsToastList,
        SignTransactionsModals,
        NotificationModal,
        //DappCorePages: { UnlockPage }
      } = DappCore.DappUI;

    const [getAccessTokenRequestTrigger,] = useGetAccessTokenMutation();

    const getJWT = async () => {

        //const address = new URLSearchParams(location.search).get('address');
        //const signature = new URLSearchParams(location.search).get('signature');
        //const loginToken = localStorage.getItem("token") //TODO //new URLSearchParams(location.search).get('loginToken');

        const objStorage = JSON.parse(localStorage.getItem("persist:dapp-core-store") || '{}');
        const objAccount = JSON.parse(objStorage.account || '{}')
        const walletAddress = objAccount.address;
        setAddress(walletAddress);
         
        const data = {};
        if (!address || !signature ) {
            return;
        }

        const verifiedPayload: any = createVerifiedPayload(address, loginToken, signature, data);
        localStorage.removeItem("token") //TODO
        const accessResult: any = await getAccessTokenRequestTrigger(verifiedPayload);

        console.log(accessResult + " accessResult");

        if (!accessResult.data) {
            return;
        }

        const { data: jtwData } = accessResult;

        dispatch(setJWT(jtwData.data));
        localStorage.setItem("_e_", JSON.stringify(jtwData.data));
    };


    useEffect(() => {
        if (location) {
            getJWT();

        }

    }, [location]);

    useEffect(() => {
        let address: any = localStorage.getItem('address')
    
        if(address && address.length > 0) {
            address = JSON.parse(address)
            address && address.data ? window.pendo.initialize({ visitor: { id: address.data } }) : null
        }
        
    }, [])

    return (

        <div className={generatedClasses}>

            <DappCore.DappProvider customNetworkConfig={networkConfig} environment={config.network.id} completedTransactionsDelay={200}>
            
                <Layout>
                    <TransactionsToastList />
                    <NotificationModal />
                    <SignTransactionsModals />
                    <Routes>

                        <Route
                        path={routePaths.login}
                        element={<HomePage />}
                        />
                        {routes.map((route: any, index: number) => (
                        <Route
                            path={route.path}
                            key={'route-key-' + index}
                            element={<route.component />}
                        />
                        ))}
                        <Route path='*' element={<HomePage />} />

                    </Routes>

                </Layout>

            </DappCore.DappProvider> 

        </div>
    );

};