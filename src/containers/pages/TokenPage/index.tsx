import { useEffect } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from 'react-collapsible';
import { useLocation, Link, useParams } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLazyGetBuyNftTemplateQuery, useLazyGetListNftTemplateQuery } from 'services/tx-template';
import { useGetTokenDataQuery } from "services/tokens";
import { prepareTransaction } from "utils/transactions";

import { UrlParameters } from "./interfaces";


export const TokenPage: (props: any) => any = ({ }) => {


    const { collectionId, tokenNonce } = useParams<UrlParameters>();

    const { data: tokenData, isLoading: isLoadingGetTokenDataQuery, isError, isSuccess } = useGetTokenDataQuery({ collectionId, tokenNonce });


    // console.log({
    //     tokenData,
    //     isError, isSuccess
    // });


    const sendTransaction = Dapp.useSendTransaction();


    const tokenPrice = 0.05;
    const tokenPriceToUSD = 102.24;
    const tokenName = 'Titan Speciak';
    const collectionName = 'Giant Titans';
    const collectionLink = 'gigants';
    const ownerName = '69branco';

    const { loggedIn, address: userWalletAddress, account } = Dapp.useContext();

    const [getBuyNftTemplateQueryTrigger, { data: buyNftTemplateData }] = useLazyGetBuyNftTemplateQuery();
    const [getListNftTemplateQueryTrigger, { data: listNftTemplateData }] = useLazyGetListNftTemplateQuery();

    console.log({
        listNftTemplateData
    });


    const handleBuyAction = () => {


        // if (Boolean(buyNftTemplateData)) {



        //     const {
        //         value,
        //         ...rest
        //     } = buyNftTemplateData.data


        //     const unconsumedTransaction = prepareTransaction({
        //         value: 1,
        //         ...rest,
        //     });

        //     console.log({
        //         unconsumedTransaction
        //     });


        //     sendTransaction({
        //         transaction: unconsumedTransaction,
        //         callbackRoute: ''
        //     });


        // }


        // const price = 1;
        // const tokenNone = 1;
        // const collectionId = 'WAMEN-083b50';

        // getBuyNftTemplateQueryTrigger({ userWalletAddress, collectionId, tokenNone, price });

        // console.log({
        //     buyNftTemplateData
        // });



        if (Boolean(listNftTemplateData)) {

            console.log({
                listNftTemplateData
            });


            const {
                value,
                ...rest
            } = listNftTemplateData.data




            const unconsumedTransaction = prepareTransaction({
                value: 0,
                ...rest,
                receiver: userWalletAddress,
            });

            console.log({
                unconsumedTransaction
            });


            sendTransaction({
                transaction: unconsumedTransaction,
                callbackRoute: ''
            });


        }


        const price = 1;
        const tokenNone = 1;
        const collectionId = 'WAMEN-083b50';

        getListNftTemplateQueryTrigger({ userWalletAddress, collectionId, tokenNone, price });




    }


    if (isLoadingGetTokenDataQuery) {

        return <p>Loading...</p>

    }

    return (

        <div className="p-token-page">


            <div className="row center-xs u-padding-tb-spacing-9">

                <div className="col-xs-11 col-md-10">


                    <div className="row row--standard-max">

                        <div className="col-xs-12 col-md-6 p-token-page_visual-holder u-margin-bottom-spacing-4">

                            <div className="p-token-page_asset-container">

                                <img className="p-token-page_img" src='/img/mock/token-img.png' alt="" />

                            </div>

                            <div className="p-token-page_token-data u-border-radius-2 u-overflow-hidden">


                                <Collapsible
                                    transitionTime={50}
                                    open={true}
                                    triggerDisabled={true}
                                    className="c-accordion"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faAlignJustify} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Description
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        <p className="u-text-small">

                                            <span className="u-text-theme-gray-mid">
                                                Created by {' '}
                                            </span>

                                            <span className="u-text-small">
                                                <Link to={'/'}>
                                                    7F0409
                                                </Link>
                                            </span>

                                        </p>

                                    </div>


                                </Collapsible>



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


                                        <p className="u-text-small">

                                            <span className="u-text-theme-gray-mid">
                                                Created by {' '}
                                            </span>

                                            <span className="u-text-small">
                                                <Link to={'/'}>
                                                    7F0409
                                                </Link>
                                            </span>

                                        </p>

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


                                        <p className="u-text-small">

                                            <span className="u-text-theme-gray-mid">
                                                Created by {' '}
                                            </span>

                                            <span className="u-text-small">
                                                <Link to={'/'}>
                                                    7F0409
                                                </Link>
                                            </span>

                                        </p>

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


                                        <p className="u-text-small">

                                            <span className="u-text-theme-gray-mid">
                                                Created by {' '}
                                            </span>

                                            <span className="u-text-small">
                                                <Link to={'/'}>
                                                    7F0409
                                                </Link>
                                            </span>

                                        </p>

                                    </div>


                                </Collapsible>

                            </div>

                        </div>


                        <div className="col-xs-12 col-md-6">

                            <div className="">

                                <p className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small">
                                    <Link to={`/collection/${collectionLink}`}>{collectionName}</Link>
                                </p>

                                <h2 className="u-regular-heading u-text-bold u-margin-bottom-spacing-5">
                                    {tokenName}
                                </h2>

                                <p className="u-margin-bottom-spacing-5 u-text-small">
                                    <span className="u-text-theme-gray-mid">Owned by </span> <Link to={`/profile/${ownerName}`}>{ownerName}</Link>
                                </p>

                            </div>

                            <div className="u-bg-theme-details-section u-padding-spacing-4 u-border-radius-2 u-margin-bottom-spacing-4">

                                <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                    Current price
                                </p>
                                <p className="u-margin-bottom-spacing-3">
                                    <span className="u-regular-heading u-text-bold u-text-theme-gray-light">
                                        {tokenPrice}
                                    </span>
                                    <span className="u-text-theme-gray-mid">
                                        (${tokenPriceToUSD})
                                    </span>
                                </p>

                                <p >

                                    <button onClick={handleBuyAction} className="c-button c-button--primary u-margin-right-spacing-2">
                                        <span className="u-padding-right-spacing-2">
                                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                        </span>
                                        <span>
                                            Buy now
                                        </span>
                                    </button>
                                    <button className="c-button  c-button--secondary u-margin-top-spacing-2">
                                        <span className="u-padding-right-spacing-2">
                                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faTag} />
                                        </span>
                                        <span>
                                            Make offer
                                        </span>
                                    </button>

                                </p>

                            </div>


                            <div className="u-border-radius-2 u-overflow-hidden u-margin-bottom-spacing-4">

                                <Collapsible
                                    transitionTime={50}
                                    className="c-accordion"
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


                                        <p className="u-tac u-margin-bottom-spacing-4">

                                            <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

                                        </p>

                                        <p className="u-text-small u-tac u-text-theme-gray-mid">No listings yet</p>

                                    </div>


                                </Collapsible>

                            </div>

                            <div className="u-border-radius-2 u-overflow-hidden">

                                <Collapsible
                                    transitionTime={50}
                                    className="c-accordion"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faTags} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Offers
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        <p className="u-tac u-margin-bottom-spacing-4">

                                            <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

                                        </p>

                                        <p className="u-text-small u-tac u-text-theme-gray-mid">No offers yet</p>

                                    </div>


                                </Collapsible>

                            </div>

                        </div>


                    </div>

                    <div className="row row--standard-max">

                        <div className="col-xs-12 u-margin-bottom-spacing-4">

                            <div className="u-border-radius-2 u-overflow-hidden">

                                <Collapsible
                                    transitionTime={50}
                                    className="c-accordion"
                                    trigger={

                                        <div className="c-accordion_trigger">
                                            <span className="c-accordion_trigger_icon">
                                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faExchangeAlt} />
                                            </span>
                                            <span className="c-accordion_trigger_title">
                                                Trading History
                                            </span>
                                        </div>

                                    }>

                                    <div className="c-accordion_content" >


                                        <p className="u-text-small">

                                            <span className="u-text-theme-gray-mid">
                                                Created by {' '}
                                            </span>

                                            <span className="u-text-small">
                                                <Link to={'/'}>
                                                    7F0409
                                                </Link>
                                            </span>

                                        </p>

                                    </div>


                                </Collapsible>

                            </div>

                        </div>

                        <div className="col-xs-12 u-tac">

                            <Link to={'/'} className="c-button  c-button--secondary u-margin-top-spacing-2">
                                View Collection
                            </Link>

                        </div>

                    </div>


                </div>

            </div>

        </div>
    );
};

export default TokenPage;
