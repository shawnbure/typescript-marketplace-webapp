/* eslint-disable */
import classNames from "classnames";
import * as DappCore from "@elrondnetwork/dapp-core";

import {
  Route,
  Routes,
  useLocation,
  BrowserRouter as Router,
} from "react-router-dom";

import * as config from "configs/dappConfig";
import { useAppSelector } from "redux/store";

import { routePaths, routes } from "constants/router";
import { selectTheme } from "redux/selectors/user";
import { HomePage } from "containers/pages";
import { DARK, LIGHT } from "constants/ui";

import "reactjs-popup/dist/index.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AuthProtected from "containers/AuthProtected";
import { useEffect, useLayoutEffect, useState } from "react";
import { createVerifiedPayload, generateId } from "utils";
import { useGetAccessTokenMutation } from "services/auth";
import { useDispatch } from "react-redux";
import { setAccessToken, setJWT } from "redux/slices/user";
import Layout from "components/Layout";

import store  from "redux/store";


console.log(store.getState());

export const App: () => JSX.Element = () => {
  const networkConfig: any = config.network;
  const dispatch = useDispatch();
  const theme = useAppSelector(selectTheme);
  const isLightThemeSelected: boolean = theme === LIGHT;

  const generatedClasses: any = classNames("c-app", {
    "light-theme": isLightThemeSelected,
  });

  const {
    TransactionsToastList,
    SignTransactionsModals,
    NotificationModal,
    //DappCorePages: { UnlockPage }
  } = DappCore.DappUI;


  /*
  const [getAccessTokenRequestTrigger] = useGetAccessTokenMutation();

  const isUserLoggedIn = DappCore.getIsLoggedIn();

  useEffect(() => {
    console.log('isUserLoggedIn App', isUserLoggedIn);
    if (isUserLoggedIn) {

      DappCore.getAddress().then(address => setAddress(address));

    }
  
  }, []);

  useEffect(() => {

console.log("useEffect call JWT");

    if (address !== "") {
      getJWT();
    }
  }, [address]);


  const getJWT = async () => {

    //const signature = new URLSearchParams(location.search).get('signature');
    //const loginToken = localStorage.getItem("token") //TODO //new URLSearchParams(location.search).get('loginToken');

    console.log(address, "  address");
    

    const data = {};
    if (!address || !signature) {
      return;
    }

    const verifiedPayload: any = createVerifiedPayload(
      address,
      loginToken,
      signature,
      data
    );
    localStorage.removeItem("token"); //TODO
    const accessResult: any = await getAccessTokenRequestTrigger(
      verifiedPayload
    );

    if (!accessResult.data) {
      return;
    }

    const { data: jtwData } = accessResult;

    dispatch(setJWT(jtwData.data));
    localStorage.setItem("_e_", JSON.stringify(jtwData.data));
  };

*/

  useEffect(() => {
    let address: any = localStorage.getItem("address");

    if (address && address.length > 0) {
      address = JSON.parse(address);
      address && address.data
        ? window.pendo.initialize({ visitor: { id: address.data } })
        : null;
    }
  }, []);
  return (
    <div className={generatedClasses}>
        <DappCore.DappProvider customNetworkConfig={networkConfig} environment={config.network.id} completedTransactionsDelay={200} >
        <Layout>
            <TransactionsToastList />
            <NotificationModal />
            <SignTransactionsModals />
            <DappCore.AuthenticatedRoutesWrapper routes={routes} unlockRoute={routePaths.login} >
                    <Routes>
                      <Route path={routePaths.login} element={<HomePage />} />
                      {routes.map((route: any, index: number) => (
                        <Route
                          path={route.path}
                          key={"route-key-" + index}
                          element={<route.component />}
                        />
                      ))}
                      <Route path="*" element={<HomePage />} />
                    </Routes>
            </DappCore.AuthenticatedRoutesWrapper>     
          </Layout> 
        </DappCore.DappProvider>
    </div>
  );
};
