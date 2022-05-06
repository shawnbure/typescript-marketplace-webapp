/* eslint-disable */

import * as Dapp from "@elrondnetwork/dapp";
import {network} from "configs/dappConfig";
import { Link, useParams } from "react-router-dom";
import { UrlParameters } from "./interfaces";
import { Footer } from "components/index";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getQuerystringValue } from "utils/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import { handleCopyToClipboard } from "utils";
import { faFacebookSquare, faTelegram, faTwitterSquare, faWhatsappSquare } from "@fortawesome/free-brands-svg-icons";
import { routePaths } from 'constants/router';
import {
  useWithdrawTokenMutation,
  useListTokenFromClientMutation,
  useBuyTokenFromClientMutation,
  useStakeTokenFromClientMutation,
} from "services/tokens";

import {
  GetTransactionRequestHttpURL,
  GetTokenRequestHttpURL,
} from "utils";
import {
  ACCEPT_OFFER,
  BUY,
  LIST,
  CANCEL_OFFER,
  START_AUCTION,
  END_AUCTION,
  MAKE_BID,
  MAKE_OFFER,
  SELL,
  MINT,
  WITHDRAW,
  AUCTION,
  STAKE,
} from "constants/actions";
import {
  ENG_BUY_TITLE,
  ENG_BUY_MESSAGE,
  ENG_LIST_TITLE,
  ENG_LIST_TITLE_FAIL,
  ENG_LIST_MESSAGE,
  ENG_STAKE_TITLE,
  ENG_STAKE_TITLE_FAIL,
  ENG_STAKE_MESSAGE,
  ENG_UNSTAKE_TITLE,
  ENG_UNSTAKE_TITLE_FAIL,
  ENG_UNSTAKE_MESSAGE,
  ENG_WITHDRAW_TITLE,
  ENG_WITHDRAW_TITLE_FAIL,
  ENG_WITHDRAW_MESSAGE,
  ENG_DEFAULT_CONFIRMATION_TITLE,
  ENG_DEFAULT_CONFIRMATION_TITLE_FAIL,
  ENG_DEFAULT_CONFIRMATION_MESSAGE,
  ENG_ACCEPT_OFFER_TITLE,
  ENG_ACCEPT_OFFER_TITLE_FAIL,
  ENG_ACCEPT_OFFER_MESSAGE,
  ENG_START_AUCTION_MESSAGE,
  ENG_START_AUCTION_TITLE,
  ENG_START_AUCTION_TITLE_FAIL,
  ENG_END_AUCTION_TITLE,
  ENG_END_AUCTION_TITLE_FAIL,
  ENG_END_AUCTION_MESSAGE,
  ENG_CANCEL_OFFER_TITLE,
  ENG_CANCEL_OFFER_TITLE_FAIL,
  ENG_CANCEL_OFFER_MESSAGE,
  ENG_TX_PROCESSING_MESSAGE,
  ENG_TX_SUCCESS_MESSAGE,
  ENG_COLLECTION_BUTTON,
  ENG_TX_COMPLETED_MESSAGE,
  ENG_MINT_TITLE,
  ENG_MINT_TITLE_FAIL,
  ENG_MINT_MESSAGE,
  ENG_TX_FAILED_MESSAGE,
  ENG_BUY_TITLE_FAIL,
  ENG_TX_UNKNOWN_MESSAGE,
  ENG_TX_UNKNOWN_TITLE,
  ENG_TX_LINK,
  ENG_COPY_TO_CLIPBOARD_TITLE,
  ENG_SHARE_TO, 
  ENG_TX_NAV_TO_HASH
} from "constants/messages";


