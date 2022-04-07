/* eslint-disable */

import * as Dapp from "@elrondnetwork/dapp";
import { Link, useParams } from 'react-router-dom';
import { UrlParameters } from "./interfaces";
import { Footer } from 'components/index';
import { useGetTokenDataMutation } from "services/tokens";
import { formatImgLink } from "utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ACCEPT_OFFER, BUY, LIST, CANCEL_OFFER, START_AUCTION, END_AUCTION, MAKE_BID, MAKE_OFFER, SELL, WITHDRAW, AUCTION } from "constants/actions";
import { 
    ENG_BUY_TITLE, ENG_BUY_MESSAGE, ENG_LIST_TITLE, ENG_LIST_MESSAGE, ENG_WITHDRAW_TITLE, ENG_WITHDRAW_MESSAGE, ENG_DEFAULT_CONFIRMATION_TITLE, ENG_DEFAULT_CONFIRMATION_MESSAGE,
    ENG_ACCEPT_OFFER_TITLE, ENG_ACCEPT_OFFER_MESSAGE, ENG_START_AUCTION_MESSAGE, ENG_START_AUCTION_TITLE, ENG_END_AUCTION_TITLE, ENG_END_AUCTION_MESSAGE, ENG_CANCEL_OFFER_TITLE, 
    ENG_CANCEL_OFFER_MESSAGE, ENG_TX_PROCESSING_MESSAGE,
} from "constants/messages";

export const ConfirmationPage = () => {
    
    const { address: userWalletAddress } = Dapp.useContext();
    const { action, collectionId, tokenNonce} = useParams<UrlParameters>();
    const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);
    const [imageLink, setImageLink] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [displayTitle, setDisplayTitle] = useState("");
    const [displayMessage, setDisplayMessage] = useState("");
    const [priceNominal, setPriceNominal] = useState("");
    

    const [getTokenDataTrigger, {

    data: tokenResponseData,
    isError: isErrorGetTokenDataQuery,
    isSuccess: isSuccessGetTokenDataQuery,
    isUninitialized: isUninitializedGetTokenDataQuery,

    }] = useGetTokenDataMutation();


    useEffect(() => {

        switch (action.toUpperCase()) {
            case BUY:
                setDisplayTitle(ENG_BUY_TITLE);
                setDisplayMessage(ENG_BUY_MESSAGE);
                break;
            case LIST:
                setDisplayTitle(ENG_LIST_TITLE);
                setDisplayMessage(ENG_LIST_MESSAGE);
                break;
            case WITHDRAW:
                setDisplayTitle(ENG_WITHDRAW_TITLE);
                setDisplayMessage(ENG_WITHDRAW_MESSAGE);
                break;
            case ACCEPT_OFFER:
                setDisplayTitle(ENG_ACCEPT_OFFER_TITLE);
                setDisplayMessage(ENG_ACCEPT_OFFER_MESSAGE);
                break;
            case CANCEL_OFFER:
                setDisplayTitle(ENG_CANCEL_OFFER_TITLE);
                setDisplayMessage(ENG_CANCEL_OFFER_MESSAGE);
                break;                
            case START_AUCTION:
                setDisplayTitle(ENG_START_AUCTION_TITLE);
                setDisplayMessage(ENG_START_AUCTION_MESSAGE);
                break;
            case END_AUCTION:
                setDisplayTitle(ENG_END_AUCTION_TITLE);
                setDisplayMessage(ENG_END_AUCTION_MESSAGE);
                break;                
            default:
                setDisplayTitle(ENG_DEFAULT_CONFIRMATION_TITLE);
                setDisplayMessage(ENG_DEFAULT_CONFIRMATION_MESSAGE);
        }
        
        const token = getToken();
        
    }, []);


    const getToken = async () => {

        const response: any = await getTokenDataTrigger({ collectionId, tokenNonce });
          
        if (response?.error ) {
          if ((response?.error.data.error as string).indexOf("record not found") !== -1){

            toast.error(`Token was not found in our datase.`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
              });
            return;
          }
          toast.error(`Error getting Token data from blockchain.`, {
            autoClose: 5000,
            draggable: true,
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: false,
            position: "bottom-right",
          });
          return;
        }
        
        setPriceNominal(response.data.data.token.priceNominal);
        setImageLink(response.data.data.token.imageLink);
        setTokenName(response.data.data.token.tokenName);
      
    };
    

    if (isErrorGetTokenDataQuery && !userWalletAddress) {
        return (
            <p className="my-10 text-2xl text-center">
            Token ({collectionId} {tokenNonce}) not found
            </p>
        );
    }

    
    return (
        
        <div className="p-homepage">

            <div className="row center-xs u-relative">

            <div className="p-homepage_lead-container col-xs-11 col-md-10">

                <div className="row">

                        <div className="row center-xs">

                            <div className="col-span-12 md:col-span-6 p-token-page_visual-holder u-margin-bottom-spacing-4 justify-center px-6">
                                
                            <h2 style={{textAlign: 'center'}} className="u-heading-lead u-text-bold u-margin-bottom-spacing-6 u-text-theme-white justify-center"><br/>{displayTitle}</h2>
     
                                <p style={{textAlign: 'center'}} className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center">
                                    <Link to={`/collection/${collectionId}`}>{collectionId}</Link>
                                </p>

                                <h2 style={{textAlign: 'center'}} className="u-text-bold u-margin-top-spacing-5 u-padding-top-spacing-5 center-xs">{displayMessage.toString().replace("{{tokenName}}", tokenName).toString().replace("{{priceNominal}}", priceNominal)}<br/><br/></h2>
                                
                                <div className="p-token-page_asset-container">
                                    <img
                                    className={`p-token-page_img ${
                                        isAssetLoaded ? `` : `u-visually-hidden`
                                    }`}
                                    src={formatImgLink(imageLink)}
                                    alt=""
                                    onLoad={() => {
                                        setIsAssetLoaded(true);
                                    }}
                                    />
                                    <p
                                    className={`p-token-page_img ${
                                        isAssetLoaded ? `u-visually-hidden` : ``
                                    }`}
                                    >
                                    loading asset...
                                    </p>
                                </div>
                           
                                <p style={{textAlign: 'center'}} className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center">{ENG_TX_PROCESSING_MESSAGE}</p>    

                                <p style={{textAlign: 'center'}} className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center">
                                <Link to={`/collection/${collectionId}`} className="c-button c-button--primary" >                           
                                    <span className="justify-center">
                                            See Collection
                                    </span>
                                </Link>
                                </p>
                        </div> 

                    </div>

                </div>
                <br/>
                <Footer />                                
            </div>
            </div>
        </div>
        );
    //}
};

export default ConfirmationPage;
