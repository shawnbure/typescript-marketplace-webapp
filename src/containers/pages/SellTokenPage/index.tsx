/* eslint-disable */ 
import Popup from 'reactjs-popup';
import { useRef, useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from 'react-collapsible';
import { Redirect, Link, useParams, useHistory } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrands from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

import DateTimePicker from 'react-datetime-picker';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetBuyNftTemplateMutation, useGetListNftTemplateMutation, useGetStartAuctionNftTemplateMutation } from 'services/tx-template';
import { useGetTokenCollectionAvailablityMutation, useGetTokenDataMutation, useCreateTokenMutation } from "services/tokens";
import { prepareTransaction } from "utils/transactions";

import { UrlParameters } from "./interfaces";
import { useGetEgldPriceQuery } from "services/oracle";
import { formatImgLink, shorterAddress, GetTransactionRequestHttpURL, GetJSONResultData, formatHexMetaImage } from "utils";
import { BUY } from "constants/actions";
import { useGetAccountTokenGatewayMutation } from 'services/accounts';
import { useGetCollectionByIdMutation } from 'services/collections';
import { routePaths } from 'constants/router';
import store from 'redux/store';
import { number } from 'yup/lib/locale';

export const SellTokenPage: (props: any) => any = ({ }) => {

    const history = useHistory();
    const { collectionId, tokenNonce, walletAddress: walletAddressParam } = useParams<UrlParameters>();
    const [isFixedSale, setIsFixedSale] = useState<boolean>(true);

    const [requestedAmount, setRequestedAmount] = useState(0);
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);

    const {
        loggedIn,
        address: userWalletAddress
    } = Dapp.useContext();

    const [createTokenTrigger] = useCreateTokenMutation();

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

    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {

        getCollectionByIdTrigger({ collectionId: collectionId });

        getAccountTokenTrigger({ userWalletAddress: walletAddressParam, identifier: collectionId, nonce: tokenNonce });

        const shouldRedirect: boolean = isErrorGatewayTokenDataQuery || (!Boolean(gatewayTokenData?.data?.tokenData?.creator) && isSuccessGatewayTokenDataQuery)
        
        //this is for clientside token insert
        //setShouldRedirect(false);

    }, []);

    //this is for the save token. Need to optimize - get the user store state, then the auth token is ready
    //this is for clientside token insert
/*
    useEffect(() => 
    {

        if( ! initialStore )
        {     
    
            if( store.getState().user.accessToken != "" )
            {
                setInitialStore(true)
                setStoreDataExist(true)
            }
        }

    });
*/
    const [initialStore, setInitialStore] = useState(false)
    const [storeDataExist, setStoreDataExist] = useState(false)

    //execute when the authtoken is ready - save the token record to the DB - only if the tx is successful
    useEffect(() => 
    {

        if( !initialStore ) {
            return
        }

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const txtHash = urlParams.get("txHash")
        const status = String(urlParams.get("status"))
        
        if(txtHash != null ) {

            const saleStatus = String(urlParams.get("saleStatus"))
            const saleNominalPrice = parseFloat(String(urlParams.get("salePrice")))
            const saleStartDate = parseInt(String(urlParams.get("saleStartDate")))
            const saleEndDate = parseInt(String(urlParams.get("saleEndDate")))

            if(status == "success"){

                //this value needs to be hexidecimal. add 0 to the first position if the len = 1
                let hexNonce = tokenNonce;
                if(tokenNonce?.length == 1){
                    hexNonce = "0" + tokenNonce;
                }

                //fix the string price to correct format
                let saleStringPriceRaw = String(urlParams.get("salePrice")).replace('0.','').replace('.','');

                let arraySaleStringPrice = saleStringPriceRaw.split('');

                let leadingZeroCount = 0;
                let digitCount = 0;

                //account for the start pos if the leading zeros
                //account for the number of digits
                for (let i = 0; i < arraySaleStringPrice.length; i++) {

                    if(arraySaleStringPrice[i] === "0") {
                        leadingZeroCount++;
                    }
                    if(arraySaleStringPrice[i] != "0") {
                        digitCount++;
                    }
                }

                let numberOfTrailingZeros = leadingZeroCount+digitCount;

                let saleStringPrice = arraySaleStringPrice.join('').replace('0','');

                for (let i = 0; i < 18-numberOfTrailingZeros; i++) {
                saleStringPrice += "0";
                }

                const formattedData = {
                    walletAddress: userWalletAddress,
                    tokenName: collectionId,
                    tokenNonce: hexNonce,
                    saleStatus : saleStatus, 
                    saleStringPrice : saleStringPrice, 
                    saleNominalPrice : saleNominalPrice, 
                    saleStartDate: saleStartDate, 
                    saleEndDate : saleEndDate, 
                }   

                const response: any = createTokenTrigger({ payload: formattedData });

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

                setShouldRedirect(true);
                
            }else{

                toast.error(`The blockchain transaction failed, please try again.`, {
                    autoClose: 5000,
                    draggable: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    hideProgressBar: false,
                    position: "bottom-right",
                });

                return;
            }    
        }   

    }, [storeDataExist]);

    // gatewayTokenData?.data?.tokenData?.creator

    if (isErrorGatewayTokenDataQuery || Boolean(gatewayTokenData?.error)) {

        history.replace(`/`);

    }

    if (shouldRedirect) {

        return (
            <Redirect to={routePaths.collection.replace(":collectionId", collectionId)} />
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

            //succesCallbackRoute: '/token/' + collectionId +'/' + tokenNonce + '/insert',
            succesCallbackRoute: '/token/'+ walletAddressParam +'/' + collectionId +'/' + tokenNonce + '/sell?saleStatus=List&salePrice='+requestedAmount+'&saleStartDate=0&saleEndDate=0',
            getTemplateData: { userWalletAddress, collectionId, tokenNonce, price: requestedAmount },
            getTemplateTrigger: getListNftTemplateQueryTrigger,

        });        
    };

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

         //database nonce is bigint - this value needs to be hexidecimal. basically adding 0 to the first position is the len = 1
         let hexNonce = tokenNonce;
         if(tokenNonce.length == 1){
             hexNonce = "0" + tokenNonce;
         }

        signTemplateTransaction({

            succesCallbackRoute: '/account',
            //below is the client based token add to database
            //succesCallbackRoute: '/token/'+ walletAddressParam +'/' + collectionId +'/' + tokenNonce + '/sell?saleStatus=Auction&salePrice='+requestedAmount+'&saleStartDate='+unixStartDate+'&saleEndDate='+unixEndDate,
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
                                    <img src={(imageLink)} className="c-card_img" alt="" />
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
