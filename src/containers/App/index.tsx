import classNames from 'classnames';
import * as Dapp from "@elrondnetwork/dapp";
import { Route, Switch } from "react-router-dom";

import * as config from "configs/dappConfig";
import { useAppSelector } from 'redux/store';
import { routePaths } from "constants/router";
import { selectTheme } from 'redux/selectors/user';
import { AuthWrapper} from "containers/index";
import { HomePage } from 'containers/pages';
import { DARK } from 'constants/ui';


export const App: () => JSX.Element = () => {

    const theme = useAppSelector(selectTheme);
    const isDarkThemeSelected: boolean = theme === DARK;
    const generatedClasses: any = classNames('c-app', { 'dark-theme': isDarkThemeSelected });

    return (

        <div className={generatedClasses}>

            <Dapp.Context config={config}>

                <AuthWrapper>

                    <Switch>

                        <Route path={routePaths.home} exact={true} >

                            <HomePage />

                        </Route>

                        <Route path={routePaths.unlock} exact={true}>

                            <Dapp.Pages.Unlock
                                title={config.dAppName}
                                ledgerRoute={routePaths.ledger}
                                callbackRoute={routePaths.home}
                                lead="Please select your login method:"
                                walletConnectRoute={routePaths.walletconnect}
                            />

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