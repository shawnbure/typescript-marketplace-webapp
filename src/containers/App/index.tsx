import classNames from 'classnames';
import * as Dapp from "@elrondnetwork/dapp";
import { Route, Switch, useLocation } from "react-router-dom";


import * as config from "configs/dappConfig";
import { useAppSelector } from 'redux/store';
import { routePaths } from "constants/router";
import { selectTheme } from 'redux/selectors/user';
import { AuthWrapper, ErdReqContainer } from "containers/index";
import { TokenPage, HomePage, CreatePage, SellTokenPage, ProfilePage, AccountSettingsPage, CollectionEditPage, CollectionPage } from 'containers/pages';
import { DARK, LIGHT } from 'constants/ui';


import 'reactjs-popup/dist/index.css';
import '@fortawesome/fontawesome-svg-core/styles.css'
import AuthProtected from 'containers/AuthProtected';
import { useEffect, useLayoutEffect } from 'react';
import { createVerifiedPayload } from 'utils';
import { useGetAccessTokenMutation } from 'services/auth';
import { useDispatch } from 'react-redux';
import { setAccessToken, setJWT } from 'redux/slices/user';


export const App: () => JSX.Element = () => {


    const dispatch = useDispatch();
    const theme = useAppSelector(selectTheme);
    const isLightThemeSelected: boolean = theme === LIGHT;
    const generatedClasses: any = classNames('c-app', { 'light-theme': isLightThemeSelected });

    const location = useLocation();

    const [ getAccessTokenRequestTrigger, ] = useGetAccessTokenMutation();


    // useEffect(() => {


    //     console.log(123);

    //     return () => {

    //         window.scrollTo(0, 0);

    //     };

    // }, [pathname]);


    const getJWT = async () => {


        const address = new URLSearchParams(location.search).get('address');
        const signature = new URLSearchParams(location.search).get('signature');
        const loginToken = new URLSearchParams(location.search).get('loginToken');
        const data = {};

        if (!address || !signature || !loginToken) {
            return;
        }

        const verifiedPayload: any = createVerifiedPayload(address, loginToken, signature, data);
        const accessResult: any = await getAccessTokenRequestTrigger(verifiedPayload);

        if(!accessResult.data) {
            return;
        }
        
        const jtwData = accessResult.data
        
        dispatch(setJWT(jtwData.data));

    }


    useEffect(() => {

        if(location) {
            getJWT();
        }


    }, [location]);

    return (

        <div className={generatedClasses}>

            <Dapp.Context config={config}>

                <AuthWrapper>

                    <Switch>

                        <Route path={routePaths.home} exact={true} >

                            <HomePage />

                        </Route>


                        <Route path={routePaths.token} exact={true} >

                            <TokenPage />

                        </Route>

                        <Route path={routePaths.create} exact={true} >

                            <CreatePage />

                        </Route>

                        <Route path={routePaths.collection} exact={true} >

                            <CollectionPage />

                        </Route>

                        <Route path={routePaths.sellToken} exact={true} >

                            <AuthProtected>
                                <SellTokenPage />
                            </AuthProtected>

                        </Route>

                        <Route path={routePaths.account} exact={true} >

                            <AuthProtected>
                                <ProfilePage />
                            </AuthProtected>

                        </Route>

                        <Route path={routePaths.accountSettings} exact={true} >

                            <AuthProtected>
                                <AccountSettingsPage />
                            </AuthProtected>

                        </Route>


                        <Route path={routePaths.collectionEdit} exact={true} >

                            <AuthProtected>
                                <CollectionEditPage />
                            </AuthProtected>

                        </Route>

                    </Switch>

                </AuthWrapper>

            </Dapp.Context >

        </div>
    );


};