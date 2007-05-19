/* eslint-disable */ 
import classNames from 'classnames';
import * as Dapp from "@elrondnetwork/dapp";
import { Route, Switch, useLocation } from "react-router-dom";


import * as config from "configs/dappConfig";
import { useAppSelector } from 'redux/store';
import { routePaths } from "constants/router";
import { selectTheme } from 'redux/selectors/user';
import { AuthWrapper, ErdReqContainer } from "containers/index";
import { TokenPage, HomePage, CreatePage, SellTokenPage, ProfilePage, AccountSettingsPage, CollectionEditPage, CollectionPage, RoyaltiesPage } from 'containers/pages';
import { DARK, LIGHT } from 'constants/ui';


import 'reactjs-popup/dist/index.css';
import '@fortawesome/fontawesome-svg-core/styles.css'
import AuthProtected from 'containers/AuthProtected';
import { useEffect, useLayoutEffect } from 'react';
import { createVerifiedPayload } from 'utils';
import { useGetAccessTokenMutation } from 'services/auth';
import { useDispatch } from 'react-redux';
import { setAccessToken, setJWT } from 'redux/slices/user';
import CreateCollectionPage from 'containers/pages/CreateCollectionPage';
import RegisterCollectionPage from 'containers/pages/RegisterCollectionPage';


import ReactGA from 'react-ga';
ReactGA.initialize('G-298PT9611Z');
ReactGA.pageview(window.location.pathname + window.location.search);


export const App: () => JSX.Element = () => {


    const dispatch = useDispatch();
    const theme = useAppSelector(selectTheme);
    const isLightThemeSelected: boolean = theme === LIGHT;
    const generatedClasses: any = classNames('c-app', { 'light-theme': isLightThemeSelected });

    const location = useLocation();
    const { pathname } = location;

    const [getAccessTokenRequestTrigger,] = useGetAccessTokenMutation();

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





    return (

        <div className={generatedClasses}>

            <div style={{ zIndex: 10000 }} className="bg-gray-800 fixed h-full lg:hidden p-20 text- text-3xl text-center text-white w-full">
                Sorry for the inconvenience, this site is not yet optimized for mobile devices. We will bring you this functionality on our next update. Until then please use the website on your desktop.
            </div>

            <Dapp.Context config={config}>

                <AuthWrapper>

                    <Switch>

                        <Route path={routePaths.home} exact={true} >

                            <HomePage />

                        </Route>

                        <Route path={routePaths.sellToken} exact={true} >

                            <AuthProtected>
                                <SellTokenPage />
                            </AuthProtected>

                        </Route>

                        <Route path={[routePaths.token, routePaths.unlistedToken]} exact={true} >

                            <TokenPage />

                        </Route>

                        <Route path={routePaths.collectionRegister} exact={true} >

                            <AuthProtected>
                                <RegisterCollectionPage />
                            </AuthProtected>

                        </Route>


                        <Route path={routePaths.create} exact={true} >

                            <CreatePage />

                        </Route>

                        <Route path={routePaths.collectionCreate} exact={true} >

                            <AuthProtected>
                                <CreateCollectionPage />
                            </AuthProtected>

                        </Route>

                        <Route path={routePaths.collection} exact={true} >

                            <CollectionPage />

                        </Route>

                        <Route path={[routePaths.account, routePaths.profile]} exact={true} >

                            <ProfilePage />

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

                        <Route path={routePaths.royalties} exact={true} >

                            <AuthProtected>
                                <RoyaltiesPage />
                            </AuthProtected>

                        </Route>



                        <Route path="*">
                            <HomePage />
                        </Route>

                    </Switch>

                </AuthWrapper>

            </Dapp.Context >

        </div>
    );


};