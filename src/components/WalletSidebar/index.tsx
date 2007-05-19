import { useEffect, useState } from "react";
import { routePaths } from "constants/router";
import { Link, useHistory, useLocation } from "react-router-dom";
import * as Dapp from "@elrondnetwork/dapp";
import { useAppDispatch } from "redux/store";
import { setUserTokenData } from "redux/slices/user";
import { useGetEgldPriceQuery } from "services/oracle";


import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { generateId, shorterAddress } from "utils";
import { useGetAddDepositEgldTemplateMutation, useGetWithdrawDepositTemplateMutation } from "services/tx-template";
import { prepareTransaction } from "utils/transactions";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import { useGetDepositTemplateMutation } from "services/deposit";
import Collapsible from "react-collapsible";

export const WalletSidebar: (Props: { overlayClickCallback?: Function }) => any = ({
    overlayClickCallback
}) => {

    const randomToken = generateId(32);

    const history = useHistory();
    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const dappLogout = Dapp.useLogout();

    const [getDepositTemplateTrigger, {
        data: userDepositData,
    }] = useGetDepositTemplateMutation();
    const [getAddDepositEgldTemplateTrigger] = useGetAddDepositEgldTemplateMutation();
    const [getWithdrawDepositTemplateTrigger] = useGetWithdrawDepositTemplateMutation();

    const [addDepositAmount, setAddDepositAmount] = useState<number | undefined>();
    const [withdrawDepositAmount, setWithdrawDepositAmount] = useState<number | undefined>();


    const sendTransaction = Dapp.useSendTransaction();

    const {
        account,
        address: userWalletAddress,
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

    const signTemplateTransaction = async (settings: any) => {

        const { getTemplateTrigger, getTemplateData, succesCallbackRoute } = settings;

        const response: any = await getTemplateTrigger({ ...getTemplateData });

        if (response.error) {

            const { status, data: { error } } = response.error;

            toast.error(`${status} | ${error}`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;

        }

        const { data: txData } = response.data;

        const unconsumedTransaction = prepareTransaction(txData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: succesCallbackRoute
        });

    };

    const handleAddDeposit = async () => {

        const getTemplateData = { userWalletAddress: userWalletAddress, amount: addDepositAmount };

        signTemplateTransaction({

            succesCallbackRoute: pathname,
            getTemplateData: getTemplateData,
            getTemplateTrigger: getAddDepositEgldTemplateTrigger,

        });


    };


    const handleWithdrawDeposit = async () => {

        const getTemplateData = { userWalletAddress: userWalletAddress, amount: withdrawDepositAmount };

        signTemplateTransaction({

            succesCallbackRoute: pathname,
            getTemplateData: getTemplateData,
            getTemplateTrigger: getWithdrawDepositTemplateTrigger,

        });


    };


    useEffect(() => {

        if (!isUserLoggedIn) {
            return;
        }

        getDepositTemplateTrigger({ userWalletAddress });

    }, [isUserLoggedIn])

    if (!isUserLoggedIn) {
        return (

            <aside className="c-wallet-sidebar">
                <div onClick={handleOverlayClick} className="c-wallet-sidebar_overlay"></div>
                <div className="c-wallet-sidebar_container">

                   <div className="mt-10">
                   <button onClick={(e: any) => { webWalletLogin() }} className="c-button c-button--primary " >
                        Login
                    </button>

                   </div>
                </div>
            </aside>
        );
    };

    const { balance } = account;
    const egldPriceString = egldPriceData?.data || 0;
    const shortWalletAddress: string = shorterAddress(userWalletAddress, 7, 4);

    const egldBalance = (parseFloat(balance) / 1000000000000000000).toFixed(3);
    const usdBalance = (Number(egldBalance) * parseFloat(egldPriceString)).toFixed(2);

    const deposit = userDepositData?.data || 0;
    const usdDeposit = (deposit * parseFloat(egldPriceString)).toFixed(2);

    return (

        <aside className="c-wallet-sidebar">

            <div onClick={handleOverlayClick} className="c-wallet-sidebar_overlay"></div>

            <div className="c-wallet-sidebar_container">


                <p className="flex justify-around">

                    <span className="u-text-theme-gray-light text-sm">
                        My wallet
                    </span>

                    <span className="text-gray-400 text-sm">
                        <a href={`https://explorer.elrond.com/accounts/${userWalletAddress}`} target="_blank">
                            {shortWalletAddress}
                        </a>
                    </span>

                </p>


                <div style={{ border: "1px solid #151b22" }} className="m-10 mb-0 mt-4 p-1 rounded-t-3xl">
                    <p className="text-gray-400 text-sm">
                        Total balance
                    </p>
                    <p className="text-xl u-text-bold">
                        ${usdBalance} USD
                    </p>
                    <p className="u-text-bold text-sm text-gray-400">
                        {egldBalance} EGLD
                    </p>

                </div>

                <div style={{ border: "1px solid #151b22" }} className="m-10 mt-0 mb-4 p-1 rounded-b-3xl">

                    <p className="text-gray-400 text-sm u-text-small">
                        Deposit
                    </p>
                    <p className="text-xl u-text-bold">
                        ${usdDeposit} USD
                    </p>
                    <p className="u-text-bold text-sm text-gray-400">
                        {deposit} EGLD
                    </p>

                </div>



                <div className="mb-3">

                    <Link to={routePaths.account} className="c-button c-button--primary" >
                        <div onClick={() => { overlayClickCallback?.() }} className="inline-flex">

                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link mr-4" icon={faIcons.faUserCircle} />
                            <span>
                                Profile
                            </span>
                        </div>
                    </Link>

                </div>

                <div className="mb-5">

                    <Popup
                        modal
                        className="c-modal_container"
                        trigger={
                            <button className="c-button  c-button--secondary u-margin-top-spacing-2">
                                <span className="u-padding-right-spacing-2">
                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link mr-4" icon={faIcons.faPiggyBank} />
                                </span>
                                <span>
                                    Deposit
                                </span>
                            </button>
                        }
                    >
                        {(close: any) => (
                            <div className="c-modal rounded-2xl">

                                <div className="text-right px-10">
                                    <button className="c-modal_close text-4xl" onClick={close}>
                                        &times;
                                    </button>
                                </div>

                                <div className="c-modal_header text-2xl u-text-bold ">
                                    <div className="">

                                        <Collapsible
                                            transitionTime={50}
                                            open={false}
                                            className="c-accordion"
                                            classParentString="border-0"
                                            trigger={

                                                <div className="">
                                                    <FontAwesomeIcon style={{ width: 20, height: 20 }} className="c-navbar_icon-link mb-2" icon={faIcons.faInfoCircle} />
                                                </div>

                                            }>

                                            <div className="bg-transparent mb-4" >


                                                <p className="text-sm">
                                                    Your deposit inside the marketplace.
                                                </p>

                                                <p className="text-sm">

                                                    Having a deposit allows for making Offers and Bids.
                                                </p>

                                            </div>

                                        </Collapsible>

                                        <p className="text-gray-400  text-xl">
                                            Current deposit
                                        </p>
                                        <p className="text-3xl u-text-bold">
                                            ${usdDeposit} USD
                                        </p>
                                        <p className="u-text-bold text-xl text-gray-400">
                                            {deposit} EGLD
                                        </p>

                                    </div>
                                </div>
                                <div className="c-modal_content">

                                    <div className="px-10 pt-8">


                                        <div className="grid grid-cols-12 text-center">

                                            <div className="col-span-5">

                                                <Collapsible
                                                    transitionTime={50}
                                                    open={false}
                                                    className="c-accordion"
                                                    classParentString="border-0"
                                                    trigger={

                                                        <div className="">
                                                            <FontAwesomeIcon style={{ width: 20, height: 20 }} className="c-navbar_icon-link mb-2" icon={faIcons.faInfoCircle} />
                                                        </div>

                                                    }>


                                                    <div className="bg-transparent mb-4  u-text-bold" >


                                                        <p className="text-sm">
                                                            Add EGLD to your deposit. Be mindful of depositing MAX.
                                                            Keep some dust in your wallet, so you can execute further transactions.
                                                        </p>


                                                    </div>


                                                </Collapsible>

                                                <div className="align-items-center flex justify-content-center mb-8">
                                                    <input placeholder={"Amount to deposit (EGLD)"} onChange={(e: any) => { setAddDepositAmount(e.target.value) }} value={addDepositAmount} type="number" className="rounded-l-lg text-center bg-opacity-10  bg-white border-1 border-gray-400 p-2 placeholder-opacity-10  text-white w-full" />
                                                    <button onClick={() => { setAddDepositAmount(Number(egldBalance)); }} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-r-lg  border-1 border-gray-400">
                                                        Max
                                                    </button>
                                                </div>

                                                <button className="c-button c-button--secondary" onClick={handleAddDeposit}>
                                                    <span>
                                                        Add deposit
                                                    </span>
                                                </button>

                                            </div>

                                            <div className="col-start-8 col-span-5">

                                                <Collapsible
                                                    transitionTime={50}
                                                    open={false}
                                                    className="c-accordion"
                                                    classParentString="border-0"
                                                    trigger={

                                                        <div className="">
                                                            <FontAwesomeIcon style={{ width: 20, height: 20 }} className="c-navbar_icon-link mb-2" icon={faIcons.faInfoCircle} />
                                                        </div>

                                                    }>

                                                    <div className="bg-transparent mb-4 u-text-bold" >



                                                        <p className="text-sm">
                                                            Withdraw EGLD from your deposit to you wallet.
                                                            Keep some EGLD in your deposit so you can make Offers and Bids.
                                                        </p>

                                                    </div>

                                                </Collapsible>

                                                <div className="align-items-center flex justify-content-center mb-8">

                                                    <input placeholder={"Amount to withdraw (EGLD)"} onChange={(e: any) => { setWithdrawDepositAmount(e.target.value) }} value={withdrawDepositAmount} type="number" className="rounded-l-lg text-center bg-opacity-10  bg-white border-1 border-gray-400 p-2 placeholder-opacity-10  text-white w-full" />

                                                    <button onClick={() => { setWithdrawDepositAmount(deposit); }} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-r-lg  border-1 border-gray-400 p">
                                                        Max
                                                    </button>

                                                </div>

                                                <button className="c-button c-button--secondary" onClick={handleWithdrawDeposit}>
                                                    <span>
                                                        Withdraw deposit
                                                    </span>
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        )}
                    </Popup>


                </div>


                <div>
                    <button className="c-button c-button--secondary bg-transparent" onClick={handleLogOut}>Logout</button>
                </div>
            </div>
        </aside>
    );
};

export default WalletSidebar;
