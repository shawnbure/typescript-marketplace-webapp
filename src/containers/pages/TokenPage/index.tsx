import Popup from 'reactjs-popup';
import Table from 'rc-table';
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from 'react-collapsible';
import { useLocation, Link, useParams, Redirect } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrands from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import moment from 'moment';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetAcceptOfferTemplateMutation, useGetBuyNftTemplateMutation, useGetCancelOfferTemplateMutation, useGetEndAuctionTemplateMutation, useGetMakeBidTemplateMutation, useGetMakeOfferTemplateMutation, useGetWithdrawNftTemplateMutation } from 'services/tx-template';
import { useGetTokenBidsMutation, useGetTokenDataMutation, useGetTokenOffersMutation, } from "services/tokens";
import { prepareTransaction } from "utils/transactions";

import { UrlParameters } from "./interfaces";
import { useGetEgldPriceQuery } from "services/oracle";
import { shorterAddress } from "utils";
import { ACCEPT_OFFER, BUY, CANCEL_OFFER, END_AUCTION, MAKE_BID, MAKE_OFFER, SELL, WITHDRAW } from "constants/actions";
import { useAppDispatch } from "redux/store";
import { setShouldDisplayWalletSidebar } from "redux/slices/ui";
import { useGetAccountTokenGatewayMutation } from 'services/accounts';
import { useGetCollectionByIdMutation } from 'services/collections';
import { routePaths } from 'constants/router';

