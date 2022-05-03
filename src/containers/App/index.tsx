/* eslint-disable */
import classNames from 'classnames';
import * as Dapp from "@elrondnetwork/dapp";
import { Route, Switch, useLocation, Redirect } from "react-router-dom";


import * as config from "configs/dappConfig";
import { useAppSelector } from 'redux/store';
import { routePaths } from "constants/router";
import { selectTheme } from 'redux/selectors/user';
import { AuthWrapper, ErdReqContainer } from "containers/index";
import { TokenPage, HomePage, CreatePage, SellTokenPage, ProfilePage, AccountSettingsPage, CollectionEditPage, CollectionPage, RoyaltiesPage, RankingsPage, RewardsPage, ConfirmationPage } from 'containers/pages';
import { DARK, LIGHT } from 'constants/ui';


import 'reactjs-popup/dist/index.css';
import '@fortawesome/fontawesome-svg-core/styles.css'
import AuthProtected from 'containers/AuthProtected';
import { useEffect, useLayoutEffect, useState } from 'react';
import { createVerifiedPayload, getCookie, isMobile, setCookie } from 'utils';
import { useGetAccessTokenMutation } from 'services/auth';
import { useDispatch } from 'react-redux';
import { setAccessToken, setJWT } from 'redux/slices/user';
import CreateCollectionPage from 'containers/pages/CreateCollectionPage';
import RegisterCollectionPage from 'containers/pages/RegisterCollectionPage';
import StatsPage from 'containers/pages/StatsPage';
import ActivityPage from 'containers/pages/ActivityPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as faIcons from "@fortawesome/free-regular-svg-icons";
import { Helmet } from 'react-helmet';



// import ReactGA from 'react-ga';
// ReactGA.initialize('G-298PT9611Z');
// ReactGA.pageview(window.location.pathname + window.location.search);


export const App: () => JSX.Element = () => {

    let [showSuggestionMessage, setShowSuggestionMessage] = useState(true)
    const dispatch = useDispatch();
    const theme = useAppSelector(selectTheme);
    const isLightThemeSelected: boolean = theme === LIGHT;


    const generatedClasses: any = classNames('c-app', {
        'light-theme': isLightThemeSelected
    });

    const location = useLocation();
    const { pathname } = location;

    const [getAccessTokenRequestTrigger,] = useGetAccessTokenMutation();

    const getJWT = async () => {

        const address = new URLSearchParams(location.search).get('address');
        const signature = new URLSearchParams(location.search).get('signature');
        const loginToken = localStorage.getItem("token")//TODO //new URLSearchParams(location.search).get('loginToken');
        const data = {};
        if (!address || !signature ) {
            return;
        }

        const verifiedPayload: any = createVerifiedPayload(address, loginToken, signature, data);
        localStorage.removeItem("token") //TODO
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

    useEffect(() => {
        let address: any = localStorage.getItem('address')
    
        if(address && address.length > 0) {
            address = JSON.parse(address)
            address && address.data ? window.pendo.initialize({ visitor: { id: address.data } }) : null
        }
        
    }, [])

    let suggestionBanner = () => {
        if(getCookie('useDesktopVersionSuggested') != 'true') {
            return (
                <div style={showSuggestionMessage ? {display: 'flex'} : {display: 'none'}} className='suggestionMessage'>
                    <span>Welcome to Youbei!</span>
                    <span>To get the best experience, we recommend using the <b>Desktop</b> version</span>
                    <div>
                        <button
                          onClick={() => {
                              setCookie('useDesktopVersionSuggested', 'true', 'Thu, 19 Jan 2100 12:00:00 UTC')
                              setShowSuggestionMessage(false)
                            }}
                          className="c-button c-button--primary"
                        >
                          Okay
                        </button>
                    </div>
                </div>
            )
        }
    }

    return (

        <div className={generatedClasses}>

            {
                isMobile() ?  suggestionBanner() : null
            }

            <Helmet>
                <title>Youbei</title>
                <meta property="og:title" content='Youbei' />
            </Helmet>

            <Dapp.Context config={config}>

                <AuthWrapper>

                    <Switch>

                        <Route path={routePaths.home} exact={true} >

                            <HomePage />

                        </Route>

                        <Route path={routePaths.rankings} exact={true} >

                            <RankingsPage />

                        </Route>


                        <Route path={routePaths.rewards} exact={true} >

                            <RewardsPage />

                        </Route>

                        
                        {/* <Route path={'/maiar-login'} exact={true} >

                            <div className="p-maiar-login">
                               
                            </div>
                        </Route> */}

                        <Route path={routePaths.sellToken} exact={true} >

                            <AuthProtected>
                                <SellTokenPage />
                            </AuthProtected>

                        </Route>

                        <Route path={routePaths.confirmation} exact={true} >
                            <AuthProtected>
                                <ConfirmationPage />
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

                        <Route path={routePaths.stats} exact={true} >

                            <StatsPage />

                        </Route>

                        <Route path={routePaths.activity} exact={true} >

                            <ActivityPage />

                        </Route>

                        <Route path={routePaths.royalties} exact={true} >

                            <AuthProtected>
                                <RoyaltiesPage />
                            </AuthProtected>

                        </Route>


                        <Route path={"/pigselated"} exact={true} >

                            <Redirect to={"/collection/HELIOS2022-1ea0f2"} />

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