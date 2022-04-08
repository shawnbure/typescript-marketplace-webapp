/* eslint-disable */

import * as Dapp from "@elrondnetwork/dapp";
import { Link, useParams } from 'react-router-dom';
import { UrlParameters } from "./interfaces";
import { Footer } from 'components/index';
import { formatImgLink } from "utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getQuerystringValue } from "utils/transactions";
import { useWithdrawTokenMutation, useListTokenFromClientMutation, useBuyTokenFromClientMutation } from "services/tokens";

import { GetTransactionRequestHttpURL, GetTokenRequestHttpURL, hexToAscii} from "utils";
import { ACCEPT_OFFER, BUY, LIST, CANCEL_OFFER, START_AUCTION, END_AUCTION, MAKE_BID, MAKE_OFFER, SELL, WITHDRAW, AUCTION } from "constants/actions";
import { 
    ENG_BUY_TITLE, ENG_BUY_MESSAGE, ENG_LIST_TITLE, ENG_LIST_MESSAGE, ENG_WITHDRAW_TITLE, ENG_WITHDRAW_MESSAGE, ENG_DEFAULT_CONFIRMATION_TITLE, ENG_DEFAULT_CONFIRMATION_MESSAGE,
    ENG_ACCEPT_OFFER_TITLE, ENG_ACCEPT_OFFER_MESSAGE, ENG_START_AUCTION_MESSAGE, ENG_START_AUCTION_TITLE, ENG_END_AUCTION_TITLE, ENG_END_AUCTION_MESSAGE, ENG_CANCEL_OFFER_TITLE, 
    ENG_CANCEL_OFFER_MESSAGE, ENG_TX_PROCESSING_MESSAGE, ENG_TX_SUCCESS_MESSAGE
} from "constants/messages";


