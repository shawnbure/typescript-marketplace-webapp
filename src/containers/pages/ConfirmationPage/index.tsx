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
import { ACCEPT_OFFER, BUY, LIST, CANCEL_OFFER, START_AUCTION, END_AUCTION, MAKE_BID, MAKE_OFFER, SELL, WITHDRAW, AUCTION, 
    LIST_SC_CONTRACT_FUNCTION_NAME, BUY_SC_CONTRACT_FUNCTION_NAME, WITHDRAW_SC_CONTRACT_FUNCTION_NAME } from "constants/actions";
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
    const [startDate, setStartDate] = useState<number>(0);
    const [endDate, setEndDate] = useState<number>(0);
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

        let transaction = {} as any;
        if(!isTransactionSuccessful){
            transaction = setInterval(() => { getTransaction(); }, 2000);
        }
        return () => clearInterval(transaction);
       
    }, [isTransactionSuccessful]);

    useEffect(() => {

        if( isTransactionSuccessful && !isDataSet){

            setDatabaseRecord();
        }

    }, [isDataSet, isTokenLoaded, isTransactionLoaded]);

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
                        setStartDate(Number(getQuerystringValue("start_date")) || 0);
                        setEndDate(Number(getQuerystringValue("end_date")) || 0);
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


        /*
        
        It Seems that every function will have a unique result set and we have to account for that.

        List =   2 child transactions, 1 containing the putNftForSale@price command and the follow up @ok message.

        */
        
        
        const qsTxHash = getQuerystringValue("txHash") || "";
        const httpRequest = new XMLHttpRequest();
        const url = GetTransactionRequestHttpURL(qsTxHash); 

        let resultCount = 0;
        let fuctionName = "";
        
        switch (action.toUpperCase()) {
            case BUY:
                resultCount = 5;
                fuctionName = BUY_SC_CONTRACT_FUNCTION_NAME;
                break;
            case LIST:
                resultCount = 2;
                fuctionName = LIST_SC_CONTRACT_FUNCTION_NAME;
                break;
            case WITHDRAW:
                resultCount = 2;
                fuctionName = WITHDRAW_SC_CONTRACT_FUNCTION_NAME;
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

                break;
        }

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

                        for (let i = 0; i < jsonResponse.results.length; i++) {

                            const resultFunction = atob(jsonResponse.results[i].data);
                            const resultOK = hexToAscii(atob(jsonResponse.results[i].data).replace("@",""));

                            if(resultFunction.includes("fuctionName")){
                                
                                //TO DO SORT OUT PRICE FROM CHAIN FOR DIFFERENT TXS
                                //setPriceNominal(result.substring(result.indexOf('@') + 1));
                            }    
                            if (resultOK.includes("ok")){
                                setIsTransactionSuccessful(true);
                            }
                        }  

                        setTxStatus(txStatus)
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

        const onSale = (action.toUpperCase() == LIST);

        //formats a price string to 18 places
        let stringPrice = "";
        if(priceNominal){
            //fix the string price to correct format
            
            let stringPriceRaw = priceNominal.replace("0.", "").replace(".", "");

            let arraySaleStringPrice = stringPriceRaw.split("");

            let leadingZeroCount = 0;
            let digitCount = 0;

            //account for the start pos if the leading zeros
            //account for the number of digits
            for (let i = 0; i < arraySaleStringPrice.length; i++) {
                if (arraySaleStringPrice[i] === "0") {
                    leadingZeroCount++;
                }
                if (arraySaleStringPrice[i] != "0") {
                    digitCount++;
                }
            }

            let numberOfTrailingZeros = leadingZeroCount + digitCount;

            stringPrice = arraySaleStringPrice.join("").replace("0", "");

            for (let i = 0; i < 18 - numberOfTrailingZeros; i++) {
                stringPrice += "0";
            }
        }

        const formattedData = {
            TokenId: collectionId,
            Nonce: tokenNonce,
            NonceStr: hexNonce,
            TxHash: qsTxHash,
            OwnerAddress: userWalletAddress,
            BuyerAddress: userWalletAddress,
            TokenName: tokenName,
            FirstLink: imageLink,
            SecondLink: metadataLink,
            Price:  stringPrice,
            AuctionStartTime: startDate,
            AuctionDeadline: endDate,
            PriceNominal:  priceNominal,
            RoyaltiesPercent: globalToken.royalties,
            Timestamp: globalToken.timestamp,
            TxConfirmed: isTransactionSuccessful,
            OnSale: onSale,
        }   

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

                break;
        }
        
        setIsDataSet(true);

        if(isTransactionSuccessful){
            
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