export const TokenPage: (props: any) => any = ({ }) => {

    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const { collectionId, tokenNonce, walletAddress: walletAddressParam } = useParams<UrlParameters>();

    const [offerAmount, setOfferAmount] = useState<number>(0);
    const [expireOffer, setExpireOffer] = useState<number>(9999999999);
    const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);

    const {
        loggedIn,
        address: userWalletAddress,
    } = Dapp.useContext();

    const sendTransaction = Dapp.useSendTransaction();

    const [getAccountTokenTrigger, {

        data: gatewayTokenData,
        isLoading: isLoadingGatewayTokenDataQuery,
        isSuccess: isSuccessGatewayTokenDataQuery,
        isError: isErrorGatewayTokenDataQuery,
        isUninitialized: isUninitializedGatewayTokenDataQuery,


    }] = useGetAccountTokenGatewayMutation();


    const [getCollectionByIdTrigger, {
        data: collectionData
    }] = useGetCollectionByIdMutation();


    const [getTokenDataTrigger, {

        data: tokenResponseData,
        isError: isErrorGetTokenDataQuery,
        isSuccess: isSuccessGetTokenDataQuery,
        isUninitialized: isUninitializedGetTokenDataQuery,

    }] = useGetTokenDataMutation();

    const [getTokenOffersTrigger, {
        data: tokenOffersData,
    }] = useGetTokenOffersMutation();

    const [getTokenBidsTrigger, {
        data: tokenBidsData,
    }] = useGetTokenBidsMutation();

    const [getMakeBidTemplateTrigger] = useGetMakeBidTemplateMutation();
    const [getMakeOfferTemplateTrigger] = useGetMakeOfferTemplateMutation();
    const [getEndAuctionTemplateTrigger] = useGetEndAuctionTemplateMutation();
    const [getAcceptOfferTemplateTrigger] = useGetAcceptOfferTemplateMutation();
    const [getCancelOfferTemplateTrigger] = useGetCancelOfferTemplateMutation();



    const {

        data: egldPriceData,
        isError: isErrorEgldPriceQuery,
        isLoading: isLoadingEgldPriceQuery,
        isSuccess: isSuccessEgldPriceQuery,

    } = useGetEgldPriceQuery();

    console.log({
        walletAddressParam,
        tokenResponseData
    });


    const isEgldPriceFetched: boolean = isSuccessEgldPriceQuery && Boolean(egldPriceData);
    const isTokenDataFetched: boolean = isSuccessGetTokenDataQuery && Boolean(tokenResponseData?.data?.token);
    const isGatewayTokenFetched: boolean = isSuccessGatewayTokenDataQuery && Boolean(gatewayTokenData?.data);
    const shouldRenderPage: boolean = walletAddressParam ? isGatewayTokenFetched : (isTokenDataFetched && isEgldPriceFetched);

    const shouldRedirect: boolean = walletAddressParam ? (isErrorGatewayTokenDataQuery || (!Boolean(gatewayTokenData?.data?.tokenData?.creator) && isSuccessGatewayTokenDataQuery)) : (isErrorGetTokenDataQuery || (!Boolean(tokenResponseData?.data?.ownerWalletAddress) && isSuccessGetTokenDataQuery));

    const [getBuyNftTemplateQueryTrigger] = useGetBuyNftTemplateMutation();
    const [getWithdrawNftTemplateQueryTrigger] = useGetWithdrawNftTemplateMutation();


    useEffect(() => {

        getTokenOffersTrigger({
            collectionId,
            tokenNonce,
            offset: 0,
            limit: 10,
        });

        getTokenBidsTrigger({
            collectionId,
            tokenNonce,
            offset: 0,
            limit: 10,
        });

        getCollectionByIdTrigger({ collectionId: collectionId });

        if (walletAddressParam) {

            getAccountTokenTrigger({ userWalletAddress: walletAddressParam, identifier: collectionId, nonce: tokenNonce });

            return;

        }

        getTokenDataTrigger({ collectionId, tokenNonce });


    }, []);


    if (shouldRedirect) {

        return (
            <Redirect to={routePaths.home} />
        );

    };

    if (!shouldRenderPage) {

        return (<p>Loading...</p>);

    };

    const { data: tokenData } = walletAddressParam ? gatewayTokenData : tokenResponseData;

    const getBaseTokenData = (tokenData: any, isOurs: boolean = false) => {

        const token = isOurs ? tokenData.token : tokenData.tokenData;

        const nonce = token.nonce;
        const name = isOurs ? token.tokenName : token.name;
        const ownerWalletAddress = isOurs ? tokenData.ownerWalletAddress : walletAddressParam;
        const imageLink: string = isOurs ? token.imageLink : atob(token?.uris?.[0] || '');
        const metadataLink: string = isOurs ? token.metadataLink : atob(token?.uris?.[1] || '');
        const royaltiesPercent = isOurs ? token.royaltiesPercent : parseFloat(token.royalties) / 100;

        const baseData = {

            name,
            nonce,
            imageLink,
            metadataLink,
            royaltiesPercent,
            ownerWalletAddress,

        };

        const ourExtraData = isOurs ? {

            id: token.id,
            tokenState: token.state,
            ownerName: tokenData.ownerName,
            priceNominal: token.priceNominal,
            auctionDeadline: token.auctionDeadline,
            auctionStartTime: token.auctionStartTime,

        } : {
            id: 0,
            ownerName: '',
            tokenState: '',
            priceNominal: 0,
            auctionDeadline: 0,
            auctionStartTime: 0,
        };

        return { ...baseData, ...ourExtraData };

    };

    const {

        nonce,
        imageLink,
        metadataLink,
        name: tokenName,
        auctionDeadline,
        auctionStartTime,
        royaltiesPercent,
        ownerWalletAddress,

        id,
        ownerName,
        tokenState,
        priceNominal: tokenPrice,

    } = getBaseTokenData(tokenData, !Boolean(walletAddressParam));


    // console.log({
    //     nonce,
    //     imageLink,
    //     metadataLink,
    //     tokenName,
    //     royaltiesPercent,
    //     ownerWalletAddress,
    //     id,
    //     ownerName,
    //     tokenState,
    //     tokenPrice,
    // });


    // const {

    //     description,
    //     discordLink,
    //     twitterLink,
    //     telegramLink,
    //     instagramLink,
    //     website: websiteLink,
    //     name: collectionName,

    // } = collectionData?.data;

    const isListed: boolean = tokenState === 'List';
    const isAuction: boolean = tokenState === 'Auction';
    const isOnSale: boolean = isListed || isAuction;
    const onSaleText = isListed ? "Current price" : "Min bid"

    const ownerShortWalletAddress: string = shorterAddress(ownerWalletAddress, 7, 4);
    // const creatorShortWalletAddress: string = shorterAddress(creatorWalletAddress, 7, 4);


    const displayedOwner = Boolean(ownerName) ? ownerName : ownerShortWalletAddress;
    // const displayedCreator = creatorName ? creatorName : creatorShortWalletAddress;


    const isCurrentTokenOwner: boolean = ownerWalletAddress === userWalletAddress;


    const hasBidderWinner = Boolean(tokenBidsData?.data?.[0]);
    const bidderWinnerName = tokenBidsData?.data?.[0]?.bidderName;
    const isBidderWinnerAddress: boolean = tokenBidsData?.data?.[0]?.bid.bidderAddress === userWalletAddress;


    const egldPriceString = egldPriceData?.data;
    const priceTokenDollars = tokenPrice * parseFloat(egldPriceString);
    const priceTokenDollarsFixed = parseFloat(`${priceTokenDollars}`).toFixed(3);


    const nowDate = new Date();
    const auctionDeadlineDate = new Date(auctionDeadline * 1000);
    const auctionStartTimeDate = new Date(auctionStartTime * 1000);
    const auctionDeadlineTitle = moment(new Date(auctionDeadlineDate), "YYYY-MM-DD HH:mm:ss");
    const auctionStartTimeTitle = moment(new Date(auctionStartTimeDate), "YYYY-MM-DD HH:mm:ss");




    const isAuctionOngoing: boolean = nowDate < auctionDeadlineDate;
    const hasAuctionFinished: boolean = auctionDeadlineDate < nowDate;
    const hasAuctionStarted: boolean = auctionStartTimeDate < nowDate;

    const hasFinishedWithoutWinner = hasAuctionFinished && !hasBidderWinner;

    const shouldDisplayEndAuctionButton = isAuction && !isAuctionOngoing && hasBidderWinner && (isCurrentTokenOwner || isBidderWinnerAddress);


    const offersTableColumns = [
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            className: 'c-table_column',
        }, {
            title: 'Expiration',
            dataIndex: 'expiration',
            key: 'expiration',
            className: 'c-table_column',
        }, {
            title: 'From',
            dataIndex: 'from',
            key: 'from',
            className: 'c-table_column',
        }
    ];



    const descriptionMocked = `Pigselated is a collection of 10101 unique NFT collectibles stored on the Elrond blockchain. \n\n Pixels have been part of our lives since the last century and they're not going away. Everybody loves a good pixel and, you can be sure, pigsels.`;


    const listingTableColumns = [{
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        className: 'c-table_column',
    }, {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        className: 'c-table_column',
    }, {
        title: 'From',
        dataIndex: 'from',
        key: 'from',
        className: 'c-table_column',
    }];


    const bidsTableColumns = [{
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        className: 'c-table_column',
    }, {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        className: 'c-table_column',
    }, {
        title: 'From',
        dataIndex: 'from',
        key: 'from',
        className: 'c-table_column',
    }];


    const activityTableColumns = [{
        title: 'Event',
        dataIndex: 'event',
        key: 'event',
        className: 'c-table_column',
    }, {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        className: 'c-table_column',
    }, {
        title: 'From',
        dataIndex: 'from',
        key: 'from',
        className: 'c-table_column',
    }, {
        title: 'To',
        dataIndex: 'to',
        key: 'to',
        className: 'c-table_column',
    }, {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        className: 'c-table_column',
    }];



    const chartData = [
        {
            name: '5/27 ',
            uv: 4000,
            pv: 1,
            amt: 2400,
        },
        {
            name: '6/1',
            uv: 3000,
            pv: 2.5,
            amt: 2210,
        },
        {
            name: '6/6',
            uv: 2000,
            pv: 4,
            amt: 2290,
        },
        {
            name: '6/11',
            uv: 2780,
            pv: 3,
            amt: 2000,
        },
        {
            name: '6/26',
            uv: 2390,
            pv: 5,
            amt: 2500,
        },
        {
            name: '7/1',
            uv: 3490,
            pv: 6,
            amt: 2100,
        },
    ];



    const mapOffersTableData = tokenOffersData?.data?.map((offerData: any, index: number) => {

        const { offer, offerorName } = offerData;
        const { amountNominal, txHash, timestamp, expire, offerorAddress } = offer;
        const dueDate = new Date(expire * 1000);
        const isCurrentOfferor: boolean = offerorAddress === userWalletAddress;
        const hasAction: boolean = isCurrentTokenOwner || isCurrentOfferor;
        const shorterTx: string = shorterAddress(txHash, 4, 4);
        const txDisplayName = Boolean(offerorName) ? offerorName : shorterTx;

        const shouldDisplayAcceptButton = isCurrentTokenOwner && (!hasAuctionStarted || hasFinishedWithoutWinner);

        if (offersTableColumns.length === 3 && hasAction && (shouldDisplayAcceptButton || isCurrentOfferor)) {

            offersTableColumns.push({
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                className: 'c-table_column',
            });

        }

        const AcceptOffer: any = (
            <button
                onClick={() => { actionsHandlers[ACCEPT_OFFER]({ offerorAddress, amount: amountNominal }); }}
                className="bg-white bg-opacity-10  text-sm text-white font-bold py-2 px-4 rounded">
                <span>
                    Accept
                </span>
            </button>
        );

        const CancelOffer: any = (
            <button
                onClick={() => { actionsHandlers[CANCEL_OFFER]({ amount: amountNominal }); }}
                className="bg-white bg-opacity-10  text-sm text-white font-bold py-2 px-4 rounded">
                <span>
                    Cancel
                </span>
            </button>
        );

        return ({
            action: <>
                {isCurrentOfferor && CancelOffer}
                {shouldDisplayAcceptButton && AcceptOffer}
            </>,
            price: `${amountNominal}`,
            expiration: <span className="u-text-theme-gray-mid">{moment().to(moment(dueDate))}</span>,
            from: <a href={`https://devnet-explorer.elrond.com/transactions/${txHash}`} target="_blank">{txDisplayName}</a>,
            key: `key-${index}`
        })

    });


    const mapListingTableData = () => {

        const data = [{
            price: '1.54',
            date: <span className="u-text-theme-gray-mid">2 days ago</span>,
            from: <a href="#">PinkyBoy</a>,
            key: `key-${1}`
        }, {
            price: '3',
            date: <span className="u-text-theme-gray-mid">10 days ago</span>,
            from: <a href="#">cryptolegend</a>,
            key: `key-${2}`
        }, {
            price: '3.14',
            date: <span className="u-text-theme-gray-mid">22 days ago</span>,
            from: <a href="#">PinkyBoy</a>,
            key: `key-${3}`
        }]

        return data;

    }


    const mapBidsTableData = tokenBidsData?.data?.map((offerData: any, index: number) => {

        const { bid, bidderName } = offerData;
        const { bidAmountNominal, txHash, timestamp, bidderAddress } = bid;

        const isCurrentBidder: boolean = bidderAddress === userWalletAddress;
        const hasAction: boolean = isCurrentTokenOwner || isCurrentBidder;
        const shorterTx: string = shorterAddress(txHash, 4, 4);
        const txDisplayName = Boolean(bidderName) ? bidderName : shorterTx;

        return ({
            price: `${bidAmountNominal}`,
            date: <span className="u-text-theme-gray-mid">{moment().to(moment(timestamp * 1000))}</span>,
            from: <a href={`https://devnet-explorer.elrond.com/transactions/${txHash}`} target="_blank">{txDisplayName}</a>,
            key: `key-${index}`
        })

    });
    const mapActivityTableData = () => {

        const tx = `da7efdbdaef6fc268ad307b7ae6abce0c5d88f259e89d052c0d684d65d97f5d4`;

        const data = [{
            event: <>
                <FontAwesomeIcon width={'20px'} icon={faIcons.faTags} /> {` `}
                <span>List</span>
            </>,
            price: 2,
            from: <a href="#">cryptolegend</a>,
            to: <a href="#"></a>,
            date: <div>
                <a href="#">
                    5 minutes ago {` `}
                    <FontAwesomeIcon width={'10px'} className="" icon={faIcons.faExternalLinkAlt} />
                </a>
            </div>,
            key: `key-${1}`
        }, {
            event: <>
                <FontAwesomeIcon width={'20px'} icon={faIcons.faHandHoldingUsd} /> {` `}
                <span>Withdraw</span>
            </>,
            price: '',
            from: <a href="#">cryptolegend</a>,
            to: <a href="#"></a>,
            date: <div>
                <a href="#">
                    20 minutes ago {` `}
                    <FontAwesomeIcon width={'10px'} className="" icon={faIcons.faExternalLinkAlt} />
                </a>
            </div>,
            key: `key-${1}`
        }, {
            event: <>
                <FontAwesomeIcon width={'20px'} icon={faIcons.faGavel} /> {` `}
                <span>Auction</span>
            </>,
            price: 1.5,
            from: <a href="#">cryptolegend</a>,
            to: <a href="#"></a>,
            date: <div>
                <a href="#">
                    1 hour ago {` `}
                    <FontAwesomeIcon width={'10px'} className="" icon={faIcons.faExternalLinkAlt} />
                </a>
            </div>,
            key: `key-${1}`
        }, {
            event: <>
                <FontAwesomeIcon width={'20px'} icon={faIcons.faShoppingCart} /> {` `}
                <span>Buy</span>
            </>,
            price: 1,
            from: <a href="#">PinkyBoy</a>,
            to: <a href="#">cryptolegend</a>,
            date: <div>
                <a href="#">
                    2 hours ago {` `}
                    <FontAwesomeIcon width={'10px'} className="" icon={faIcons.faExternalLinkAlt} />
                </a>
            </div>,
            key: `key-${1}`
        }]

        return data;

    };

    const attributesMocked: Array<any> = [
        {
            type: 'head',
            value: 'Beret Red',
            rarity: 2.8,
        },
        {
            type: 'face',
            value: 'Anime Eyes',
            rarity: 0.5,
        },
        {
            type: 'hand',
            value: 'Dynamite',
            rarity: 1.2,
        },
        {
            type: 'body',
            value: 'Lumberjack',
            rarity: 7,
        },
        {
            type: 'background',
            value: 'Forest',
            rarity: 11,
        },
    ]

    const handleBuyAction = async () => {

        const getBuyNFTResponse: any = await getBuyNftTemplateQueryTrigger({ userWalletAddress, collectionId, tokenNonce, price: tokenPrice });

        if (getBuyNFTResponse.error) {

            const { status, data: { error } } = getBuyNFTResponse.error;

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

        const { data: txData } = getBuyNFTResponse.data;

        const unconsumedTransaction = prepareTransaction(txData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: '/account'
        });


    };



    const handleWithdrawAction = async () => {

        const getWithdrawNFTResponse: any = await getWithdrawNftTemplateQueryTrigger({ userWalletAddress, collectionId, tokenNonce });

        if (getWithdrawNFTResponse.error) {

            const { status, data: { error } } = getWithdrawNFTResponse.error;

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

        const { data: txData } = getWithdrawNFTResponse.data;

        const unconsumedTransaction = prepareTransaction(txData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: '/account'
        });


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

    const handleMakeOffer = () => {

        const getTemplateData = {

            userWalletAddress,
            collectionId,
            tokenNonce,
            amount: offerAmount,
            expire: expireOffer,

        };

        setExpireOffer(0);
        setOfferAmount(0);

        signTemplateTransaction({

            succesCallbackRoute: pathname,
            getTemplateData: getTemplateData,
            getTemplateTrigger: getMakeOfferTemplateTrigger,

        });

    };


    const handleMakeBid = () => {

        const getTemplateData = {

            userWalletAddress,
            collectionId,
            tokenNonce,
            payment: 0,
            bidAmount: offerAmount,

        };

        setOfferAmount(0);

        signTemplateTransaction({

            succesCallbackRoute: pathname,
            getTemplateData: getTemplateData,
            getTemplateTrigger: getMakeBidTemplateTrigger,

        });

    };

    const handleAcceptOffer = ({ offerorAddress, amount }: { offerorAddress: string, amount: number }) => {

        const getTemplateData = {

            userWalletAddress,
            collectionId,
            tokenNonce,
            offerorAddress,
            amount

        };

        signTemplateTransaction({

            succesCallbackRoute: '/account',
            getTemplateData: getTemplateData,
            getTemplateTrigger: getAcceptOfferTemplateTrigger,

        });

    };



    const handleEndAuction = () => {

        const getTemplateData = {

            userWalletAddress,
            collectionId,
            tokenNonce,

        };

        signTemplateTransaction({

            succesCallbackRoute: '/account',
            getTemplateData: getTemplateData,
            getTemplateTrigger: getEndAuctionTemplateTrigger,

        });

    };


    const handleCancelOffer = ({ amount }: { amount: number }) => {

        const getTemplateData = {

            userWalletAddress,
            collectionId,
            tokenNonce,
            amount,

        };

        signTemplateTransaction({

            succesCallbackRoute: '/account',
            getTemplateData: getTemplateData,
            getTemplateTrigger: getCancelOfferTemplateTrigger,

        });

    };

    const actionHandlerWrapper = (callback?: Function) => {

        return ({ ...rest }) => {

            if (!loggedIn) {

                dispatch(setShouldDisplayWalletSidebar(true));
                return;
            }

            callback?.({ ...rest });

        };

    };

    const actionsHandlers: { [key: string]: any } = {

        [BUY]: actionHandlerWrapper(handleBuyAction),
        [SELL]: actionHandlerWrapper(handleBuyAction),
        [MAKE_BID]: actionHandlerWrapper(handleMakeBid),
        [MAKE_OFFER]: actionHandlerWrapper(handleMakeOffer),
        [END_AUCTION]: actionHandlerWrapper(handleEndAuction),
        [WITHDRAW]: actionHandlerWrapper(handleWithdrawAction),
        [CANCEL_OFFER]: actionHandlerWrapper(handleCancelOffer),
        [ACCEPT_OFFER]: actionHandlerWrapper(handleAcceptOffer),

    };

    return (

        <div className="p-token-page">


            <div className="row center-xs u-padding-tb-spacing-9">

                <div className="col-xs-11 col-md-10">


                    <div className="row row--standard-max">

                        <div className="col-xs-12 col-md-6 p-token-page_visual-holder u-margin-bottom-spacing-4">

                            <div className="p-token-page_asset-container">


                                <img className={`p-token-page_img ${isAssetLoaded ? `` : `u-visually-hidden`}`} src={imageLink} alt="" onLoad={() => { setIsAssetLoaded(true) }} />
                                <p className={`p-token-page_img ${isAssetLoaded ? `u-visually-hidden` : ``}`}>loading asset...</p>

                            </div>

                            <div className="p-token-page_token-data u-border-radius-2 u-overflow-hidden">

                                <Collapsible
                                    transitionTime={50}
                                    className="c-accordion"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faFingerprint} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Properties
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        {attributesMocked.map((attribute: any) => {
                                            const {
                                                type,
                                                value,
                                                rarity
                                            } = attribute;
                                            return (
                                                <div className="c-property">
                                                    <div className="c-property_type">
                                                        {type}
                                                    </div>
                                                    <div className="c-property_value">
                                                        {value}
                                                    </div>
                                                    <div className="c-property_rarity">
                                                        {rarity}% have this trait
                                                    </div>
                                                </div>
                                            );
                                        })}


                                    </div>


                                </Collapsible>

                                <Collapsible
                                    transitionTime={50}
                                    className="c-accordion"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faThList} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                About collection
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        <p className="u-text-small mb-8">

                                            <span className="u-text-theme-gray-light">
                                                {descriptionMocked}
                                            </span>

                                        </p>
                                        {/* 
                                        <ul className="c-icon-band">
                                            {
                                                websiteLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={websiteLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faIcons.faGlobe} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                twitterLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={twitterLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faTwitter} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                discordLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={discordLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faDiscord} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                telegramLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={telegramLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faTelegram} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                instagramLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={telegramLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faInstagram} />
                                                    </a>
                                                </li>
                                            }

                                        </ul> */}






                                    </div>


                                </Collapsible>


                                <Collapsible
                                    transitionTime={50}
                                    className="c-accordion"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faAddressCard} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Details
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        {/* <p className="flex justify-between u-text-small my-3">

                                            <span className="u-text-theme-gray-light">
                                                Creator Address
                                            </span>

                                            <span className="u-text-theme-gray-mid">
                                                <Link to={'/'}>
                                                    {creatorShortWalletAddress}
                                                </Link>
                                            </span>

                                            </p>
                                        */}

                                        <p className="flex justify-between u-text-small my-3">

                                            <span className="u-text-theme-gray-light">
                                                Token ID
                                            </span>

                                            <span className="u-text-theme-gray-mid">
                                                {collectionId}
                                            </span>

                                        </p>



                                        <p className="flex justify-between u-text-small my-3">

                                            <span className="u-text-theme-gray-light">
                                                Token Nonce
                                            </span>

                                            <span className="u-text-theme-gray-mid">
                                                {tokenNonce}
                                            </span>

                                        </p>




                                        <p className="flex justify-between u-text-small my-3">

                                            <span className="u-text-theme-gray-light">
                                                Token Standard
                                            </span>

                                            <span className="u-text-theme-gray-mid">
                                                {'ERD-721'}
                                            </span>

                                        </p>


                                        <p className="flex justify-between u-text-small my-3">

                                            <span className="u-text-theme-gray-light">
                                                Blockchain
                                            </span>

                                            <span className="u-text-theme-gray-mid">
                                                {'Elrond'}
                                            </span>

                                        </p>



                                    </div>


                                </Collapsible>

                            </div>

                        </div>


                        <div className="col-xs-12 col-md-6">

                            <div className="">

                                {/* <p className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small">
                                    <Link to={`/collection/${collectionId}`}>{collectionName}</Link>
                                </p> */}

                                <h2 className="u-regular-heading u-text-bold u-margin-bottom-spacing-5">
                                    {tokenName}
                                </h2>

                                <p className="u-margin-bottom-spacing-5 u-text-small">
                                    <span className="u-text-theme-gray-mid">Owned by </span> <Link to={`/profile/${ownerWalletAddress}`}>{displayedOwner}</Link>
                                </p>

                            </div>

                            <div className="u-border-radius-2 u-overflow-hidden my-10">

                                <Collapsible

                                    open={true}
                                    triggerDisabled={true}
                                    transitionTime={50}
                                    classParentString="c-accordion"
                                    trigger={

                                        isAuction ?
                                            <div className="c-accordion_trigger">
                                                <span className="c-accordion_trigger_icon">
                                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link u-text-theme-gray-mid" icon={faIcons.faClock} />
                                                </span>



                                                {
                                                    !isAuctionOngoing && <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">Sale has ended</p>
                                                }

                                                {
                                                    isAuctionOngoing &&
                                                    <div className="w-full">
                                                        {/* <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                                            Auction time left: {moment(auctionStartTime).to(moment(auctionDeadline))}
                                                        </p> */}
                                                        {auctionDeadline &&
                                                            <>
                                                                <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                                                    Sale starts {auctionStartTimeTitle.format("MMM Do, YYYY HH:mm")}
                                                                </p>
                                                                {/* <hr className="my-2" /> */}
                                                            </>
                                                        }
                                                        <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                                            Sale ends {auctionDeadlineTitle.format("MMM Do, YYYY HH:mm")}
                                                        </p>
                                                    </div>

                                                }

                                            </div>
                                            :
                                            <div className="c-accordion_trigger">
                                                <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                                    Fixed price
                                                </p>
                                            </div>

                                    }>

                                    <div className="c-accordion_content" >

                                        {
                                            isOnSale &&
                                            <>
                                                <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                                    {onSaleText}
                                                </p>
                                                <p className="u-margin-bottom-spacing-3">

                                                    <span className="u-regular-heading u-text-bold u-text-theme-gray-light">
                                                        {tokenPrice} {' '}
                                                    </span>
                                                    <span className="u-text-bold u-text-theme-gray-mid">
                                                        {' '}EGLD {' '}
                                                    </span>
                                                    <span className="u-text-theme-gray-mid">
                                                        (${priceTokenDollarsFixed})
                                                    </span>

                                                </p>
                                            </>
                                        }

                                        {
                                            !isOnSale &&
                                            <div>
                                                <Link to={`/token/${walletAddressParam}/${collectionId}/${tokenNonce}/sell`} className="c-button c-button--primary u-margin-right-spacing-2">
                                                    <span className="u-padding-right-spacing-2">
                                                        <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                                    </span>
                                                    <span>
                                                        Sale
                                                    </span>
                                                </Link>
                                            </div>
                                        }

                                        {
                                            (isOnSale && isCurrentTokenOwner && !(!isAuctionOngoing && hasBidderWinner)) &&
                                            <button onClick={actionsHandlers[WITHDRAW]} className="c-button c-button--primary u-margin-right-spacing-2">
                                                <span className="u-padding-right-spacing-2">
                                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                                </span>
                                                <span>
                                                    Widthdraw
                                                </span>
                                            </button>
                                        }

                                        {

                                            (shouldDisplayEndAuctionButton) &&
                                            <button onClick={actionsHandlers[END_AUCTION]} className="c-button c-button--primary u-margin-right-spacing-2">
                                                <span className="u-padding-right-spacing-2">
                                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                                </span>
                                                <span>
                                                    End auction
                                                </span>
                                            </button>
                                        }

                                        {
                                            (isOnSale && !isCurrentTokenOwner) &&
                                            <div>

                                                {
                                                    isListed && <button onClick={actionsHandlers[BUY]} className="c-button c-button--primary u-margin-right-spacing-2">
                                                        <span className="u-padding-right-spacing-2">
                                                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                                        </span>
                                                        <span>
                                                            Buy now
                                                        </span>
                                                    </button>
                                                }

                                                {
                                                    (isAuction && isAuctionOngoing) &&
                                                    <Popup
                                                        modal
                                                        className="c-modal_container"
                                                        trigger={
                                                            <button className="c-button c-button--primary u-margin-right-spacing-2">
                                                                <span className="u-padding-right-spacing-2">
                                                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faTag} />
                                                                </span>
                                                                <span>
                                                                    Place bid
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

                                                                <div className="c-modal_header text-2xl  pb-6 "> Place bid </div>
                                                                <div className="c-modal_content">

                                                                    <div className="px-10 pt-8">

                                                                        <input onChange={(e: any) => { setOfferAmount(e.target.value); }} placeholder="Bid amount (EGLD)" type="number" className="bg-opacity-10 mb-8 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />

                                                                        <div className="text-center">
                                                                            <button onClick={actionsHandlers[MAKE_BID]} className="c-button c-button--primary u-margin-right-spacing-2">

                                                                                <span>
                                                                                    Send bid
                                                                                </span>
                                                                            </button>

                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )}
                                                    </Popup>

                                                }

                                                {
                                                    !(isAuction && hasBidderWinner) &&
                                                    <Popup
                                                        modal
                                                        className="c-modal_container"
                                                        trigger={
                                                            <button className="c-button  c-button--secondary u-margin-top-spacing-2">
                                                                <span className="u-padding-right-spacing-2">
                                                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faTag} />
                                                                </span>
                                                                <span>
                                                                    Make offer
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

                                                                <div className="c-modal_header text-2xl  pb-6 "> Make an offer </div>
                                                                <div className="c-modal_content">

                                                                    <div className="px-10 pt-8">

                                                                        <input onChange={(e: any) => { setExpireOffer(e.target.value); }} placeholder="seconds" type="number" className="bg-opacity-10 mb-8 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                                                        <input onChange={(e: any) => { setOfferAmount(e.target.value); }} placeholder="Offer amount (EGLD)" type="number" className="bg-opacity-10 mb-8 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />


                                                                        <div className="text-center">
                                                                            <button onClick={actionsHandlers[MAKE_OFFER]} className="c-button c-button--primary u-margin-right-spacing-2">

                                                                                <span>
                                                                                    Send Offer
                                                                                </span>
                                                                            </button>

                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        )}
                                                    </Popup>
                                                }
                                            </div>
                                        }



                                    </div>


                                </Collapsible>


                            </div>


                            <div className="u-border-radius-2 u-overflow-hidden my-10">

                                <Collapsible
                                    transitionTime={50}
                                    classParentString="c-accordion c-accordion--no-content-padding"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faTags} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Listings
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        {/* <div className="py-10">
                                            <p className="u-tac u-margin-bottom-spacing-4">

                                                <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

                                            </p>

                                            <p className="u-text-small u-tac u-text-theme-gray-mid">No listings yet</p>
                                        </div> */}

                                        <Table className="c-table" rowClassName="c-table_row" columns={listingTableColumns} data={mapListingTableData()} />


                                    </div>


                                </Collapsible>

                            </div>

                            <div className="u-border-radius-2 u-overflow-hidden my-10">

                                <Collapsible
                                    transitionTime={50}
                                    classParentString="c-accordion c-accordion--no-content-padding"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faList} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Offers
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >

                                        {Boolean(mapOffersTableData) ?

                                            <Table className="c-table" rowClassName="c-table_row" columns={offersTableColumns} data={mapOffersTableData} />

                                            : <div className="py-10">

                                                <p className="u-tac u-margin-bottom-spacing-4">

                                                    <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

                                                </p>

                                                <p className="u-text-small u-tac u-text-theme-gray-mid">No offers yet</p>

                                            </div>
                                        }


                                    </div>


                                </Collapsible>

                            </div>

                            <div className="u-border-radius-2 u-overflow-hidden my-10">

                                <Collapsible
                                    transitionTime={50}
                                    classParentString="c-accordion c-accordion--no-content-padding"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faGavel} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Bids
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        {mapBidsTableData ?

                                            <Table className="c-table" rowClassName="c-table_row" columns={bidsTableColumns} data={mapBidsTableData} />

                                            : <div className="py-10">

                                                <p className="u-tac u-margin-bottom-spacing-4">

                                                    <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

                                                </p>

                                                <p className="u-text-small u-tac u-text-theme-gray-mid">No bids yet</p>

                                            </div>
                                        }


                                    </div>


                                </Collapsible>

                            </div>


                            <div className="u-border-radius-2 u-overflow-hidden my-10">

                                <Collapsible
                                    transitionTime={50}
                                    classParentString="c-accordion"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faChartLine} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Price History
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content h-96" >

                                        {chartData ?
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart
                                                    width={500}
                                                    height={300}
                                                    data={chartData}
                                                    margin={{
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <XAxis dy={15} dataKey="name" />
                                                    <YAxis dx={-15} interval={0} />
                                                    <Tooltip labelStyle={{ backgroundColor: "transparent" }} />
                                                    <CartesianGrid vertical={false} stroke="#000" />

                                                    <Line type="monotone" dataKey="pv" stroke="#2081e2" strokeWidth={3} activeDot={{ r: 8 }} />

                                                </LineChart>
                                            </ResponsiveContainer>
                                            : <div className="py-10">

                                                <p className="u-tac u-margin-bottom-spacing-4">

                                                    <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

                                                </p>

                                                <p className="u-text-small u-tac u-text-theme-gray-mid">No bids yet</p>

                                            </div>

                                        }

                                    </div>


                                </Collapsible>

                            </div>





                        </div>


                    </div>

                    <div className="row row--standard-max">

                        <div className="col-xs-12 my-12">

                            <div className="u-border-radius-2 u-overflow-hidden">

                                <Collapsible
                                    transitionTime={50}
                                    classParentString="c-accordion c-accordion--no-content-padding"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faExchangeAlt} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Token Activity
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        <Table className="c-table" rowClassName="c-table_row" columns={activityTableColumns} data={mapActivityTableData()} />


                                    </div>


                                </Collapsible>

                            </div>

                        </div>

                        <div className="col-xs-12 u-tac">

                            {
                                collectionId &&
                                <Link to={`/collection/${collectionId}`} className="c-button  c-button--secondary u-margin-top-spacing-2">
                                    View Collection
                                </Link>
                            }

                        </div>

                    </div>


                </div>

            </div>

        </div>
    );
};

export default TokenPage;
