/* eslint-disable */ 
import Popup from 'reactjs-popup';
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from 'react-collapsible';
import { Redirect, Link, useParams, useHistory } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrands from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

import DateTimePicker from 'react-datetime-picker';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetBuyNftTemplateMutation, useGetListNftTemplateMutation, useGetStartAuctionNftTemplateMutation } from 'services/tx-template';
import { useGetTokenCollectionAvailablityMutation, useGetTokenDataMutation } from "services/tokens";
import { prepareTransaction } from "utils/transactions";

import { UrlParameters } from "./interfaces";
import { useGetEgldPriceQuery } from "services/oracle";
import { formatImgLink, shorterAddress, GetTransactionRequestHttpURL, GetJSONResultData } from "utils";
import { BUY } from "constants/actions";
import { useGetAccountTokenGatewayMutation } from 'services/accounts';
import { useGetCollectionByIdMutation } from 'services/collections';
//import { useCreateTokenMutation } from "services/tokens";
import { routePaths } from 'constants/router';



export const SellTokenPage: (props: any) => any = ({ }) => {

    const history = useHistory();
    const { collectionId, tokenNonce, walletAddress: walletAddressParam } = useParams<UrlParameters>();
    const [isFixedSale, setIsFixedSale] = useState<boolean>(true);

    const [requestedAmount, setRequestedAmount] = useState<number | undefined>(undefined);
    const [startDate, setStartDate] = useState<any>();
    const [endDate, setEndDate] = useState<any>();


    const {
        loggedIn,
        address: userWalletAddress,
    } = Dapp.useContext();

    const sendTransaction = Dapp.useSendTransaction();


    const handleChangeRequestedAmount = (e: any) => {

        setRequestedAmount(e.target.value);

    }

    const handleChangeStartDate = (value: any) => {

        setStartDate(value);


    }

    const handleChangeEndDate = (value: any) => {

        setEndDate(value);

    }

    const [getAccountTokenTrigger, {

        data: gatewayTokenData,
        isLoading: isLoadingGatewayTokenDataQuery,
        isSuccess: isSuccessGatewayTokenDataQuery,
        isError: isErrorGatewayTokenDataQuery,

    }] = useGetAccountTokenGatewayMutation();


    const isTokenDataFetched: boolean = isSuccessGatewayTokenDataQuery && Boolean(gatewayTokenData);
    const shouldRenderPage: boolean = isTokenDataFetched;

    const [getListNftTemplateQueryTrigger] = useGetListNftTemplateMutation();
    const [getStartAuctionNftTemplateTrigger] = useGetStartAuctionNftTemplateMutation();

    const [getCollectionByIdTrigger, {

        data: getCollectionByIdData,
        isLoading: isLoadingGetCollectionByIdQuery,
        isSuccess: isSuccessGetCollectionByIdQuery,
        isError: isErrorGetCollectionByIdQuery,

    }] = useGetCollectionByIdMutation();

    //const shouldRedirectHome: boolean = isErrorGatewayTokenDataQuery || (!Boolean(gatewayTokenData?.data?.tokenData?.creator) && isSuccessGatewayTokenDataQuery)
    const shouldRedirectHome: boolean = false


    //const [createTokenTrigger,] = useCreateTokenMutation();

    useEffect(() => {

        getCollectionByIdTrigger({ collectionId: collectionId });

        getAccountTokenTrigger({ userWalletAddress: walletAddressParam, identifier: collectionId, nonce: tokenNonce });

    }, []);

    // gatewayTokenData?.data?.tokenData?.creator

    if (isErrorGatewayTokenDataQuery || Boolean(gatewayTokenData?.error)) {

        history.replace(`/`);

    }


    if (shouldRedirectHome) {

        return (
            <Redirect to={routePaths.home} />
        );

    };


    if (!shouldRenderPage) {

        return (<p className="my-10 text-2xl text-center">Loading...</p>);

    }

    const token = gatewayTokenData.data.tokenData;
    const imageLink = atob(token?.uris?.[0] || '');
    // const availableData = getCollectionByIdData.data.tokens[0];
    // const isCollectionAvailable: boolean = availableData.collection.available;

    const {

        name: tokenName,

    } = token;


    const ownerShortWalletAddress: string = shorterAddress(walletAddressParam, 7, 4);
    const displayedOwner = ownerShortWalletAddress;
    const isCurrentTokenOwner: boolean = walletAddressParam === userWalletAddress;

    if (!isCurrentTokenOwner) {

        history.replace(`/`);

    }

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

    const handleListFixedPrice = () => {

        //database nonce is bigint - this value needs to be hexidecimal. basically adding 0 to the first position is the len = 1
        let hexNonce = tokenNonce;
        if(tokenNonce.length == 1){
            hexNonce = "0" + tokenNonce;
        }

        signTemplateTransaction({

            succesCallbackRoute: '/token/' + collectionId +'/' + tokenNonce + '/insert',
            //succesCallbackRoute: '/token/'+ walletAddressParam +'/' + collectionId +'/' + tokenNonce + '/sell',
            getTemplateData: { userWalletAddress, collectionId, tokenNonce, price: requestedAmount },
            getTemplateTrigger: getListNftTemplateQueryTrigger,

        });        
    };
/*
    const handleCreateToken = () => {
        
        const formattedData = {
            walletAddress: userWalletAddress,
            tokenName: gatewayTokenData.data.tokenData["tokenIdentifier"],
            tokenNonce: hexNonce,
        }        
 
        const response: any = createTokenTrigger({ payload: formattedData });

        if (response.error) {

            const { error, status, } = response.error;

            toast.error(`${error + ' ' + status}`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;
        }  
 
    };
 */

    const handleListAuction = () => {

        const unixStartDate = new Date(startDate).getTime() / 1000;
        const unixEndDate = new Date(endDate).getTime() / 1000;
        const nowDate = new Date().getTime() / 1000;


        if (!unixStartDate || !unixEndDate) {

            toast.error(`Invalid dates`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;
        };


        if (unixStartDate >= unixEndDate) {

            toast.error(`Start date needs to be earlier than end date`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;


        };

        if (unixEndDate < nowDate ) {

            toast.error(`End date should't be in the past`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;

        };


        signTemplateTransaction({

            succesCallbackRoute: '/account',
            getTemplateData: { userWalletAddress, collectionId, tokenNonce, minBid: requestedAmount, startTime: unixStartDate, deadline: unixEndDate },
            getTemplateTrigger: getStartAuctionNftTemplateTrigger,

        });

    };

    const handleSubmitListing = (e: any) => {

        e.preventDefault();

        if (isFixedSale) {

            handleListFixedPrice();

            return;

        }

        handleListAuction();

    };
    
    return (

        <div className="p-sell-token-page">

            <div className="grid grid-cols-12 my-10">


                <div className="col-start-2 col-span-10">

                    <h2 className="u-regular-heading u-text-bold u-margin-bottom-spacing-5">
                        List token for sale
                    </h2>

                </div>


                <div className="col-start-2 col-span-10">

                    <div className="grid grid-cols-12">

                        <div className="col-span-6">

                            <form onSubmit={handleSubmitListing} >

                                <div>

                                    <p className="flex justify-between u-text-small mb-2">

                                        <span className="u-text-theme-gray-light">
                                            Type
                                        </span>

                                        <span className="u-text-theme-gray-mid">

                                            <Popup
                                                offsetY={35}
                                                arrow={false}
                                                mouseEnterDelay={0}
                                                mouseLeaveDelay={0}
                                                position="top center"
                                                on={['hover', 'focus']}
                                                trigger={
                                                    <FontAwesomeIcon width={'20px'} icon={faIcons.faInfoCircle} />
                                                }
                                            >
                                                {() => (
                                                    <div className="rounded-2xl">

                                                        <p>
                                                            "Fixed Price" sale is when the price stays fixed, no additional requirements for this type of sale
                                                        </p>

                                                        <p>
                                                            "Fixed Price" sale is when the price stays fixed, no additional requirements for this type of sale
                                                        </p>

                                                    </div>
                                                )}
                                            </Popup>
                                        </span>

                                    </p>


                                    <div className="grid grid-cols-12 c-switcher-action mb-6">

                                        <div onClick={() => { setIsFixedSale(true); }} className={`${isFixedSale && 'c-switcher-action_option--active'} c-switcher-action_option align-items-center col-span-6 flex flex-col py-10`}>

                                            <FontAwesomeIcon className="text-2xl mb-3" icon={faIcons.faDollarSign} />

                                            <span className="u-text-bold">
                                                Fixed price
                                            </span>

                                        </div>

                                        <div onClick={() => { setIsFixedSale(false); }} className={`${!isFixedSale && 'c-switcher-action_option--active'} c-switcher-action_option align-items-center col-span-6 flex flex-col py-10`}>

                                            <FontAwesomeIcon className="text-2xl mb-3" icon={faIcons.faClock} />

                                            <span className="u-text-bold">
                                                Timed Auction
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <div>

                                    {
                                        !isFixedSale &&
                                        <>

                                            <div className="mb-4">

                                                <p className="flex justify-between u-text-small mb-2">

                                                    <span className="u-text-theme-gray-light">
                                                        Start date
                                                    </span>

                                                    <span className="u-text-theme-gray-mid">
                                                        <FontAwesomeIcon width={'20px'} icon={faIcons.faInfoCircle} />
                                                    </span>

                                                </p>

                                                <div className="c-date-time-picker">
                                                    <DateTimePicker value={startDate} onChange={handleChangeStartDate} />
                                                </div>
                                            </div>

                                            <div className="mb-4">

                                                <p className="flex justify-between u-text-small mb-2">

                                                    <span className="u-text-theme-gray-light">
                                                        End date
                                                    </span>

                                                    <span className="u-text-theme-gray-mid">
                                                        <FontAwesomeIcon width={'20px'} icon={faIcons.faInfoCircle} />
                                                    </span>

                                                </p>


                                                <div className="c-date-time-picker">
                                                    <DateTimePicker value={endDate} onChange={handleChangeEndDate} />
                                                </div>


                                            </div>

                                        </>
                                    }

                                    <div className="mb-4">

                                        <p className="flex justify-between u-text-small mb-2">

                                            <span className="u-text-theme-gray-light">
                                                {isFixedSale ? 'Price' : 'Min bid'}
                                            </span>

                                            <span className="u-text-theme-gray-mid">
                                                <FontAwesomeIcon width={'20px'} icon={faIcons.faInfoCircle} />
                                            </span>

                                        </p>

                                        <input placeholder="Amount (EGLD)" min={0} step="0.001" onChange={handleChangeRequestedAmount} value={requestedAmount} type="number" className="bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />

                                    </div>


                                </div>


                                <div className="mt-3 pt-3">

                                    <p className="flex justify-between u-text-small mt-2">

                                        <span className="u-text-theme-gray-light">
                                            Fees
                                        </span>

                                        <span className="u-text-theme-gray-mid">
                                            <FontAwesomeIcon width={'20px'} icon={faIcons.faInfoCircle} />
                                        </span>

                                    </p>


                                    <p className="flex justify-between u-text-small mb-3">

                                        <span className="u-text-theme-gray-mid">
                                            Services fee
                                        </span>

                                        <span className="u-text-theme-gray-mid">
                                            2.5%
                                        </span>

                                    </p>

                                </div>


                                <button type="submit" className="c-button c-button--primary u-margin-right-spacing-2">
                                    <span>
                                        List
                                    </span>
                                </button>

                            </form>

                        </div>

                        <div className="col-start-9 col-span-3">

                            <p className="mb-3"> Preview</p>

                            <div className={`c-card`}>

                                <div className="c-card_img-container">
                                    <img src={formatImgLink(imageLink)} className="c-card_img" alt="" />
                                </div>
                                <div className="c-card_info">

                                    <div className="c-card_token-details">
                                        {Boolean(getCollectionByIdData?.data) &&
                                            <p className="text-gray-700 text-xs">
                                                <Link className="text-gray-500 hover:text-gray-200" to={`/collection/${collectionId}`}>
                                                    {getCollectionByIdData?.data?.collection?.name || collectionId}
                                                </Link>
                                            </p>
                                        }
                                        <p className="text-sm u-text-bold">
                                            {tokenName}
                                        </p>
                                    </div>

                                    <div className="c-card_price">
                                        {/* <p className="text-xs">
                                            <span className="text-gray-500">Last</span>
                                        </p> */}
                                        <p className="text-sm">
                                            <span className="">
                                                {requestedAmount ? requestedAmount : 0} {' '}
                                            </span>
                                            <span className="u-text-theme-gray-light">
                                                EGLD
                                            </span>
                                        </p>
                                    </div>


                                </div>
                            </div>

                        </div>

                    </div>



                </div>

            </div>

        </div>
    );
};

export default SellTokenPage;
