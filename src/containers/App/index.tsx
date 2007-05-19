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

                    </Switch>

                </AuthWrapper>

            </Dapp.Context >

        </div>
    );


};