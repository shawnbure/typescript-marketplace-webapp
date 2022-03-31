/* eslint-disable */

import * as Dapp from "@elrondnetwork/dapp";
import { Link, useParams } from 'react-router-dom';
import { UrlParameters } from "./interfaces";
import { Footer } from 'components/index';
import { useGetTokenDataMutation } from "services/tokens";
import { formatImgLink } from "utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ACCEPT_OFFER, BUY, LIST, CANCEL_OFFER, END_AUCTION, MAKE_BID, MAKE_OFFER, SELL, WITHDRAW, AUCTION } from "constants/actions";

export const CongratsPage = () => {
    
    const { address: userWalletAddress } = Dapp.useContext();
    const { tokenNonce, collectionId, action} = useParams<UrlParameters>();
    const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);
    const [imageLink, setImageLink] = useState<any>([]);
    const [tokenName, setTokenName] = useState<any>([]);
    let displayAction = "";

    //NEEDS TO BE EXPANDED TO HANDLE ACTIONS ON constants/actions.ts
    switch (action) {
        case BUY:
            displayAction = "purchased";
            break;
        case LIST:
            displayAction = "listed";
            break;
        case WITHDRAW:
            displayAction = "withdrawn";
            break;
        default:
            displayAction = "unknown";
      }
      
    const [getTokenDataTrigger, {

    data: tokenResponseData,
    isError: isErrorGetTokenDataQuery,
    isSuccess: isSuccessGetTokenDataQuery,
    isUninitialized: isUninitializedGetTokenDataQuery,

    }] = useGetTokenDataMutation();

    useEffect(() => {

        const token = getToken();
        
    }, []);


    const getToken = async () => {

        const response: any = await getTokenDataTrigger({ collectionId, tokenNonce });
          
        if (response?.error ) {
          if ((response?.error.data.error as string).indexOf("record not found") !== -1){
            return;
          }
          toast.error(`Error getting Token`, {
            autoClose: 5000,
            draggable: true,
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: false,
            position: "bottom-right",
          });
          return;
        }
        
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
                                
                            <h2 className="u-heading-lead u-text-bold u-margin-bottom-spacing-6 u-text-theme-white justify-center"><br/>Congratulations!</h2>

                                <p className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small">
                                    <Link to={`/collection/${collectionId}`}>{collectionId}</Link>
                                </p>
                            
                                <h2 className="u-text-bold u-margin-top-spacing-5 u-padding-top-spacing-5 center-xs">You have successfully {displayAction + " " + tokenName}!<br/><br/></h2>
                                
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
                                <br/><br/>
                                <p className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center">
                                <Link to={`/collection/${collectionId}`} className="c-button c-button--primary" >                        
                                    <div className="inline-flex">
                                        <span>
                                             See Collection
                                        </span>
                                    </div>
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

export default CongratsPage;
