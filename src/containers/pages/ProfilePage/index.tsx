import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from 'react-collapsible';
import { useLocation, Link, useParams, useHistory } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrands from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetBuyNftTemplateMutation, useGetListNftTemplateMutation } from 'services/tx-template';
import { useGetTokenDataQuery, useLazyGetTokenDataQuery } from "services/tokens";
import { prepareTransaction } from "utils/transactions";

import { UrlParameters } from "./interfaces";
import { useGetEgldPriceQuery } from "services/oracle";
import { shorterAddress } from "utils";
import { BUY } from "constants/actions";
import { useGetAccountGatewayTokensMutation, useGetAccountTokensMutation } from "services/accounts";


export const ProfilePage: (props: any) => any = ({ }) => {

    const history = useHistory();
    const { collectionId, tokenNonce } = useParams<UrlParameters>();
    const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);

    const [requestedAmount, setRequestedAmount] = useState<number | undefined>(undefined);

    const {
        loggedIn,
        address: userWalletAddress,
    } = Dapp.useContext();

    const shortUserWalletAddress: string = shorterAddress(userWalletAddress, 7, 4);


    const sendTransaction = Dapp.useSendTransaction();


    const [getTokenDataTrigger, {
        data: tokenResponse,
        isError: isErrorGetTokenDataQuery,
        isSuccess: isSuccessGetTokenDataQuery,
        isLoading: isLoadingGetTokenDataQuery,
        isUninitialized: isUninitializedGetRokenDataQuery,

    }] = useLazyGetTokenDataQuery();

    const [getAccountTokensRequestTrigger, {
        data: accountTokensData, }] = useGetAccountTokensMutation();

    const [getAccountGatewayRequestTrigger, {
        data: accountGatewayData,
    }] = useGetAccountGatewayTokensMutation();

    useEffect(() => {

        getAccountTokensRequestTrigger({ userAddress: userWalletAddress, offset: 0, limit: 20 });

        getAccountGatewayRequestTrigger({ userAddress: userWalletAddress });


    }, []);

    // if (!accountTokensData) {

    //     return (<p>Loading...</p>);

    // }

    return (

        <div className="p-profile-page">

            <div className="grid grid-cols-12">



                <div className="col-span-12">
                    <div className="bg-gray-800 w-full h-60">

                    </div>
                </div>


                <div className="col-span-12 flex justify-center mb-10 pb-16 relative">
                    <div className="-bottom-1/4 absolute bg-yellow-700 border border-black h-40 rounded-circle w-40">

                    </div>
                </div>


                <div className="col-span-12 text-center mb-6">

                    <h2 className="u-regular-heading u-text-bold">
                        Unnamed
                    </h2>

                    <p className="u-text-theme-gray-mid ">
                        {shortUserWalletAddress}
                    </p>

                    <p className="u-text-theme-gray-mid">
                        Joined Novemeber 2021
                    </p>

                </div>


                <div className="col-start-2 col-span-10 my-20">

                    <div className="grid grid-cols-12">

                        <div className="col-span-12">

                            <Collapsible
                                transitionTime={50}
                                open={true}
                                className="c-accordion"
                                trigger={

                                    <div className="c-accordion_trigger">
                                        <span className="c-accordion_trigger_icon">
                                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faClipboardList} />
                                        </span>
                                        <span className="c-accordion_trigger_title">
                                            Listed <span className="u-text-theme-gray-mid">- on Erdsea</span>
                                        </span>
                                    </div>

                                }>

                                <div className="c-accordion_content bg-transparent" >

                                    <div className="grid grid-cols-12">

                                        {accountTokensData?.data && accountTokensData.data.map((tokenData: any) => {

                                            const { imageLink, tokenName, tokenId, nonce } = tokenData;

                                            return (
                                                <div className="col-span-3 mr-8 mb-8">

                                                    <Link to={`/token/${tokenId}/${nonce}`}>

                                                        <div className={`c-card`}>

                                                            <div className="c-card_img-container">
                                                                <img src={imageLink} className="c-card_img" alt="" onLoad={() => { setIsAssetLoaded(true) }} />
                                                            </div>

                                                            <div className="c-card_info justify-between">

                                                                <div className="c-card_details">
                                                                    <div>
                                                                        <p className="c-card_title">
                                                                            <Link to={`/collection/${collectionId}`}>
                                                                                {'collectionName'}
                                                                            </Link>
                                                                        </p>
                                                                        <p className="c-card_collection-name">
                                                                            {tokenName}
                                                                        </p>
                                                                    </div>

                                                                </div>


                                                            </div>
                                                        </div>

                                                    </Link>

                                                </div>
                                            )

                                        })}

                                    </div>


                                </div>

                            </Collapsible>



                            <Collapsible
                                transitionTime={50}
                                open={true}
                                className="c-accordion"
                                trigger={

                                    <div className="c-accordion_trigger">
                                        <span className="c-accordion_trigger_icon">
                                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faListAlt} />
                                        </span>
                                        <span className="c-accordion_trigger_title">
                                            Not listed <span className="u-text-theme-gray-mid">- in your wallet</span>
                                        </span>
                                    </div>

                                }>


                                <div className="c-accordion_content bg-transparent" >

                                    <div className="grid grid-cols-12">
{/* 
                                        {accountGatewayData?.erdNfts.map((tokenData: any) => {

                                            console.log({
                                                tokenData
                                            });

                                            return;

                                            const { imageLink, tokenName, tokenId, nonce } = tokenData;

                                            return (
                                                <div className="col-span-3 mr-8 mb-8">

                                                    <Link to={`/token/${tokenId}/${nonce}`}>

                                                        <div className={`c-card`}>

                                                            <div className="c-card_img-container">
                                                                <img src={imageLink} className="c-card_img" alt="" onLoad={() => { setIsAssetLoaded(true) }} />
                                                            </div>

                                                            <div className="c-card_info justify-between">

                                                                <div className="c-card_details">
                                                                    <div>
                                                                        <p className="c-card_title">
                                                                            <Link to={`/collection/${collectionId}`}>
                                                                                {'collectionName'}
                                                                            </Link>
                                                                        </p>
                                                                        <p className="c-card_collection-name">
                                                                            {tokenName}
                                                                        </p>
                                                                    </div>

                                                                </div>


                                                            </div>
                                                        </div>

                                                    </Link>

                                                </div>
                                            )

                                        })}

                                        {accountGatewayData?.restNfts.map((tokenData: any) => {

                                            console.log({
                                                tokenData
                                            });

                                            return;

                                            const { imageLink, tokenName, tokenId, nonce } = tokenData;

                                            return (
                                                <div className="col-span-3 mr-8 mb-8">

                                                    <Link to={`/token/${tokenId}/${nonce}`}>

                                                        <div className={`c-card`}>

                                                            <div className="c-card_img-container">
                                                                <img src={imageLink} className="c-card_img" alt="" onLoad={() => { setIsAssetLoaded(true) }} />
                                                            </div>

                                                            <div className="c-card_info justify-between">

                                                                <div className="c-card_details">
                                                                    <div>
                                                                        <p className="c-card_title">
                                                                            <Link to={`/collection/${collectionId}`}>
                                                                                {'collectionName'}
                                                                            </Link>
                                                                        </p>
                                                                        <p className="c-card_collection-name">
                                                                            {tokenName}
                                                                        </p>
                                                                    </div>

                                                                </div>


                                                            </div>
                                                        </div>

                                                    </Link>

                                                </div>
                                            )

                                        })} */}

                                    </div>


                                </div>


                            </Collapsible>



                        </div>

                    </div>



                </div>

            </div>

        </div>
    );
};

export default ProfilePage;
