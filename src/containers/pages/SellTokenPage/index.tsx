import Popup from 'reactjs-popup';
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


export const SellTokenPage: (props: any) => any = ({ }) => {

    const history = useHistory();
    const { collectionId, tokenNonce } = useParams<UrlParameters>();
    const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);

    const [requestedAmount, setRequestedAmount] = useState<number | undefined>(undefined);

    const {
        loggedIn,
        address: userWalletAddress,
        account: {
            address: userAccountAddress
        }
    } = Dapp.useContext();

    const sendTransaction = Dapp.useSendTransaction();


    const handleChangeRequestedAmount = (e: any) => {

        setRequestedAmount(e.target.value);

    }

    const [getTokenDataTrigger, {
        data: tokenResponse,
        isError: isErrorGetTokenDataQuery,
        isSuccess: isSuccessGetTokenDataQuery,
        isLoading: isLoadingGetTokenDataQuery,
        isUninitialized: isUninitializedGetRokenDataQuery,

    }] = useLazyGetTokenDataQuery();

    const isTokenDataFetched: boolean = isSuccessGetTokenDataQuery && Boolean(tokenResponse);
    const shouldRenderPage: boolean = isTokenDataFetched;

    const [getListNftTemplateQueryTrigger, { data: listNftTemplateData }] = useGetListNftTemplateMutation();


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


    const ownerShortWalletAddress: string = shorterAddress(ownerWalletAddress, 7, 4);
    const creatorShortWalletAddress: string = shorterAddress(creatorWalletAddress, 7, 4);
    const displayedOwner = ownerName ? ownerName : ownerShortWalletAddress;
    const displayedCreator = creatorName ? creatorName : creatorShortWalletAddress;
    const isCurrentTokenOwner: boolean = ownerWalletAddress === userAccountAddress;

    if (!isCurrentTokenOwner) {

        history.replace(`/token/${collectionId}/${tokenNonce}`);

    }

    const handleSubmitListing = async (e: any) => {

        e.preventDefault();

        const listNftResponse: any = await getListNftTemplateQueryTrigger({ userWalletAddress, collectionId, tokenNonce, price: requestedAmount });

        if (listNftResponse.error) {

            const { status, data: { error } } = listNftResponse.error;

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


        const { data: listNftData } = listNftResponse.data;

        const unconsumedTransaction = prepareTransaction(listNftData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: window.location.pathname
        });


    }


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

                                        <div className="c-switcher-action_option align-items-center col-span-6 flex flex-col py-10 ">

                                            <FontAwesomeIcon className="text-2xl mb-3" icon={faIcons.faDollarSign} />

                                            <span className="u-text-bold">
                                                Fixed price
                                            </span>

                                        </div>

                                        <div className="c-switcher-action_option c-switcher-action_option--active align-items-center col-span-6 flex flex-col py-10">

                                            <FontAwesomeIcon className="text-2xl mb-3" icon={faIcons.faClock} />

                                            <span className="u-text-bold">
                                                Auction
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                <div>

                                    <p className="flex justify-between u-text-small mb-2">

                                        <span className="u-text-theme-gray-light">
                                            Price
                                        </span>

                                        <span className="u-text-theme-gray-mid">
                                            <FontAwesomeIcon width={'20px'} icon={faIcons.faInfoCircle} />
                                        </span>

                                    </p>

                                    <input placeholder="Amount (EGLD)" onChange={handleChangeRequestedAmount} value={requestedAmount} type="number" className="bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />


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



                            {
                                isAssetLoaded ? <p className="mb-3"> Preview</p> : <p className={`p-token-page_img`}>loading asset...</p>
                            }




                            <div className={`c-card ${isAssetLoaded ? `` : `u-visually-hidden`}`}>

                                <div className="c-card_img-container">
                                    <img src={imageLink} className="c-card_img" alt="" onLoad={() => { setIsAssetLoaded(true) }} />
                                </div>

                                <div className="c-card_info justify-between">

                                    <div className="c-card_details">
                                        <div>
                                            <p className="c-card_title">
                                                <Link to={`/collection/${collectionId}`}>
                                                    {collectionName}
                                                </Link>
                                            </p>
                                            <p className="c-card_collection-name">
                                                {tokenName}
                                            </p>
                                        </div>

                                    </div>

                                    <div className="c-card_details align-items-end">
                                        <p className="u-text-small u-text-theme-gray-mid">
                                            Price
                                        </p>
                                        <p className="u-text-small u-text-bold">
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
