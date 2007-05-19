import Popup from 'reactjs-popup';
import Table from 'rc-table';
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from 'react-collapsible';
import { useLocation, Link, useParams } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrands from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetBuyNftTemplateMutation } from 'services/tx-template';
import { useGetTokenDataQuery, useLazyGetTokenDataQuery } from "services/tokens";
import { prepareTransaction } from "utils/transactions";

import { UrlParameters } from "./interfaces";
import { useGetEgldPriceQuery } from "services/oracle";
import { shorterAddress } from "utils";
import { BUY, SELL } from "constants/actions";
import { useAppDispatch } from "redux/store";
import { setShouldDisplayWalletSidebar } from "redux/slices/ui";



export const TokenPage: (props: any) => any = ({ }) => {

    const dispatch = useAppDispatch();
    const { pathname } = useLocation();
    const { collectionId, tokenNonce } = useParams<UrlParameters>();

    const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);

    const {
        loggedIn,
        address: userWalletAddress,
        account: {
            address: userAccountAddress
        }
    } = Dapp.useContext();

    const sendTransaction = Dapp.useSendTransaction();


    const [getTokenDataTrigger, {
        data: tokenResponse,
        isError: isErrorGetTokenDataQuery,
        isSuccess: isSuccessGetTokenDataQuery,
        isLoading: isLoadingGetTokenDataQuery,
        isUninitialized: isUninitializedGetRokenDataQuery,

    }] = useLazyGetTokenDataQuery();

    const {

        data: egldPriceData,
        isError: isErrorEgldPriceQuery,
        isLoading: isLoadingEgldPriceQuery,
        isSuccess: isSuccessEgldPriceQuery,

    } = useGetEgldPriceQuery();

    const isEgldPriceFetched: boolean = isSuccessEgldPriceQuery && Boolean(egldPriceData);
    const isTokenDataFetched: boolean = isSuccessGetTokenDataQuery && Boolean(tokenResponse);
    const shouldRenderPage: boolean = isTokenDataFetched && isEgldPriceFetched;

    const [getBuyNftTemplateQueryTrigger, { data: buyNftTemplateData }] = useGetBuyNftTemplateMutation();

    useEffect(() => {

        getTokenDataTrigger({ collectionId, tokenNonce });

    }, []);

    if (!shouldRenderPage) {

        return (<p>Loading...</p>);

    }

    const { data: tokenData } = tokenResponse;

    const {

        token,
        ownerName,
        collection,
        creatorName,
        ownerWalletAddress,
        creatorWalletAddress, } = tokenData;

    const {
        id: tokenId,
        imageLink,
        tokenName,
        attributes,
        priceNominal,
        state: tokenState,
        priceNominal: tokenPrice } = token;

    const {

        description,
        discordLink,
        twitterLink,
        telegramLink,
        instagramLink,
        website: websiteLink,
        name: collectionName,

    } = collection;


    const isListed: boolean = tokenState === 'List';
    const isAuction: boolean = tokenState === 'Auction';
    const isOnSale: boolean = isListed && isAuction;


    const ownerShortWalletAddress: string = shorterAddress(ownerWalletAddress, 7, 4);
    const creatorShortWalletAddress: string = shorterAddress(creatorWalletAddress, 7, 4);

    console.log({
        ownerName,
        ownerWalletAddress,
        userAccountAddress
    });


    const displayedOwner = Boolean(ownerName) ? ownerName : ownerShortWalletAddress;
    const displayedCreator = creatorName ? creatorName : creatorShortWalletAddress;


    const isCurrentTokenOwner: boolean = ownerWalletAddress === userAccountAddress;


    const { data: egldPriceString } = egldPriceData;
    const priceTokenDollars = tokenPrice * parseFloat(egldPriceString);
    const priceTokenDollarsFixed = parseFloat(`${priceTokenDollars}`).toFixed(3);


    const offersTableColumns = [{
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
    }];



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


    const mapOffersTableData = () => {

        const data = [{
            price: '1.54',
            expiration: <span className="u-text-theme-gray-mid">in 2 days</span>,
            from: <a href="#">cryptolegend</a>,
            key: `key-${1}`
        }, {
            price: '3',
            expiration: <span className="u-text-theme-gray-mid">in 10 days</span>,
            from: <a href="#">PinkyBoy</a>,
            key: `key-${2}`
        }, {
            price: '3.14',
            expiration: <span className="u-text-theme-gray-mid">in 22 days</span>,
            from: <a href="#">cryptolegend</a>,
            key: `key-${3}`
        }]

        return data;

    }


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


    const mapBidsTableData = () => {

        const tx = `da7efdbdaef6fc268ad307b7ae6abce0c5d88f259e89d052c0d684d65d97f5d4`;

        const data = [{
            price: '5',
            date: <div>
                <a href="#">
                    20 minutes ago {` `}
                    <FontAwesomeIcon width={'10px'} className="" icon={faIcons.faExternalLinkAlt} />
                </a>
            </div>,
            from: <a href="#">cryptolegend</a>,
            key: `key-${1}`
        }, {
            price: '3',
            date: <div>
                <a href="#">
                    20 minutes ago {` `}
                    <FontAwesomeIcon width={'10px'} className="" icon={faIcons.faExternalLinkAlt} />
                </a>
            </div>,
            from: <a href="#">PinkyBoy</a>,
            key: `key-${2}`
        }, {
            price: '1',
            date: <div>
                <a href="#">
                    20 minutes ago {` `}
                    <FontAwesomeIcon width={'10px'} className="" icon={faIcons.faExternalLinkAlt} />
                </a>
            </div>,
            from: <a href="#">cryptolegend</a>,
            key: `key-${3}`
        }]

        return data;

    }

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

    }


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


        const getBuyNFTResponse: any = await getBuyNftTemplateQueryTrigger({ userWalletAddress, collectionId, tokenNonce, price: priceNominal });

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
            callbackRoute: pathname
        });


    }

    const actionHandlerWrapper = (callback?: Function) => {

        return () => {

            if (!loggedIn) {

                dispatch(setShouldDisplayWalletSidebar(true));
                return;
            }

            callback?.();

        };

    };

    const actionsHandlers = {

        [BUY]: actionHandlerWrapper(handleBuyAction),
        [SELL]: actionHandlerWrapper(handleBuyAction),

    }

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
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faTwitch} />
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

                                        </ul>






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


                                        <p className="flex justify-between u-text-small my-3">

                                            <span className="u-text-theme-gray-light">
                                                Creator Address
                                            </span>

                                            <span className="u-text-theme-gray-mid">
                                                <Link to={'/'}>
                                                    {creatorShortWalletAddress}
                                                </Link>
                                            </span>

                                        </p>


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

                                <p className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small">
                                    <Link to={`/collection/${collectionId}`}>{collectionName}</Link>
                                </p>

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
                                                <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                                    Sale ends November 11, 2022 at 12:35AM
                                                </p>
                                            </div>
                                            :
                                            <div className="c-accordion_trigger"></div>

                                    }>

                                    <div className="c-accordion_content" >

                                        {
                                            isOnSale &&
                                            <> <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                                Current price
                                            </p>
                                                <p className="u-margin-bottom-spacing-3">

                                                    {/* <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link u-text-theme-gray-mid" icon={faIcons.facoin} /> {` `} */}

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
                                                <Link to={`${pathname}/sell`} className="c-button c-button--primary u-margin-right-spacing-2">
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
                                            (isOnSale && isCurrentTokenOwner) &&
                                            <div>
                                                <Link to={`${pathname}/sell`} className="c-button c-button--primary u-margin-right-spacing-2">
                                                    <span className="u-padding-right-spacing-2">
                                                        <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                                    </span>
                                                    <span>
                                                        Widthdraw
                                                    </span>
                                                </Link>
                                            </div>
                                        }

                                        {
                                           (isOnSale && !isCurrentTokenOwner) &&
                                            <div>

                                                <button onClick={actionsHandlers[BUY]} className="c-button c-button--primary u-margin-right-spacing-2">
                                                    <span className="u-padding-right-spacing-2">
                                                        <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                                    </span>
                                                    <span>
                                                        Buy now
                                                    </span>
                                                </button>


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
                                                                    <input placeholder="Amount (EGLD)" type="number" className="bg-opacity-10 mb-8 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />


                                                                    <div className="text-center">
                                                                        <button onClick={actionsHandlers[BUY]} className="c-button c-button--primary u-margin-right-spacing-2">

                                                                            <span>
                                                                                Make Offer
                                                                            </span>
                                                                        </button>

                                                                    </div>

                                                                </div>

                                                            </div>
                                                        </div>
                                                    )}
                                                </Popup>

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

                                        {/* <div className="py-10">

                                            <p className="u-tac u-margin-bottom-spacing-4">

                                                <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

                                            </p>

                                            <p className="u-text-small u-tac u-text-theme-gray-mid">No offers yet</p>

                                        </div> */}

                                        <Table className="c-table" rowClassName="c-table_row" columns={offersTableColumns} data={mapOffersTableData()} />

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

                                        {/* <div className="py-10">

            <p className="u-tac u-margin-bottom-spacing-4">

                <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

            </p>

            <p className="u-text-small u-tac u-text-theme-gray-mid">No offers yet</p>

        </div> */}

                                        <Table className="c-table" rowClassName="c-table_row" columns={bidsTableColumns} data={mapBidsTableData()} />

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
                                                <Tooltip />
                                                <CartesianGrid vertical={false} stroke="#000" />

                                                <Line type="monotone" dataKey="pv" stroke="#2081e2" strokeWidth={3} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>

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
