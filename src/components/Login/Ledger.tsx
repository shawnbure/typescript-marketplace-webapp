import React from "react";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers";
import { HWProvider } from "@elrondnetwork/erdjs-hw-provider";
import { useDispatch } from 'react-redux';

const LedgerLogin = () => {
  const dispatch = useDispatch();

  const handleOnClick = () => {
    const httpProvider = new ProxyNetworkProvider("");
    const hwWalletP = new HWProvider();

    dispatch({type: "loading", loading: true});
    hwWalletP.init()
      .then((success: any) => {
        if (!success) {
          dispatch({type: "loading", loading: false});
          console.warn("could not initialise ledger app, make sure Elrond app is open");
          return;
        }

        hwWalletP.login()
          .then(address => {
            // Set this provider as default inside the app
            dispatch({type: 'setProvider', provider: hwWalletP});
            dispatch({type: "login", address});
          }).catch((err: any) => {
            dispatch({type: "loading", loading: false});
            console.warn(err);
        });

      }).catch((err: any) => {
        dispatch({type: "loading", loading: false});
        console.warn("could not initialise ledger app, make sure Elrond app is open", err)
    })
  };
  return (
    <div className="col-12 col-md-8 col-lg-5 mx-auto login-card__container">
      <div className="card shadow-sm rounded p-4 border-0">
        <div className="card-body text-center">
          <h2 className="mb-3">Ledger</h2>

          <p className="mb-3">
            Secure Ledger login.
          </p>

          <button onClick={() => handleOnClick()} className="btn btn-primary mt-3">
            Connect Ledger
          </button>
        </div>
      </div>
    </div>
  )
};

export default LedgerLogin;