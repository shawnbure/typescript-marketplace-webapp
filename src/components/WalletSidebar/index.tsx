import { useEffect } from "react";
import { routePaths } from "constants/router";
import { Link, useHistory, useLocation } from "react-router-dom";
import * as Dapp from "@elrondnetwork/dapp";
import { useAppDispatch } from "redux/store";
import { setUserTokenData } from "redux/slices/user";
import { useGetEgldPriceQuery } from "services/oracle";


import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { shorterAddress } from "utils";

export const WalletSidebar: (Props: { overlayClickCallback?: Function }) => any = ({
    overlayClickCallback
}) => {

    const randomToken = "44acad666d67ce76a1b44e351b50e0bc";
    
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const dappLogout = Dapp.useLogout();

    const {
        account,
        address: walletAddress,
        loggedIn: isUserLoggedIn, } = Dapp.useContext();

    const webWalletLogin = Dapp.useWebWalletLogin({
        callbackRoute: pathname,
        token: randomToken,
    });

    const {

        data: egldPriceData,
        isError: isErrorEgldPriceQuery,
        isLoading: isLoadingEgldPriceQuery,
        isSuccess: isSuccessEgldPriceQuery,

    } = useGetEgldPriceQuery();

    const handleOverlayClick = () => {

        overlayClickCallback?.();

    }

    const handleLogOut = (e: React.MouseEvent) => {

        e.preventDefault();

        overlayClickCallback?.();

        dappLogout({ callbackUrl: `${window.location.origin}/` });

        history.push(pathname);

    };


    if (!isUserLoggedIn) {
        return (

            <aside className="c-wallet-sidebar">
                <div onClick={handleOverlayClick} className="c-wallet-sidebar_overlay"></div>
                <div className="c-wallet-sidebar_container">

                    <button onClick={(e: any) => { webWalletLogin() }} className="c-button c-button--primary" >
                        Login
                    </button>

                </div>
            </aside>
        );
    }


    const { balance } = account;
    const egldPriceString = egldPriceData?.data || 0;
    const shortWalletAddress: string = shorterAddress(walletAddress, 7, 4);
    const egldBalance = (parseFloat(balance) / 1000000000000000000).toFixed(3);
    const usdBalance = (Number(egldBalance) * parseFloat(egldPriceString)).toFixed(2);

    const deposit = (0 / 1000000000000000000).toFixed(3);
    const usdDeposit = (Number(deposit) * parseFloat(egldPriceString)).toFixed(2);

    return (

        <aside className="c-wallet-sidebar">

            <div onClick={handleOverlayClick} className="c-wallet-sidebar_overlay"></div>

            <div className="c-wallet-sidebar_container">


                <p className="flex justify-around my-3">

                    <span className="u-text-theme-gray-light">
                        My wallet
                    </span>

                    <span className="u-text-theme-gray-mid u-text-small">
                        <a href={`https://explorer.elrond.com/accounts/${walletAddress}`} target="_blank">
                            {shortWalletAddress}
                        </a>
                    </span>

                </p>


                <div className="border m-10 mb-0 p-5 rounded-t-3xl">
                    <p className="u-text-theme-gray-mid u-text-small">
                        Total balance
                    </p>
                    <p className="text-3xl u-text-bold">
                        ${usdBalance} USD
                    </p>
                    <p className="u-text-bold u-text-theme-gray-mid">
                        {egldBalance} EGLD
                    </p>

                </div>

                <div className="border m-10 mt-0 p-5 rounded-b-3xl">
                    <p className="u-text-theme-gray-mid u-text-small">
                        Deposit
                    </p>
                    <p className="text-3xl u-text-bold">
                        ${usdDeposit} USD
                    </p>
                    <p className="u-text-bold u-text-theme-gray-mid">
                        {deposit} EGLD
                    </p>

                </div>

                <div className="mb-3">

                    <Link to={routePaths.account} className="c-button c-button--secondary" >
                        <div onClick={() => { overlayClickCallback?.() }} className="inline-flex">

                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link mr-4" icon={faIcons.faUserCircle} />
                            <span>
                                Profile
                            </span>
                        </div>
                    </Link>

                </div>

                <div>
                    <button className="c-button c-button--secondary bg-transparent" onClick={handleLogOut}>Logout</button>
                </div>
            </div>
        </aside>
    );
};

export default WalletSidebar;