export const ConfirmationPage = () => {
    
    const { address: userWalletAddress } = Dapp.useContext();
    const { action, collectionId, tokenNonce} = useParams<UrlParameters>();
    const [globalToken, setGlobalToken] = useState<any>({}); 
    const [globalTransaction, setGlobalTransaction] = useState<any>({}); 
    const [isTokenLoaded, setIsTokenLoaded] = useState<boolean>(false);
    const [isTransactionSuccessful, setIsTransactionSuccessful] = useState<boolean>(false);
    const [isTransactionLoaded, setIsTransactionLoaded] = useState<boolean>(false);
    const [isDataSet, setIsDataSet] = useState<boolean>(false);
    const [txStatus, setTxStatus] = useState("Processing");
    const [displayTitle, setDisplayTitle] = useState("");
    const [displayMessage, setDisplayMessage] = useState("");
    const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);
    const [imageLink, setImageLink] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [priceNominal, setPriceNominal] = useState("");
    const [listTokenFromClientTrigger] = useListTokenFromClientMutation();
    const [buyTokenFromClientTrigger] = useBuyTokenFromClientMutation();
    const [withdrawTokenTrigger] = useWithdrawTokenMutation();
    

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

    useEffect(() => {

        //const transaction = getTransaction();
        let transaction = {} as any;
        if(!isTransactionSuccessful){
            transaction = setInterval(() => { getTransaction(); }, 1000);
        }
        return () => clearInterval(transaction);
       
    }, [isTransactionSuccessful]);



    const getToken = async () => {

        let hexNonce = tokenNonce;
        if (tokenNonce?.length % 2 != 0) {
          hexNonce = "0" + tokenNonce;
        }

        const httpRequest = new XMLHttpRequest();
        const url = GetTokenRequestHttpURL(collectionId + "-" + hexNonce); 
        httpRequest.open("GET", url);
        httpRequest.send();

        httpRequest.onreadystatechange = (e) => 
        {
            //check read state (4: done) and status
            if (httpRequest.readyState == 4 && httpRequest.status == 200)
            {
                if( httpRequest.responseText  )
                {             
                    const data = httpRequest.responseText;

                    try {

                        //need to load some page values so it displayys, then set db values
                        const jsonResponse = JSON.parse(data);
                        //console.log(jsonResponse)
                        setImageLink(jsonResponse.url);
                        setTokenName(jsonResponse.name);
                        setPriceNominal(getQuerystringValue("price") || "");
                        setGlobalToken(jsonResponse);
                        setIsTokenLoaded(true);

                    } catch(e) 
                    {
                        //there's a parse error - handle it here 
                        //window.location.reload()
                        
                    }
                }
            }                
        }
       
    };

    const getTransaction = async () => {

        const qsTxHash = getQuerystringValue("txHash") || "";
        const httpRequest = new XMLHttpRequest();
        const url = GetTransactionRequestHttpURL(qsTxHash); 
        httpRequest.open("GET", url);
        httpRequest.send();
        httpRequest.onreadystatechange = (e) => 
        {       
            //check read state (4: done) and status
            if (httpRequest.readyState == 4 && httpRequest.status == 200)
            {
                if( httpRequest.responseText  )
                {             
                    const data = httpRequest.responseText;

                    try {

                        const jsonResponse = JSON.parse(data);
                        
                        setGlobalTransaction(jsonResponse);
                        //const txStatus = hexToAscii(atob(jsonResponse.results[0].data).replace("@", ""));
                        //console.log(jsonResponse)
                        //console.log(txStatus)
                        const txStatus = jsonResponse.status;
                        setTxStatus(txStatus)

                        if (txStatus == "success"){
                            setIsTransactionSuccessful(true);
                        }
                        setIsTransactionLoaded(true);

                    } catch(e) 
                    {
                        //there's a parse error - handle it here 
                        //window.location.reload()
                        
                    }
                }
            }                
        }
       
    };
    
    const setDatabaseRecord = async () => {

        const qsTxHash = getQuerystringValue("txHash") || "";

        //this value needs to be hexidecimal. add 0 to the first position if the len = 1
        let hexNonce = tokenNonce;
        if(tokenNonce?.length == 1){
            hexNonce = "0" + tokenNonce;
        }
    
        let metadataLink = "";
        if(globalToken.uris.length > 1){
            metadataLink = atob(globalToken.uris[1]);
        }

        let txConfirmed = false;
        let onSale = false;

        if(txStatus == "success"){
            txConfirmed = true;
            if(action.toUpperCase() == LIST){
                onSale = true;
            }
        }

        const formattedData = {
            TokenId: collectionId,
            StrNonce: hexNonce,
            TxHash: qsTxHash,
            OwnerAddress: userWalletAddress,
            BuyerAddress: userWalletAddress,
            TokenName: tokenName,
            FirstLink: imageLink,
            SecondLink: metadataLink,
            Price:  priceNominal,
            NominalPrice:  priceNominal,
            RoyaltiesPercent: globalToken.royalties,
            Timestamp: globalToken.timestamp,
            TxConfirmed: txConfirmed,
            OnSale: onSale,
        }   
console.log(formattedData)
        var response = null;
        switch (action.toUpperCase()) {
            case BUY:
                response = buyTokenFromClientTrigger({ payload: formattedData });
                break;
            case LIST:
                response = listTokenFromClientTrigger({ payload: formattedData });
                break;
            case WITHDRAW:
                response = withdrawTokenTrigger({ payload: formattedData });
                break;
            case ACCEPT_OFFER:
 
                break;
            case CANCEL_OFFER:

                break;                
            case START_AUCTION:
    
                break;
            case END_AUCTION:

                break;                
            default:

        }
        
        setIsDataSet(true);

        if(txStatus == "success"){
            
            toast.success(ENG_TX_SUCCESS_MESSAGE.toString().replace("{{tokenName}}", tokenName), {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

        }

    };

    //this will file the data insert after the token, transaction is loaded, and the data has not been set.
    {
        if(isTokenLoaded && isTransactionLoaded && !isDataSet){
            setDatabaseRecord();
        }
    };

   
    if (!userWalletAddress) {
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
};

export default ConfirmationPage;
