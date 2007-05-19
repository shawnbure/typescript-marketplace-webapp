import classNames from 'classnames';
import * as Dapp from "@elrondnetwork/dapp";
import { Route, Switch } from "react-router-dom";

import * as config from "configs/dappConfig";
import { useAppSelector } from 'redux/store';
import { routePaths } from "constants/router";
import { selectTheme } from 'redux/selectors/user';
import { AuthWrapper, ErdReqContainer } from "containers/index";
import { TokenPage, HomePage} from 'containers/pages';
import { DARK, LIGHT } from 'constants/ui';


export const App: () => JSX.Element = () => {

    const theme = useAppSelector(selectTheme);
    const isLightThemeSelected: boolean = theme === LIGHT;
    const generatedClasses: any = classNames('c-app', { 'light-theme': isLightThemeSelected });

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

                        <Route path={routePaths.login} exact={true}>


                            <ErdReqContainer>

                                <Dapp.Pages.Unlock
                                    title={'Connect your wallet'}
                                    ledgerRoute={routePaths.ledger}
                                    callbackRoute={routePaths.home}
                                    lead="Connect with one of our available wallet providers"
                                    walletConnectRoute={routePaths.walletconnect}
                                />
                                
                            </ErdReqContainer>

                        </Route>

                        <Route path={routePaths.walletconnect} exact={true}>

                            <Dapp.Pages.WalletConnect
                                title="Maiar Login"
                                logoutRoute={routePaths.home}
                                callbackRoute={routePaths.home}
                                lead="Scan the QR code using Maiar"
                            />

                        </Route>

                        <Route path={routePaths.ledger} exact={true}>

                            <Dapp.Pages.Ledger callbackRoute={routePaths.home} />

                        </Route>

                    </Switch>

                </AuthWrapper>

            </Dapp.Context >

        </div>
    );


};