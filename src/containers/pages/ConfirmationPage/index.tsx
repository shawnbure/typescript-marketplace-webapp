/* eslint-disable */

import * as Dapp from "@elrondnetwork/dapp";
import { Link, useParams } from "react-router-dom";
import { UrlParameters } from "./interfaces";
import { Footer } from "components/index";
import { formatImgLink } from "utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getQuerystringValue } from "utils/transactions";
import { BASE_URL_API } from "constants/api";
import {
  useWithdrawTokenMutation,
  useListTokenFromClientMutation,
  useBuyTokenFromClientMutation,
} from "services/tokens";

import {
  GetTransactionRequestHttpURL,
  GetTokenRequestHttpURL,
  hexToAscii,
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
} from "constants/actions";
import {
  ENG_BUY_TITLE,
  ENG_BUY_MESSAGE,
  ENG_LIST_TITLE,
  ENG_LIST_TITLE_FAIL,
  ENG_LIST_MESSAGE,
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
  ENG_TX_COMPETED_MESSAGE,
  ENG_LOADING_ASSET,
  ENG_MINT_TITLE,
  ENG_MINT_TITLE_FAIL,
  ENG_MINT_MESSAGE,
  ENG_TX_FAILED_MESSAGE,
  ENG_BUY_TITLE_FAIL,
  ENG_TX_UNKNOWN_MESSAGE,
  ENG_TX_UNKNOWN_TITLE,
} from "constants/messages";

export const ConfirmationPage = () => {
  const { address: userWalletAddress } = Dapp.useContext();
  const { action, collectionId, tokenNonce, info } = useParams<UrlParameters>();
  const [globalToken, setGlobalToken] = useState<any>({});
  const [transactionHash, setTransactionHash] = useState(
    getQuerystringValue("txHash") || ""
  );
  const [txStatus, setTxStatus] = useState(getQuerystringValue("status") || "");
  const [isTokenLoaded, setIsTokenLoaded] = useState<boolean>(false);
  const [isTransactionSuccessful, setIsTransactionSuccessful] = useState<
    boolean
  >(false);
  const [isTransactionLoaded, setIsTransactionLoaded] = useState<boolean>(
    false
  );
  const [isDataSet, setIsDataSet] = useState<boolean>(false);
  const [txFailed, setTxFailed] = useState<boolean>(false);
  const [txUnknown, setTxUnknown] = useState<boolean>(false);
  const [displayTitle, setDisplayTitle] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);
  const [imageLink, setImageLink] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [priceNominal, setPriceNominal] = useState("");
  const [startDate, setStartDate] = useState<number>(0);
  const [numberMinted, setNumberMinted] = useState<number>(0);
  const [endDate, setEndDate] = useState<number>(0);
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
    let infoStr = info as string;
    let infoParts = infoStr.split("|");
    let infoMap = new Map<string, any>();
    for (let i = 0; i < infoParts.length; i++) {
      let qPart = infoParts[i].split("=");
      infoMap.set(qPart[0], qPart[1]);
    }
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
        setPriceNominal(infoMap.get("price") || "");
        break;
      case MINT:
        txFailed == false
          ? setDisplayTitle(ENG_MINT_TITLE)
          : setDisplayTitle(ENG_MINT_TITLE_FAIL);
        setDisplayMessage(ENG_MINT_MESSAGE);
        setNumberMinted(Number(infoMap.get("number_minted")) || 0);
        setImageLink(`${BASE_URL_API}/image/${collectionId}.profile`);
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
        setStartDate(Number(infoMap.get("start_date")) || 0);
        setEndDate(Number(infoMap.get("end_date")) || 0);
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
            //console.log(jsonResponse)
            if (action.toUpperCase() != MINT) {
              setImageLink(jsonResponse.url);
            }
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

    const formattedData = {
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
    };

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
        <div className="p-homepage_lead-container col-xs-11 col-md-10">
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

                <p
                  style={{ textAlign: "center" }}
                  className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center"
                >
                  <Link to={`/collection/${collectionId}`}>{collectionId}</Link>
                </p>

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

                <div className="p-token-page_asset-container">
                  <img
                    className={`p-token-page_img ${
                      isAssetLoaded ? `` : `u-visually-hidden`
                    }`}
                    src={imageLink}
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
                    {ENG_LOADING_ASSET}
                  </p>
                </div>

                <p
                  style={{ textAlign: "center" }}
                  className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small justify-center"
                >
                  {isTransactionSuccessful ? (
                    <span className="justify-center">
                      {ENG_TX_COMPETED_MESSAGE}
                    </span>
                  ) : (
                    <span className="justify-center">
                      {txFailed
                        ? ENG_TX_FAILED_MESSAGE.replace(
                            "{{txHash}}",
                            transactionHash
                          )
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