export const ConfirmationPage = () => {
  const { address: userWalletAddress } = Dapp.useContext();
  const { action, collectionId, tokenNonce, info } = useParams<UrlParameters>();
  const [globalToken, setGlobalToken] = useState<any>({});
  const queryString = window.location.search;
  const [transactionHash] = useState(getQuerystringValue(queryString, "txHash") || "");
  const [onStake] = useState(Boolean(Number(getQuerystringValue(queryString, "onstake") || 0)));
  const [isTokenLoaded, setIsTokenLoaded] = useState<boolean>(false);
  const [isTransactionSuccessful, setIsTransactionSuccessful] = useState<boolean>(false);
  const [isTransactionLoaded, setIsTransactionLoaded] = useState<boolean>(false);
  const [isDataSet, setIsDataSet] = useState<boolean>(false);
  const [txFailed, setTxFailed] = useState<boolean>(false);
  const [txUnknown, setTxUnknown] = useState<boolean>(false);
  const [displayTitle, setDisplayTitle] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);
  const [imageLink, setImageLink] = useState("");
  const [nftLink, setNftLink] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [priceNominal, setPriceNominal] = useState("");
  const [startDate, setStartDate] = useState<number>(0);
  const [numberMinted, setNumberMinted] = useState<number>(0);
  const [endDate, setEndDate] = useState<number>(0);
  const [stakeTokenFromClientTrigger] = useStakeTokenFromClientMutation();
  const [listTokenFromClientTrigger] = useListTokenFromClientMutation();
  const [buyTokenFromClientTrigger] = useBuyTokenFromClientMutation();
  const [withdrawTokenTrigger] = useWithdrawTokenMutation();
  

  const imageBoxStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  };


  useEffect(() => {
   
    switch (action.toUpperCase()) {
      case BUY:
        txFailed == false
          ? setDisplayTitle(ENG_BUY_TITLE)
          : setDisplayTitle(ENG_BUY_TITLE_FAIL);
        setDisplayMessage(ENG_BUY_MESSAGE);
        break;
      case LIST:
        txFailed == false
          ? setDisplayTitle(ENG_LIST_TITLE)
          : setDisplayTitle(ENG_LIST_TITLE_FAIL);
        setDisplayMessage(ENG_LIST_MESSAGE);
        setPriceNominal(getQuerystringValue(queryString, "price") || "");
        break;
      case STAKE:

        if (onStake) {
          txFailed == false
            ? setDisplayTitle(ENG_STAKE_TITLE)
            : setDisplayTitle(ENG_STAKE_TITLE_FAIL);
          setDisplayMessage(ENG_STAKE_MESSAGE);
        } else {
          txFailed == false
            ? setDisplayTitle(ENG_UNSTAKE_TITLE)
            : setDisplayTitle(ENG_UNSTAKE_TITLE_FAIL);
          setDisplayMessage(ENG_UNSTAKE_MESSAGE);
        }
          break;
      case MINT:
        txFailed == false
          ? setDisplayTitle(ENG_MINT_TITLE)
          : setDisplayTitle(ENG_MINT_TITLE_FAIL);
        setDisplayMessage(ENG_MINT_MESSAGE);
        setNumberMinted(Number(getQuerystringValue(queryString, "number_minted")) || 0);
        setImageLink("/img/collections/GreenCheck.png");
        setNftLink(window.location.origin + routePaths.collection.replace(":collectionId", collectionId));
        break;
      case WITHDRAW:
        txFailed == false
          ? setDisplayTitle(ENG_WITHDRAW_TITLE)
          : setDisplayTitle(ENG_WITHDRAW_TITLE_FAIL);
        setDisplayMessage(ENG_WITHDRAW_MESSAGE);
        break;
      case ACCEPT_OFFER:
        txFailed == false
          ? setDisplayTitle(ENG_ACCEPT_OFFER_TITLE)
          : setDisplayTitle(ENG_ACCEPT_OFFER_TITLE_FAIL);
        setDisplayMessage(ENG_ACCEPT_OFFER_MESSAGE);
        break;
      case CANCEL_OFFER:
        txFailed == false
          ? setDisplayTitle(ENG_CANCEL_OFFER_TITLE)
          : setDisplayTitle(ENG_CANCEL_OFFER_TITLE_FAIL);
        setDisplayMessage(ENG_CANCEL_OFFER_MESSAGE);
        break;
      case START_AUCTION:
        txFailed == false
          ? setDisplayTitle(ENG_START_AUCTION_TITLE)
          : setDisplayTitle(ENG_START_AUCTION_TITLE_FAIL);
        setDisplayMessage(ENG_START_AUCTION_MESSAGE);
        setStartDate(Number(getQuerystringValue(queryString, "start_date")) || 0);
        setEndDate(Number(getQuerystringValue(queryString, "end_date")) || 0);
        break;
      case END_AUCTION:
        txFailed == false
          ? setDisplayTitle(ENG_END_AUCTION_TITLE)
          : setDisplayTitle(ENG_END_AUCTION_TITLE_FAIL);
        setDisplayMessage(ENG_END_AUCTION_MESSAGE);
        break;
      default:
        txFailed == false
          ? setDisplayTitle(ENG_DEFAULT_CONFIRMATION_TITLE)
          : setDisplayTitle(ENG_DEFAULT_CONFIRMATION_TITLE_FAIL);
        setDisplayMessage(ENG_DEFAULT_CONFIRMATION_MESSAGE);
    }

    const token = getToken();
  }, []);

  useEffect(() => {
    let transaction = {} as any;
    if (!isTransactionSuccessful) {
      transaction = setInterval(() => {
        getTransaction();
      }, 2000);
    }
    return () => clearInterval(transaction);
  }, [isTransactionSuccessful]);

  useEffect(() => {
    if (isTransactionSuccessful && !isDataSet) {
      setDatabaseRecord();
    }
  }, [isDataSet, isTokenLoaded, isTransactionLoaded]);

  const getToken = async () => {
    let hexNonce = parseInt(tokenNonce, 10).toString(16);
    if (hexNonce?.length % 2 != 0) {
      hexNonce = "0" + hexNonce;
    }
    const httpRequest = new XMLHttpRequest();
    const url = GetTokenRequestHttpURL(collectionId + "-" + hexNonce);
    httpRequest.open("GET", url);
    httpRequest.send();

    httpRequest.onreadystatechange = (e) => {
      //check read state (4: done) and status
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        if (httpRequest.responseText) {
          const data = httpRequest.responseText;

          try {
            //need to load some page values so it displayys, then set db values
            const jsonResponse = JSON.parse(data);
            setImageLink(jsonResponse.url);
            setNftLink(`${window.location.origin}/token/${jsonResponse.collection}/${jsonResponse.nonce}`)
            setTokenName(jsonResponse.name);
            setGlobalToken(jsonResponse);
            setIsTokenLoaded(true);
          } catch (e) {
            //there's a parse error - handle it here
            //window.location.reload()
          }
        }
      }
    };
  };

  const getTransaction = async () => {
    const httpRequest = new XMLHttpRequest();
    const url = GetTransactionRequestHttpURL(transactionHash);

    httpRequest.open("GET", url);
    httpRequest.send();
    httpRequest.onreadystatechange = (e) => {
      //check read state (4: done) and status
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        if (httpRequest.responseText) {
          const data = httpRequest.responseText;

          try {
            const jsonResponse = JSON.parse(data);

            if (
              !jsonResponse.pendingResults &&
              jsonResponse.status == "success"
            ) {
              setIsTransactionSuccessful(true);
            }
            if (jsonResponse.status == "fail") {
              setTxFailed(true);
            }
            if (jsonResponse.status == undefined) {
              setTxUnknown(true);
            }
            setIsTransactionLoaded(true);
          } catch (e) {
            //there's a parse error - handle it here
            //window.location.reload()
          }
        }
      }
    };
  };

  const setDatabaseRecord = async () => {
    //this value needs to be hexidecimal. add 0 to the first position if the len = 1
    let hexNonce = parseInt(tokenNonce, 10).toString(16);
    if (tokenNonce?.length == 1) {
      hexNonce = "0" + tokenNonce;
    }

    let metadataLink = "";
    if (globalToken.uris?.length > 1) {
      metadataLink = atob(globalToken.uris[1]);
    }
    const onSale = action.toUpperCase() == LIST;

    var formattedData = {
      TokenId: collectionId,
      Nonce: parseInt(tokenNonce, 10),
      NonceStr: hexNonce,
      TxHash: transactionHash,
      OwnerAddress: userWalletAddress,
      BuyerAddress: userWalletAddress,
      TokenName: tokenName,
      FirstLink: imageLink,
      SecondLink: metadataLink,
      AuctionStartTime: startDate,
      AuctionDeadline: endDate,
      PriceNominal: priceNominal,
      RoyaltiesPercent: globalToken.royalties,
      Timestamp: globalToken.timestamp,
      TxConfirmed: isTransactionSuccessful,
      OnSale: onSale,
      OnStake: Boolean(onStake),
      Status: "",
      StakeDate: 0,   
      StakeType: "",
    };

    if(onStake) {
      formattedData.Status = "Stake";
      formattedData.StakeDate = new Date().getTime();
      formattedData.StakeType = "DAO"
      formattedData.OnSale = false;
    }

    var response = null;
    switch (action.toUpperCase()) {
      case BUY:
        response = buyTokenFromClientTrigger({ payload: formattedData });
        break;
      case LIST:
        response = listTokenFromClientTrigger({ payload: formattedData });
        break;
      case STAKE:
        response = stakeTokenFromClientTrigger({ payload: formattedData });
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

    if (isTransactionSuccessful) {
      toast.success(
        ENG_TX_SUCCESS_MESSAGE.toString().replace("{{tokenName}}", tokenName),
        {
          autoClose: 5000,
          draggable: true,
          closeOnClick: true,
          pauseOnHover: true,
          hideProgressBar: false,
          position: "bottom-right",
        }
      );
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
        <div className="p-homepage_lead-container ">
          <div className="row">
            <div className="row center-xs">
              <div className="col-span-12 md:col-span-6 p-token-page_visual-holder u-margin-bottom-spacing-4 justify-center px-6">
                <h2
                  style={{ textAlign: "center" }}
                  className="u-heading-lead u-text-bold u-margin-bottom-spacing-6 u-text-theme-white justify-center"
                >
                  <br />
                  {txUnknown ? ENG_TX_UNKNOWN_TITLE : displayTitle}
                </h2>
                <hr className="text-white" />
                <h2
                  style={{ textAlign: "center" }}
                  className="u-text-bold u-margin-top-spacing-5 u-padding-top-spacing-5 center-xs"
                >
                  {displayMessage
                    .toString()
                    .replace("{{tokenName}}", tokenName)
                    .toString()
                    .replace("{{priceNominal}}", priceNominal)
                    .replace("{{collectionName}}", collectionId)
                    .replace("{{numMint}}", String(numberMinted))}
                  <br />
                  <br />
                </h2>

                <div className={isAssetLoaded ? "" : "p-token-page_asset-container"}>
                  <img
                    className={`p-token-page_img`}
                    src={isAssetLoaded ? imageLink : "/img/collections/CollectionProfileImageEmpty.jpg"}
                    alt=""
                    onLoad={() => {
                      setIsAssetLoaded(true);
                    }}
                  />
                </div>
                    <br/>
                <p
                  style={{ textAlign: "center" }}
                  className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center"
                >
                  {isTransactionSuccessful ? (
                    <span className="justify-center">
                      {ENG_TX_COMPLETED_MESSAGE}
                    </span>
                  ) : (
                    <span className="justify-center">
                      {txFailed
                        ? 
                        ENG_TX_FAILED_MESSAGE 
                        : txUnknown ? ENG_TX_UNKNOWN_MESSAGE : ENG_TX_PROCESSING_MESSAGE}
                    </span>
                  )}
                </p>
                <p
                  style={{ textAlign: "center" }}
                  className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center"
                >
                  {isTransactionSuccessful ? (
                    <Link
                      to={`/collection/${collectionId}`}
                      className="c-button c-button--primary"
                    >
                      <span className="justify-center">
                        {ENG_COLLECTION_BUTTON}
                      </span>
                    </Link>
                  ) : (
                    <div
                      className="image-container"
                      style={{ ...imageBoxStyle }}
                    >
                      {txFailed || txUnknown ? (
                        ""
                      ) : (
                        <img
                          style={{ animation: `spin 3s linear infinite` }}
                          src={"/img/logos/logo_youbei.svg"}
                          alt="Verifying Transaction Status"
                          width="100"
                          height="75"
                        />
                      )}
                    </div>
                  )}
                  <hr className="text-white my-10" />
                  <div className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center">
                  {
                  isTransactionSuccessful ?
                  (
                  <div className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center">
                    <div style={{ textAlign: "center" }} className="justify-center">
                      <a href={`https://twitter.com/intent/tweet?text=${nftLink}`} target="_new">
                        <FontAwesomeIcon style={{ marginRight: 10, marginLeft: 10 }} size="3x" icon={faTwitterSquare} color="#1DA1F2" title={`${ENG_SHARE_TO} Twitter`} />
                      </a>
                      <a href={`https://api.whatsapp.com/send?text=${nftLink}`} target="_new">
                        <FontAwesomeIcon style={{ marginRight: 10, marginLeft: 10 }} size="3x" icon={faWhatsappSquare} color="#25D366" title={`${ENG_SHARE_TO} WhatsApp`} />
                      </a>
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=#${nftLink}`} target="_new">
                        <FontAwesomeIcon style={{ marginRight: 10, marginLeft: 10 }} size="3x" icon={faFacebookSquare} color="#4267B2" title={`${ENG_SHARE_TO} Facebook`} />
                      </a>
                      <a href={`https://t.me/share/url?url=${nftLink}`} target="_new">
                        <FontAwesomeIcon style={{ marginRight: 10, marginLeft: 10 }} size="3x" icon={faTelegram} color="#229ED9" title={`${ENG_SHARE_TO} Telegram`} />
                      </a>
                      <FontAwesomeIcon onClick={() => {handleCopyToClipboard(nftLink)}} className="text-gray-400 cursor-pointer" style={{ marginRight: 10, marginLeft: 10 }} size="3x" icon={faIcons.faCopy} title={`${ENG_COPY_TO_CLIPBOARD_TITLE}`}/>
                    </div>
                  </div>
                  ) : null
                }
                    <p> 
                        <a href={network.explorerAddress+"transactions/"+transactionHash} target="_new" title={`${ENG_TX_NAV_TO_HASH}`}>
                        <FontAwesomeIcon style={{ marginRight: 10, marginLeft: 10, }} className="c-navbar_icon-link u-text-theme-blue-anchor " icon={faIcons.faExternalLinkAlt}/>
                        {ENG_TX_LINK}
                        </a>
                    </p>
                  </div>
                
                </p>
              </div>
            </div>
          </div>
          <br />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
