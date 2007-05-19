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
import { useGetAccountGatewayTokensMutation, useGetAccountMutation, useGetAccountTokensMutation } from "services/accounts";
import Popup from "reactjs-popup";


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

    const [getAccountRequestTrigger, {
        data: accountData,
        isLoading: isLoadingGetAccountRequest }] = useGetAccountMutation();

    const [getAccountTokensRequestTrigger, {
        data: accountTokensData,
        isLoading: isLoadingAccountTokensRequest }] = useGetAccountTokensMutation();

    const [getAccountGatewayRequestTrigger, {
        data: accountGatewayData,
        isLoading: isLoadingAccountGatewayRequest,
    }] = useGetAccountGatewayTokensMutation();

    useEffect(() => {

        getAccountRequestTrigger({ userAddress: userWalletAddress });

        getAccountTokensRequestTrigger({ userAddress: userWalletAddress, offset: 0, limit: 20 });

        getAccountGatewayRequestTrigger({ userAddress: userWalletAddress });


    }, []);

    if (isLoadingGetAccountRequest || isLoadingAccountTokensRequest || isLoadingAccountGatewayRequest) {

        return (<p>Loading...</p>);

    };


    const dateOptions: any = { year: 'numeric', month: 'long', };
    const joinnedDate: Date = new Date(accountData?.data.createdAt * 1000);
    const joinedDateFormated: string = joinnedDate.toLocaleDateString("en-US", dateOptions);

    return (

        <div className="p-profile-page">

            <div className="grid grid-cols-12">



                <div className="col-span-12">
                    <div className="bg-gray-800 w-full h-60">

                    </div>
                </div>


                <div className="col-span-12 flex justify-center mb-10 pb-16 relative">
                    <div style={{ backgroundImage: `url(${accountData?.data.profileImageLink})` }} className="-bottom-1/4 absolute bg-yellow-700 border border-black h-40 rounded-circle w-40" >
                    </div>
                </div>


                <div className="col-span-12 text-center mb-6">


                    <div className="c-icon-band">
                        <div className="c-icon-band_item">

                            <Link className="inline-block" to={`./account/settings`}>
                                <FontAwesomeIcon className="text-white" style={{ width: 25, height: 25, margin: "10px 15px" }} icon={faIcons.faUserCog} />
                            </Link>

                        </div>
                    </div>

                    <h2 className="u-regular-heading u-text-bold">
                        {
                            accountData?.data.name || 'Unnamed'
                        }
                    </h2>

                    <p className="u-text-theme-gray-mid ">
                        {shortUserWalletAddress}
                    </p>

                    {
                        accountData?.data.createdAt &&
                        <p className="u-text-theme-gray-mid">
                            Joined {joinedDateFormated}
                        </p>
                    }

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
                                            On sale
                                        </span>
                                    </div>

                                }>

                                <div className="c-accordion_content bg-transparent" >

                                    <div className="grid grid-cols-12">

                                        {accountTokensData?.data && accountTokensData.data.map((tokenData: any) => {

                                            const { collection, token } = tokenData;
                                            const { collectionName } = collection;
                                            const { imageLink, tokenName, tokenId, nonce } = token;

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
                                                                                {collectionName || tokenId}
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
                                            Unlisted
                                        </span>
                                    </div>

                                }>


                                <div className="c-accordion_content bg-transparent" >

                                    <div className="grid grid-cols-12">


                                        <div className="col-span-12">
                                            <p className="mb-4">
                                                ERD-721 NFTs
                                            </p>
                                        </div>

                                        {accountGatewayData?.erdNfts.map((tokenData: any) => {

                                            // const { imageLink, tokenName, tokenId, nonce } = tokenData;
                                            const { availableTokensData } = accountGatewayData;
                                            const { url: imageLink, name: tokenName, ticker: tokenId, nonce, identifier } = tokenData;
                                            const isTokenAvailable = Boolean(availableTokensData[identifier].token.available);
                                            const tokenLink = `/token/${tokenId}/${nonce}`;
                                            const tokenPreviewLink = `/token/${userWalletAddress}/${tokenId}/${nonce}`;
                                            const link = isTokenAvailable ? tokenLink : tokenPreviewLink;

                                            return (
                                                <div className="col-span-3 mr-8 mb-8">

                                                    <Link to={link}>

                                                        <div className={`c-card`}>

                                                            <div className="c-card_img-container">
                                                                <img src={imageLink} className="c-card_img" alt="" onLoad={() => { setIsAssetLoaded(true) }} />
                                                            </div>

                                                            <div className="c-card_info justify-between">

                                                                <div className="c-card_token-details">
                                                                    <p className="text-gray-700 text-xs">
                                                                        <Link className="text-gray-500 hover:text-gray-200" to={`/collection/${collectionId}`}>
                                                                            {'collectionName'}
                                                                        </Link>
                                                                    </p>
                                                                    <p className="text-sm u-text-bold">
                                                                        {tokenName}
                                                                    </p>
                                                                </div>


                                                            </div>
                                                        </div>

                                                    </Link>

                                                </div>
                                            )

                                        })}

                                        <div className="col-span-12 mt-12 mb-4">
                                            <p>
                                                Not ERD-721 compliant
                                            </p>
                                        </div>


                                        {accountGatewayData?.restNfts.map((tokenData: any) => {

                                            const { url: imageLink, name: tokenName, ticker: tokenId, nonce } = tokenData;

                                            return (
                                                <div className="col-span-3 mr-8 mb-8">

                                                    <Link to={`/token/${tokenId}/${nonce}`}>

                                                        <div className={`c-card`}>

                                                            <div className="c-card_img-container">
                                                                <img src={imageLink} className="c-card_img" alt="" />
                                                            </div>

                                                            <div className="c-card_info justify-between">

                                                                <div className="c-card_token-details">
                                                                    <p className="text-gray-700 text-xs">
                                                                        <Link className="text-gray-500 hover:text-gray-200" to={`/collection/${collectionId}`}>
                                                                            {'collectionName'}
                                                                        </Link>
                                                                    </p>
                                                                    <p className="text-sm u-text-bold">
                                                                        {tokenName}
                                                                    </p>
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



                        </div>

                    </div>



                </div>

            </div>

        </div>
    );
};

export default ProfilePage;
