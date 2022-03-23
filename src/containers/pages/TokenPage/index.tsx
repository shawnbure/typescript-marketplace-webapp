/* eslint-disable */
import Popup from "reactjs-popup";
import Table from "rc-table";
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from "react-collapsible";
import { useLocation, Link, useParams } from "react-router-dom";
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import * as faBrands from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import DateTimePicker from "react-datetime-picker";

import moment from "moment";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useGetAcceptOfferTemplateMutation,
  useGetBuyNftTemplateMutation,
  useGetCancelOfferTemplateMutation,
  useGetEndAuctionTemplateMutation,
  useGetMakeBidTemplateMutation,
  useGetMakeOfferTemplateMutation,
  useGetWithdrawNftTemplateMutation,
} from "services/tx-template";
import {
  useGetTokenBidsMutation,
  useGetTokenDataMutation,
  useGetTokenMetadataMutation,
  useGetTokenOffersMutation,
  useGetTransactionsMutation,
  useRefreshTokenMetadataMutation,
} from "services/tokens";
import { prepareTransaction } from "utils/transactions";

import { UrlParameters } from "./interfaces";
import { useGetEgldPriceQuery } from "services/oracle";
import { formatImgLink, shorterAddress } from "utils";
import {
  ACCEPT_OFFER,
  BUY,
  CANCEL_OFFER,
  END_AUCTION,
  MAKE_BID,
  MAKE_OFFER,
  SELL,
  WITHDRAW,
} from "constants/actions";
import { useAppDispatch } from "redux/store";
import { setShouldDisplayWalletSidebar } from "redux/slices/ui";
import { useGetAccountTokenGatewayMutation } from "services/accounts";
import { useGetCollectionByIdMutation } from "services/collections";
import { alphaToastMessage } from "components/AlphaToastError";

export const TokenPage: (props: any) => any = ({}) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  //this walletAddressParam below actuall gets the contract address for the URL?
  const {
    collectionId,
    tokenNonce,
    walletAddress: walletAddressParam,
  } = useParams<UrlParameters>();
  const [hasLoadMoreActivity, setHasLoadMoreActivity] = useState(true);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [isAssetLoaded, setIsAssetLoaded] = useState<boolean>(false);
  const [expireOffer, setExpireOffer] = useState<any>();
  const [transactions, setTransactions] = useState<any>([]);
  const { loggedIn, address: userWalletAddress } = Dapp.useContext();

  const sendTransaction = Dapp.useSendTransaction();

  const [
    getAccountTokenTrigger,
    {
      data: gatewayTokenData,
      // isLoading: isLoadingGatewayTokenDataQuery,
      isSuccess: isSuccessGatewayTokenDataQuery,
      isError: isErrorGatewayTokenDataQuery,
      // isUninitialized: isUninitializedGatewayTokenDataQuery,
    },
  ] = useGetAccountTokenGatewayMutation();

  const [
    getCollectionByIdTrigger,
    { data: collectionData, isError: isErrorGetCollectionData },
  ] = useGetCollectionByIdMutation();

  const [
    getTokenDataTrigger,
    {
      data: tokenResponseData,
      isError: isErrorGetTokenDataQuery,
      isSuccess: isSuccessGetTokenDataQuery,
      isUninitialized: isUninitializedGetTokenDataQuery,
    },
  ] = useGetTokenDataMutation();

  const [
    getTokenMetadataTrigger,
    {
      data: tokenMetadataData,
      isUninitialized: isUninitializedGetTokenMetadata,
    },
  ] = useGetTokenMetadataMutation();

  const [
    getTokenOffersTrigger,
    { data: tokenOffersData },
  ] = useGetTokenOffersMutation();

  const [
    getTokenBidsTrigger,
    { data: tokenBidsData },
  ] = useGetTokenBidsMutation();

  const [
    getTokenTransactionsTrigger,
    { data: getTokenTransactionsData },
  ] = useGetTransactionsMutation();

  const [getMakeBidTemplateTrigger] = useGetMakeBidTemplateMutation();
  const [getMakeOfferTemplateTrigger] = useGetMakeOfferTemplateMutation();
  const [getEndAuctionTemplateTrigger] = useGetEndAuctionTemplateMutation();
  const [getAcceptOfferTemplateTrigger] = useGetAcceptOfferTemplateMutation();
  const [getCancelOfferTemplateTrigger] = useGetCancelOfferTemplateMutation();
  const [refreshMetadataTrigger] = useRefreshTokenMetadataMutation();

  const {
    data: egldPriceData,
    // isError: isErrorEgldPriceQuery,
    // isLoading: isLoadingEgldPriceQuery,
    isSuccess: isSuccessEgldPriceQuery,
  } = useGetEgldPriceQuery();

  const isEgldPriceFetched: boolean =
    isSuccessEgldPriceQuery && Boolean(egldPriceData);
  const isTokenDataFetched: boolean =
    isSuccessGetTokenDataQuery && Boolean(tokenResponseData?.data?.token);
  const isGatewayTokenFetched: boolean =
    isSuccessGatewayTokenDataQuery && Boolean(gatewayTokenData?.data);
  const shouldRenderPage: boolean = walletAddressParam
    ? isGatewayTokenFetched
    : isTokenDataFetched && isEgldPriceFetched;

  //const shouldRedirect: boolean = walletAddressParam ? (isErrorGatewayTokenDataQuery || (!Boolean(gatewayTokenData?.data?.tokenData?.creator) && isSuccessGatewayTokenDataQuery)) : (isErrorGetTokenDataQuery || (!Boolean(tokenResponseData?.data?.ownerWalletAddress) && isSuccessGetTokenDataQuery));

  const [getBuyNftTemplateQueryTrigger] = useGetBuyNftTemplateMutation();
  const [
    getWithdrawNftTemplateQueryTrigger,
  ] = useGetWithdrawNftTemplateMutation();

  const triggerActivityLoad = async ({
    mergeWithExisting = false,
    newFilterQuery,
    newSortQuery,
  }: {
    mergeWithExisting?: boolean;
    newFilterQuery?: any;
    newSortQuery?: any;
  }) => {
    // const filters = newFilterQuery ? newFilterQuery : filterQuery;
    const offset = mergeWithExisting ? transactions.length : 0;
    // const sortRules = newSortQuery ? newSortQuery : sort;

    const tokenTransactionsResponse: any = await getTokenTransactionsTrigger({
      collectionId,
      tokenNonce,
      offset: offset,
      limit: 8,
    });

    if (getTokenTransactionsData?.data) {
      const txsResponse = tokenTransactionsResponse?.data?.data;

      const newTransactions = txsResponse || [];

      if (mergeWithExisting) {
        setTransactions([...transactions, ...newTransactions]);
      } else {
        setTransactions(newTransactions);
      }

      setHasLoadMoreActivity(Boolean(txsResponse?.length));
    }
  };
  const getInitialTxs = async () => {
    const response: any = await getTokenTransactionsTrigger({
      collectionId,
      tokenNonce,
      offset: 0,
      limit: 10,
    });
    if (response?.error) {
      toast.error(`Error getting initial transcaction history`, {
        autoClose: 5000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        position: "bottom-right",
      });
      return;
    }

    setTransactions(response.data.data);
  };
  useEffect(() => {
    getTokenOffersTrigger({
      collectionId,
      tokenNonce,
      offset: 0,
      limit: 10,
    });

    getTokenBidsTrigger({
      collectionId,
      tokenNonce,
      offset: 0,
      limit: 10,
    });

    getInitialTxs();

    getCollectionByIdTrigger({ collectionId: collectionId });

    getTokenDataTrigger({ collectionId, tokenNonce });

    if (walletAddressParam) {
      getAccountTokenTrigger({
        userWalletAddress: walletAddressParam,
        identifier: collectionId,
        nonce: tokenNonce,
      });
      return;
    }
  }, []);

  if (isErrorGetTokenDataQuery) {
    return (
      <p className="my-10 text-2xl text-center">
        Token ({collectionId} {tokenNonce}) not found
      </p>
    );
  }

  if (isErrorGatewayTokenDataQuery) {
    return <p className="my-10 text-2xl text-center">Gateway error</p>;
  }

  if (!shouldRenderPage) {
    return <p className="my-10 text-2xl text-center">Loading...</p>;
  }

  let { data: tokenData } = walletAddressParam
    ? gatewayTokenData
    : tokenResponseData;

  const isOurs = !Boolean(tokenResponseData == undefined);
  if (isOurs === true) {
    tokenData = tokenResponseData.data;
  }
  const getBaseTokenData = (tokenData: any) => {
    const token = isOurs ? tokenData.token : tokenData.tokenData;

    const nonce = token.nonce;
    const name = isOurs ? token.tokenName : token.name;
    const ownerWalletAddress = isOurs
      ? tokenData.ownerWalletAddress
      : walletAddressParam;
    const imageLink: string = isOurs
      ? token.imageLink
      : atob(token?.uris?.[0] || "");
    let metadataLink: string = isOurs
      ? token.metadataLink
      : atob(token?.uris?.[1] || "");
    const royaltiesPercent = isOurs
      ? token.royaltiesPercent
      : parseFloat(token.royalties) / 100;
    if (metadataLink.indexOf(".json") == -1) {
      metadataLink = metadataLink + ".json"; //TODO REMOVE , shoudl be added to contract ?
    }
    const baseData = {
      name,
      nonce,
      imageLink,
      metadataLink,
      royaltiesPercent,
      ownerWalletAddress,
    };

    const ourExtraData = isOurs
      ? {
          id: token.id,
          tokenState: token.state,
          ownerName: tokenData.ownerName,
          priceNominal: token.priceNominal,
          auctionDeadline: token.auctionDeadline,
          auctionStartTime: token.auctionStartTime,
        }
      : {
          id: 0,
          ownerName: "",
          tokenState: "",
          priceNominal: 0,
          auctionDeadline: 0,
          auctionStartTime: 0,
        };

    return { ...baseData, ...ourExtraData };
  };

  const {
    nonce,
    imageLink,
    metadataLink,
    name: tokenName,
    auctionDeadline,
    auctionStartTime,
    royaltiesPercent,
    ownerWalletAddress,
    id,
    ownerName,
    tokenState,
    priceNominal: tokenPrice,
  } = getBaseTokenData(tokenData);

  // if (!isOurs && tokenData.tokenData.balance === "0" && walletAddressParam) {

  //     return (<>
  //         <p className="my-10 text-2xl text-center">{walletAddressParam}</p>
  //         <p className="my-10 text-2xl text-center">is not the owner of  {collectionId} {tokenNonce}</p>
  //     </>)

  // }

  if (Boolean(metadataLink) && isUninitializedGetTokenMetadata) {
    getTokenMetadataTrigger({ metadataLink });
  }

  const description = collectionData?.data?.collection?.description;
  const discordLink = collectionData?.data?.collection?.discordLink;
  const twitterLink = collectionData?.data?.collection?.twitterLink;
  const telegramLink = collectionData?.data?.collection?.telegramLink;
  const instagramLink = collectionData?.data?.collection?.instagramLink;
  const websiteLink = collectionData?.data?.collection?.website;

  const isListed: boolean = tokenState === "List";
  const isAuction: boolean = tokenState === "Auction";
  const isOnSale: boolean = isListed || isAuction;
  const onSaleText = isListed ? "Current price" : "Min bid";

  const ownerShortWalletAddress: string = shorterAddress(
    ownerWalletAddress,
    7,
    4
  );
  // const creatorShortWalletAddress: string = shorterAddress(creatorWalletAddress, 7, 4);

  const displayedOwner = Boolean(ownerName)
    ? ownerName
    : ownerShortWalletAddress;
  // const displayedCreator = creatorName ? creatorName : creatorShortWalletAddress;

  const isCurrentTokenOwner: boolean = ownerWalletAddress === userWalletAddress;

  const hasBidderWinner = Boolean(tokenBidsData?.data?.[0]);
  const bidderWinnerName = tokenBidsData?.data?.[0]?.bidderName;
  const isBidderWinnerAddress: boolean =
    tokenBidsData?.data?.[0]?.bid.bidderAddress === userWalletAddress;

  const egldPriceString = egldPriceData?.data;
  const priceTokenDollars = tokenPrice * parseFloat(egldPriceString);
  const priceTokenDollarsFixed = parseFloat(`${priceTokenDollars}`).toFixed(3);

  const nowDate = new Date();
  const auctionDeadlineDate = new Date(auctionDeadline * 1000);
  const auctionStartTimeDate = new Date(auctionStartTime * 1000);
  const auctionDeadlineTitle = moment(
    new Date(auctionDeadlineDate),
    "YYYY-MM-DD HH:mm:ss"
  );
  const auctionStartTimeTitle = moment(
    new Date(auctionStartTimeDate),
    "YYYY-MM-DD HH:mm:ss"
  );

  const isAuctionOngoing: boolean = nowDate < auctionDeadlineDate;
  const hasAuctionFinished: boolean = auctionDeadlineDate < nowDate;
  const hasAuctionStarted: boolean = auctionStartTimeDate < nowDate;

  const hasFinishedWithoutWinner = hasAuctionFinished && !hasBidderWinner;

  const shouldDisplayEndAuctionButton =
    isAuction &&
    !isAuctionOngoing &&
    hasBidderWinner &&
    (isCurrentTokenOwner || isBidderWinnerAddress);

  const offersTableColumns = [
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "c-table_column",
    },
    {
      title: "Expiration",
      dataIndex: "expiration",
      key: "expiration",
      className: "c-table_column",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      className: "c-table_column",
    },
  ];

  const listingTableColumns = [
    {
      title: "Type",
      dataIndex: "event",
      key: "event",
      className: "c-table_column",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "c-table_column",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      className: "c-table_column",
    },
  ];

  const bidsTableColumns = [
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "c-table_column",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      className: "c-table_column",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      className: "c-table_column",
    },
  ];

  const tokenBuys = transactions?.filter(
    (transaction: any) => transaction.type === "Buy"
  );

  const chartData = tokenBuys
    ?.map((buy: any, index: number) => {
      const { priceNominal, timestamp } = buy;

      const date = moment(new Date(timestamp * 1000), "YYYY-MM-DD HH:mm:ss");
      const month = date.format("M");
      const day = date.format("D");

      return {
        name: `${month}/${day}`,
        pv: priceNominal,
      };
    })
    .reverse();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="flex p-4 rounded-xl flex-col justify-center bg-black bg-opacity-50 text-white items-center content-center align-middle">
          <div>Day: {label}</div>
          <div>Price: {payload[0].value}</div>
        </div>
      );
    }

    return null;
  };

  const mapOffersTableData = tokenOffersData?.data?.map(
    (offerData: any, index: number) => {
      const { offer, offerorName } = offerData;
      const {
        amountNominal,
        txHash,
        timestamp,
        expire,
        offerorAddress,
      } = offer;
      const dueDate = new Date(expire * 1000);
      const isCurrentOfferor: boolean = offerorAddress === userWalletAddress;
      const hasAction: boolean = isCurrentTokenOwner || isCurrentOfferor;
      const shorterTx: string = shorterAddress(txHash, 4, 4);
      const txDisplayName = Boolean(offerorName) ? offerorName : shorterTx;

      const shouldDisplayAcceptButton =
        isCurrentTokenOwner && (!hasAuctionStarted || hasFinishedWithoutWinner);

      if (
        offersTableColumns.length === 3 &&
        hasAction &&
        (shouldDisplayAcceptButton || isCurrentOfferor)
      ) {
        offersTableColumns.push({
          title: "Action",
          dataIndex: "action",
          key: "action",
          className: "c-table_column",
        });
      }

      const AcceptOffer: any = (
        <button
          onClick={() => {
            actionsHandlers[ACCEPT_OFFER]({
              offerorAddress,
              amount: amountNominal,
            });
          }}
          className="bg-white bg-opacity-10  text-sm text-white font-bold py-2 px-4 rounded"
        >
          <span>Accept</span>
        </button>
      );

      const CancelOffer: any = (
        <button
          onClick={() => {
            actionsHandlers[CANCEL_OFFER]({ amount: amountNominal });
          }}
          className="bg-white bg-opacity-10  text-sm text-white font-bold py-2 px-4 rounded"
        >
          <span>Cancel</span>
        </button>
      );

      return {
        action: (
          <>
            {isCurrentOfferor && CancelOffer}
            {shouldDisplayAcceptButton && AcceptOffer}
          </>
        ),
        price: `${amountNominal}`,
        expiration: (
          <span className="u-text-theme-gray-mid">
            {moment().to(moment(dueDate))}
          </span>
        ),
        from: (
          <a
            href={`https://explorer.elrond.com/transactions/${txHash}`}
            target="_blank"
          >
            {txDisplayName}
          </a>
        ),
        key: `key-${index}`,
      };
    }
  );

  const tokenListings = transactions?.filter(
    (transaction: any) =>
      transaction.type === "List" || transaction.type === "Auction"
  );

  const mapListingTableData = tokenListings?.map(
    (transaction: any, index: number) => {
      const { priceNominal, timestamp, hash, type } = transaction;

      const mapTypeEvents: any = {
        List: {
          title: "List",
          icon: faIcons.faTags,
        },
        Auction: {
          title: "Auction",
          icon: faIcons.faGavel,
        },
      };

      const event = (
        <>
          <FontAwesomeIcon width={"20px"} icon={mapTypeEvents[type].icon} />
          <span className="inline-block ml-4">{mapTypeEvents[type].title}</span>
        </>
      );

      return {
        event: event,
        price: `${priceNominal}`,
        date: (
          <a
            href={`https://explorer.elrond.com/transactions/${hash}`}
            target="_blank"
          >
            <span className="inline-block mr-2 u-text-theme-blue-anchor">
              {moment().to(moment(timestamp * 1000))}
            </span>
            <FontAwesomeIcon
              width={"10px"}
              className=""
              icon={faIcons.faExternalLinkAlt}
            />
          </a>
        ),
        key: `key-${index}`,
      };
    }
  );

  const mapBidsTableData = tokenBidsData?.data?.map(
    (offerData: any, index: number) => {
      const { bid, bidderName } = offerData;
      const { bidAmountNominal, txHash, timestamp, bidderAddress } = bid;

      const isCurrentBidder: boolean = bidderAddress === userWalletAddress;
      const hasAction: boolean = isCurrentTokenOwner || isCurrentBidder;
      const shorterTx: string = shorterAddress(txHash, 4, 4);
      const txDisplayName = Boolean(bidderName) ? bidderName : shorterTx;

      return {
        price: `${bidAmountNominal}`,
        date: (
          <span className="u-text-theme-gray-mid">
            {moment().to(moment(timestamp * 1000))}
          </span>
        ),
        from: (
          <a
            href={`https://explorer.elrond.com/transactions/${txHash}`}
            target="_blank"
          >
            {txDisplayName}
          </a>
        ),
        key: `key-${index}`,
      };
    }
  );

  const activityTableColumns = [
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      className: "c-table_column",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      className: "c-table_column",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      className: "c-table_column",
    },
  ];

  const mapActivityTableData = transactions?.map(
    (transaction: any, index: number) => {
      const { type, timestamp, priceNominal, hash } = transaction;

      const mapTypeEvents: any = {
        List: {
          title: "List",
          icon: faIcons.faTags,
        },
        Withdraw: {
          title: "Withdraw",
          icon: faIcons.faHandHolding,
        },
        Auction: {
          title: "Auction",
          icon: faIcons.faGavel,
        },
        Buy: {
          title: "Buy",
          icon: faIcons.faShoppingCart,
        },
      };

      const event = (
        <>
          <FontAwesomeIcon width={"20px"} icon={mapTypeEvents[type].icon} />
          <span className="inline-block ml-4">{mapTypeEvents[type].title}</span>
        </>
      );

      return {
        event: event,
        price: priceNominal,
        date: (
          <a
            href={`https://explorer.elrond.com/transactions/${hash}`}
            target="_blank"
          >
            <span className="inline-block mr-2 u-text-theme-blue-anchor">
              {moment().to(moment(timestamp * 1000))}
            </span>
            <FontAwesomeIcon
              width={"10px"}
              className=""
              icon={faIcons.faExternalLinkAlt}
            />
          </a>
        ),
        key: `key-${index}`,
      };
    }
  );

  const handleBuyAction = async () => {
    const getBuyNFTResponse: any = await getBuyNftTemplateQueryTrigger({
      userWalletAddress,
      collectionId,
      tokenNonce,
      price: tokenPrice,
    });

    if (getBuyNFTResponse.error) {
      const {
        status,
        data: { error },
      } = getBuyNFTResponse.error;

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

    const { data: txData } = getBuyNFTResponse.data;

    const unconsumedTransaction = prepareTransaction(txData);

    sendTransaction({
      transaction: unconsumedTransaction,
      callbackRoute: "/account",
    });
  };

  const handleWithdrawAction = async () => {
    const getWithdrawNFTResponse: any = await getWithdrawNftTemplateQueryTrigger(
      { userWalletAddress, collectionId, tokenNonce }
    );

    if (getWithdrawNFTResponse.error) {
      const {
        status,
        data: { error },
      } = getWithdrawNFTResponse.error;

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

    const { data: txData } = getWithdrawNFTResponse.data;

    const unconsumedTransaction = prepareTransaction(txData);

    sendTransaction({
      transaction: unconsumedTransaction,
      callbackRoute: "/account",
    });
  };

  const signTemplateTransaction = async (settings: any) => {
    const {
      getTemplateTrigger,
      getTemplateData,
      succesCallbackRoute,
    } = settings;

    const response: any = await getTemplateTrigger({ ...getTemplateData });

    if (response.error) {
      const {
        status,
        data: { error },
      } = response.error;

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

    const { data: txData } = response.data;

    const unconsumedTransaction = prepareTransaction(txData);

    sendTransaction({
      transaction: unconsumedTransaction,
      callbackRoute: succesCallbackRoute,
    });
  };

  const handleMakeOffer = () => {
    const getTemplateData = {
      userWalletAddress,
      collectionId,
      tokenNonce,
      amount: offerAmount,
      expire: new Date(expireOffer).getTime() / 1000,
    };

    setOfferAmount(0);

    signTemplateTransaction({
      succesCallbackRoute: pathname,
      getTemplateData: getTemplateData,
      getTemplateTrigger: getMakeOfferTemplateTrigger,
    });
  };

  const handleMakeBid = () => {
    const getTemplateData = {
      userWalletAddress,
      collectionId,
      tokenNonce,
      payment: 0,
      bidAmount: offerAmount,
    };

    setOfferAmount(0);

    signTemplateTransaction({
      succesCallbackRoute: pathname,
      getTemplateData: getTemplateData,
      getTemplateTrigger: getMakeBidTemplateTrigger,
    });
  };

  const handleAcceptOffer = ({
    offerorAddress,
    amount,
  }: {
    offerorAddress: string;
    amount: number;
  }) => {
    const getTemplateData = {
      userWalletAddress,
      collectionId,
      tokenNonce,
      offerorAddress,
      amount,
    };

    signTemplateTransaction({
      succesCallbackRoute: "/account",
      getTemplateData: getTemplateData,
      getTemplateTrigger: getAcceptOfferTemplateTrigger,
    });
  };

  const handleEndAuction = () => {
    const getTemplateData = {
      userWalletAddress,
      collectionId,
      tokenNonce,
    };

    signTemplateTransaction({
      succesCallbackRoute: "/account",
      getTemplateData: getTemplateData,
      getTemplateTrigger: getEndAuctionTemplateTrigger,
    });
  };

  const handleCancelOffer = ({ amount }: { amount: number }) => {
    const getTemplateData = {
      userWalletAddress,
      collectionId,
      tokenNonce,
      amount,
    };

    signTemplateTransaction({
      succesCallbackRoute: "/account",
      getTemplateData: getTemplateData,
      getTemplateTrigger: getCancelOfferTemplateTrigger,
    });
  };

  const actionHandlerWrapper = (callback?: Function) => {
    return ({ ...rest }) => {
      if (!loggedIn) {
        dispatch(setShouldDisplayWalletSidebar(true));
        return;
      }

      callback?.({ ...rest });
    };
  };

  const actionsHandlers: { [key: string]: any } = {
    [BUY]: actionHandlerWrapper(handleBuyAction),
    [SELL]: actionHandlerWrapper(handleBuyAction),
    [MAKE_BID]: actionHandlerWrapper(handleMakeBid),
    [MAKE_OFFER]: actionHandlerWrapper(handleMakeOffer),
    [END_AUCTION]: actionHandlerWrapper(handleEndAuction),
    [WITHDRAW]: actionHandlerWrapper(handleWithdrawAction),
    [CANCEL_OFFER]: actionHandlerWrapper(handleCancelOffer),
    [ACCEPT_OFFER]: actionHandlerWrapper(handleAcceptOffer),
  };

  const isERD721 = Boolean(tokenMetadataData?.data?.attributes?.length);

  const TokenHeader = (
    <>
      <div className="text-right">
        <ul className="c-icon-band">
          <li
            onClick={() => {
              toast.success(`Refresh metadata queued`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
              });

              refreshMetadataTrigger({ collectionId, tokenNonce });
            }}
            className="c-icon-band_item text-gray-500 hover:text-gray-300 cursor-pointer"
          >
            <FontAwesomeIcon
              style={{
                width: 20,
                height: 20,
                margin: "10px 15px 5px 15px",
                cursor: "pointer",
              }}
              className="inline-block "
              icon={faIcons.faRedoAlt}
            />
          </li>
        </ul>
      </div>

      {!isErrorGetCollectionData && (
        <p className="u-margin-top-spacing-3 u-margin-bottom-spacing-5 u-text-small">
          <Link to={`/collection/${collectionId}`}>
            {collectionData?.data?.collection?.name || collectionId}
          </Link>
        </p>
      )}

      <h2 className="u-regular-heading u-text-bold u-margin-bottom-spacing-5">
        {tokenName}
      </h2>

      {Boolean(ownerWalletAddress) && (
        <p className="u-margin-bottom-spacing-5 u-text-small">
          <span className="u-text-theme-gray-mid">Owned by </span>{" "}
          <Link to={`/profile/${ownerWalletAddress}`}>{displayedOwner}</Link>
        </p>
      )}
    </>
  );

  return (
    <div className="p-token-page">
      <div className="grid grid-cols-12 my-10">
        <div className="col-span-12">
          <div className="grid grid-cols-12  container-max">
            <div className="col-span-12 md:hidden px-4">{TokenHeader}</div>

            <div className="col-span-12 md:col-span-6 p-token-page_visual-holder u-margin-bottom-spacing-4 justify-center px-6">
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

              <div className="p-token-page_token-data u-border-radius-2 u-overflow-hidden">
                <Collapsible
                  transitionTime={50}
                  classParentString="c-accordion c-accordion--no-content-padding"
                  trigger={
                    <div className="c-accordion_trigger">
                      <span className="c-accordion_trigger_icon">
                        <FontAwesomeIcon
                          width={"20px"}
                          className="c-navbar_icon-link"
                          icon={faIcons.faFingerprint}
                        />
                      </span>
                      <span className="c-accordion_trigger_title">
                        Properties
                      </span>
                    </div>
                  }
                >
                  <div className="c-accordion_content flex flex-wrap justify-center py-4">
                    {tokenMetadataData?.data?.attributes?.map(
                      (attribute: any) => {
                        const { trait_type, value } = attribute;

                        const itemsTotal =
                          collectionData?.data?.statistics?.itemsTotal || 0;

                        const trait = collectionData?.data?.statistics?.attributes?.find(
                          (attribute: any) => {
                            return (
                              attribute.trait_type === trait_type &&
                              attribute.value === value
                            );
                          }
                        );

                        return (
                          <div className="c-property">
                            <div className="c-property_type">{trait_type}</div>
                            <div className="c-property_value">{value}</div>
                            {itemsTotal && trait && (
                              <div className="c-property_rarity">
                                {((100 * trait.total) / itemsTotal).toFixed(2)}%
                                have this trait
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </Collapsible>

                <Collapsible
                  transitionTime={50}
                  className="c-accordion"
                  trigger={
                    <div className="c-accordion_trigger">
                      <span className="c-accordion_trigger_icon">
                        <FontAwesomeIcon
                          width={"20px"}
                          className="c-navbar_icon-link"
                          icon={faIcons.faThList}
                        />
                      </span>
                      <span className="c-accordion_trigger_title">
                        About collection
                      </span>
                    </div>
                  }
                >
                  <div className="c-accordion_content">
                    {description && (
                      <p className="u-text-small mb-8">
                        <span className="u-text-theme-gray-light">
                          {description}
                        </span>
                      </p>
                    )}

                    <ul className="c-icon-band">
                      {websiteLink && (
                        <li className="c-icon-band_item">
                          <a
                            href={websiteLink}
                            target="_blank"
                            className="c-icon-band_link"
                          >
                            <FontAwesomeIcon
                              width={"20px"}
                              className="c-icon-band_icon"
                              icon={faIcons.faGlobe}
                            />
                          </a>
                        </li>
                      )}

                      {twitterLink && (
                        <li className="c-icon-band_item">
                          <a
                            href={`https://twitter.com/${twitterLink}`}
                            target="_blank"
                            className="c-icon-band_link"
                          >
                            <FontAwesomeIcon
                              width={"20px"}
                              className="c-icon-band_icon"
                              icon={faBrands.faTwitter}
                            />
                          </a>
                        </li>
                      )}

                      {discordLink && (
                        <li className="c-icon-band_item">
                          <a
                            href={`https://discord.gg/${discordLink}`}
                            target="_blank"
                            className="c-icon-band_link"
                          >
                            <FontAwesomeIcon
                              width={"20px"}
                              className="c-icon-band_icon"
                              icon={faBrands.faDiscord}
                            />
                          </a>
                        </li>
                      )}

                      {telegramLink && (
                        <li className="c-icon-band_item">
                          <a
                            href={`https://t.me/${telegramLink}`}
                            target="_blank"
                            className="c-icon-band_link"
                          >
                            <FontAwesomeIcon
                              width={"20px"}
                              className="c-icon-band_icon"
                              icon={faBrands.faTelegram}
                            />
                          </a>
                        </li>
                      )}

                      {instagramLink && (
                        <li className="c-icon-band_item">
                          <a
                            href={`https://instagram.com/${instagramLink}`}
                            target="_blank"
                            className="c-icon-band_link"
                          >
                            <FontAwesomeIcon
                              width={"20px"}
                              className="c-icon-band_icon"
                              icon={faBrands.faInstagram}
                            />
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </Collapsible>

                <Collapsible
                  transitionTime={50}
                  className="c-accordion"
                  trigger={
                    <div className="c-accordion_trigger">
                      <span className="c-accordion_trigger_icon">
                        <FontAwesomeIcon
                          width={"20px"}
                          className="c-navbar_icon-link"
                          icon={faIcons.faAddressCard}
                        />
                      </span>
                      <span className="c-accordion_trigger_title">Details</span>
                    </div>
                  }
                >
                  <div className="c-accordion_content">
                    {collectionData?.data?.creatorWalletAddress && (
                      <p className="flex justify-between u-text-small my-3">
                        <span className="u-text-theme-gray-light">
                          Creator Address
                        </span>

                        <span className="u-text-theme-gray-mid">
                          <a
                            href={`/${collectionData.data.creatorWalletAddress}`}
                          >
                            {shorterAddress(
                              collectionData.data.creatorWalletAddress,
                              4,
                              4
                            )}
                          </a>
                        </span>
                      </p>
                    )}

                    <p className="flex justify-between u-text-small my-3">
                      <span className="u-text-theme-gray-light">Token ID</span>

                      <span className="u-text-theme-gray-mid">
                        {collectionId}
                      </span>
                    </p>

                    <p className="flex justify-between u-text-small my-3">
                      <span className="u-text-theme-gray-light">
                        Token Nonce
                      </span>

                      <span className="u-text-theme-gray-mid">
                        {tokenNonce}
                      </span>
                    </p>

                    {isERD721 && (
                      <p className="flex justify-between u-text-small my-3">
                        <span className="u-text-theme-gray-light">
                          Token Standard
                        </span>

                        <span className="u-text-theme-gray-mid">
                          {"ERD-721"}
                        </span>
                      </p>
                    )}

                    <p className="flex justify-between u-text-small my-3">
                      <span className="u-text-theme-gray-light">
                        Blockchain
                      </span>

                      <span className="u-text-theme-gray-mid">{"Elrond"}</span>
                    </p>

                    {metadataLink && (
                      <p className="flex justify-between u-text-small my-3">
                        <span className="u-text-theme-gray-light">
                          Metadata
                        </span>

                        <span className="u-text-theme-anchor-link">
                          <a href={metadataLink} target="_blank">
                            <FontAwesomeIcon
                              style={{
                                width: 15,
                                height: 15,
                                cursor: "pointer",
                              }}
                              className="inline-block "
                              icon={faIcons.faExternalLinkAlt}
                            />
                          </a>
                        </span>
                      </p>
                    )}

                    {imageLink && (
                      <p className="flex justify-between u-text-small my-3">
                        <span className="u-text-theme-gray-light">Asset</span>

                        <span className="u-text-theme-anchor-link">
                          <a href={imageLink} target="_blank">
                            <FontAwesomeIcon
                              style={{
                                width: 15,
                                height: 15,
                                cursor: "pointer",
                              }}
                              className="inline-block "
                              icon={faIcons.faExternalLinkAlt}
                            />
                          </a>
                        </span>
                      </p>
                    )}
                  </div>
                </Collapsible>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 px-6">
              <div className="hidden md:block">{TokenHeader}</div>

              <div className="u-border-radius-2 u-overflow-hidden my-10">
                {
                  <Collapsible
                    open={true}
                    triggerDisabled={true}
                    transitionTime={50}
                    classParentString="c-accordion"
                    trigger={
                      isAuction ? (
                        <div className="c-accordion_trigger">
                          <span className="c-accordion_trigger_icon">
                            <FontAwesomeIcon
                              width={"20px"}
                              className="c-navbar_icon-link u-text-theme-gray-mid"
                              icon={faIcons.faClock}
                            />
                          </span>

                          {!isAuctionOngoing && (
                            <div className="w-full">
                              {" "}
                              <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                Sale has ended
                              </p>{" "}
                            </div>
                          )}

                          <div className="w-full">
                            {!hasAuctionStarted && (
                              <>
                                <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                  Sale starts{" "}
                                  {auctionStartTimeTitle.format(
                                    "MMM Do, YYYY HH:mm"
                                  )}
                                </p>
                              </>
                            )}
                            {isAuctionOngoing && (
                              <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                                Sale ends{" "}
                                {auctionDeadlineTitle.format(
                                  "MMM Do, YYYY HH:mm"
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="c-accordion_trigger">
                          {
                            <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                              Fixed price
                            </p>
                          }
                        </div>
                      )
                    }
                  >
                    <div className="c-accordion_content">
                      {isOnSale && (
                        <>
                          <p className="u-margin-bottom-spacing-0 u-text-small u-text-theme-gray-mid ">
                            {onSaleText}
                          </p>
                          <p className="u-margin-bottom-spacing-3">
                            <span className="u-regular-heading u-text-bold u-text-theme-gray-light">
                              {tokenPrice}{" "}
                            </span>
                            <span className="u-text-bold u-text-theme-gray-mid">
                              {" "}
                              EGLD{" "}
                            </span>
                            <span className="u-text-theme-gray-mid">
                              (${priceTokenDollarsFixed})
                            </span>
                          </p>
                        </>
                      )}

                      {!isOnSale && isCurrentTokenOwner && (
                        <div>
                          <Link
                            to={`/token/${ownerWalletAddress}/${collectionId}/${tokenNonce}/sell`}
                            className="c-button c-button--primary u-margin-right-spacing-2"
                          >
                            <span className="u-padding-right-spacing-2">
                              <FontAwesomeIcon
                                width={"20px"}
                                className="c-navbar_icon-link"
                                icon={faIcons.faWallet}
                              />
                            </span>
                            <span>Sell</span>
                          </Link>
                        </div>
                      )

                      // !isOnSale &&
                      // <div>
                      //      <div className="c-button c-button--primary u-margin-right-spacing-2"  onClick={alphaToastMessage}>
                      //         <span className="u-padding-right-spacing-2">
                      //             <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                      //         </span>
                      //         <span>
                      //             Sell
                      //         </span>
                      //     </div>
                      // </div>
                      }

                      {isOnSale &&
                        isCurrentTokenOwner &&
                        !(!isAuctionOngoing && hasBidderWinner) && (
                          <button
                            onClick={actionsHandlers[WITHDRAW]}
                            className="c-button c-button--primary u-margin-right-spacing-2"
                          >
                            <span className="u-padding-right-spacing-2">
                              <FontAwesomeIcon
                                width={"20px"}
                                className="c-navbar_icon-link"
                                icon={faIcons.faWallet}
                              />
                            </span>
                            <span>Widthdraw</span>
                          </button>
                        )}

                      {shouldDisplayEndAuctionButton && (
                        <button
                          onClick={actionsHandlers[END_AUCTION]}
                          className="c-button c-button--primary u-margin-right-spacing-2"
                        >
                          <span className="u-padding-right-spacing-2">
                            <FontAwesomeIcon
                              width={"20px"}
                              className="c-navbar_icon-link"
                              icon={faIcons.faWallet}
                            />
                          </span>
                          <span>End auction</span>
                        </button>
                      )}

                      {isOnSale && !isCurrentTokenOwner && (
                        <div>
                          {isListed && (
                            <button
                              onClick={actionsHandlers[BUY]}
                              className="c-button c-button--primary u-margin-right-spacing-2"
                            >
                              <span className="u-padding-right-spacing-2">
                                <FontAwesomeIcon
                                  width={"20px"}
                                  className="c-navbar_icon-link"
                                  icon={faIcons.faWallet}
                                />
                              </span>
                              <span>Buy now</span>
                            </button>
                          )}

                          {isAuction && isAuctionOngoing && (
                            <Popup
                              modal
                              className="c-modal_container"
                              trigger={
                                <button className="c-button c-button--primary u-margin-right-spacing-2">
                                  <span className="u-padding-right-spacing-2">
                                    <FontAwesomeIcon
                                      width={"20px"}
                                      className="c-navbar_icon-link"
                                      icon={faIcons.faTag}
                                    />
                                  </span>
                                  <span>Place bid</span>
                                </button>
                              }
                            >
                              {(close: any) => (
                                <div className="c-modal rounded-2xl">
                                  <div className="text-right px-10">
                                    <button
                                      className="c-modal_close text-4xl"
                                      onClick={close}
                                    >
                                      &times;
                                    </button>
                                  </div>

                                  <div className="c-modal_header text-2xl  pb-6 ">
                                    {" "}
                                    Place bid{" "}
                                  </div>
                                  <div className="c-modal_content">
                                    <div className="px-10 pt-8">
                                      <input
                                        onChange={(e: any) => {
                                          setOfferAmount(e.target.value);
                                        }}
                                        placeholder="Bid amount (EGLD)"
                                        type="number"
                                        className="bg-opacity-10 mb-8 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full"
                                      />

                                      <div className="text-center">
                                        <button
                                          onClick={actionsHandlers[MAKE_BID]}
                                          className="c-button c-button--primary u-margin-right-spacing-2"
                                        >
                                          <span>Send bid</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Popup>
                          )}

                          {!(isAuction && hasBidderWinner) && (
                            <Popup
                              modal
                              className="c-modal_container"
                              trigger={
                                <button className="c-button  c-button--secondary u-margin-top-spacing-2">
                                  <span className="u-padding-right-spacing-2">
                                    <FontAwesomeIcon
                                      width={"20px"}
                                      className="c-navbar_icon-link"
                                      icon={faIcons.faTag}
                                    />
                                  </span>
                                  <span>Make offer</span>
                                </button>
                              }
                            >
                              {(close: any) => (
                                <div className="c-modal rounded-2xl">
                                  <div className="text-right px-10">
                                    <button
                                      className="c-modal_close text-4xl"
                                      onClick={close}
                                    >
                                      &times;
                                    </button>
                                  </div>

                                  <div className="c-modal_header text-2xl  pb-6 ">
                                    {" "}
                                    Make an offer{" "}
                                  </div>
                                  <div className="c-modal_content">
                                    <div className="px-10 pt-8">
                                      <div className="mb-4 text-center">
                                        <p className="text-ceneter u-text-small mb-2">
                                          <span className="u-text-theme-gray-light">
                                            Offer expire date
                                          </span>

                                          {/* <span className="u-text-theme-gray-mid">
        <FontAwesomeIcon width={'20px'} icon={faIcons.faInfoCircle} />
    </span>
*/}
                                        </p>

                                        <div className="c-date-time-picker">
                                          <DateTimePicker
                                            value={expireOffer}
                                            onChange={(value: any) => {
                                              setExpireOffer(value);
                                            }}
                                          />
                                        </div>
                                      </div>

                                      <input
                                        onChange={(e: any) => {
                                          setOfferAmount(e.target.value);
                                        }}
                                        placeholder="Offer amount (EGLD)"
                                        type="number"
                                        className=" text-center bg-opacity-10 mb-8 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full"
                                      />

                                      <div className="text-center">
                                        <button
                                          onClick={actionsHandlers[MAKE_OFFER]}
                                          className="c-button c-button--primary u-margin-right-spacing-2"
                                        >
                                          <span>Send Offer</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Popup>
                          )}
                        </div>
                      )}
                    </div>
                  </Collapsible>
                }
              </div>

              <div className="u-border-radius-2 u-overflow-hidden my-10">
                <Collapsible
                  open={true}
                  transitionTime={50}
                  classParentString="c-accordion c-accordion--no-content-padding"
                  trigger={
                    <div className="c-accordion_trigger">
                      <span className="c-accordion_trigger_icon">
                        <FontAwesomeIcon
                          width={"20px"}
                          className="c-navbar_icon-link"
                          icon={faIcons.faTags}
                        />
                      </span>
                      <span className="c-accordion_trigger_title">
                        Listings
                      </span>
                    </div>
                  }
                >
                  <div className="c-accordion_content">
                    {/* <div className="py-10">
                                            <p className="u-tac u-margin-bottom-spacing-4">

                                                <FontAwesomeIcon size="3x" className="u-text-theme-gray-mid" icon={faIcons.faSearchMinus} />

                                            </p>

                                            <p className="u-text-small u-tac u-text-theme-gray-mid">No listings yet</p>
                                        </div> */}

                    <Table
                      className="c-table"
                      rowClassName="c-table_row"
                      columns={listingTableColumns}
                      data={mapListingTableData}
                    />
                    {hasLoadMoreActivity && (
                      <div className="text-center my-10">
                        <button
                          onClick={() => {
                            triggerActivityLoad({ mergeWithExisting: true });
                          }}
                          className="c-button c-button--secondary"
                        >
                          Load more
                        </button>
                      </div>
                    )}
                  </div>
                </Collapsible>
              </div>

              {
                <div className="u-border-radius-2 u-overflow-hidden my-10">
                  <Collapsible
                    open={true}
                    transitionTime={50}
                    classParentString="c-accordion c-accordion--no-content-padding"
                    trigger={
                      <div className="c-accordion_trigger">
                        <span className="c-accordion_trigger_icon">
                          <FontAwesomeIcon
                            width={"20px"}
                            className="c-navbar_icon-link"
                            icon={faIcons.faList}
                          />
                        </span>
                        <span className="c-accordion_trigger_title">
                          Offers
                        </span>
                      </div>
                    }
                  >
                    <div className="c-accordion_content">
                      {Boolean(mapOffersTableData?.length) ? (
                        <Table
                          className="c-table"
                          rowClassName="c-table_row"
                          columns={offersTableColumns}
                          data={mapOffersTableData}
                        />
                      ) : (
                        <div className="py-10">
                          <p className="u-tac u-margin-bottom-spacing-4">
                            <FontAwesomeIcon
                              size="3x"
                              className="u-text-theme-gray-mid"
                              icon={faIcons.faSearchMinus}
                            />
                          </p>

                          <p className="u-text-small u-tac u-text-theme-gray-mid">
                            No offers yet
                          </p>
                        </div>
                      )}
                    </div>
                  </Collapsible>
                </div>
              }

              {(
                <div className="u-border-radius-2 u-overflow-hidden my-10">
                  <Collapsible
                    open={true}
                    transitionTime={50}
                    classParentString="c-accordion c-accordion--no-content-padding"
                    trigger={
                      <div className="c-accordion_trigger">
                        <span className="c-accordion_trigger_icon">
                          <FontAwesomeIcon
                            width={"20px"}
                            className="c-navbar_icon-link"
                            icon={faIcons.faGavel}
                          />
                        </span>
                        <span className="c-accordion_trigger_title">Bids</span>
                      </div>
                    }
                  >
                    <div className="c-accordion_content">
                      {Boolean(mapBidsTableData?.length) ? (
                        <Table
                          className="c-table"
                          rowClassName="c-table_row"
                          columns={bidsTableColumns}
                          data={mapBidsTableData}
                        />
                      ) : (
                        <div className="py-10">
                          <p className="u-tac u-margin-bottom-spacing-4">
                            <FontAwesomeIcon
                              size="3x"
                              className="u-text-theme-gray-mid"
                              icon={faIcons.faSearchMinus}
                            />
                          </p>

                          <p className="u-text-small u-tac u-text-theme-gray-mid">
                            No bids yet
                          </p>
                        </div>
                      )}
                    </div>
                  </Collapsible>
                </div>
              )}

              <div className="u-border-radius-2 u-overflow-hidden my-10">
                <Collapsible
                  transitionTime={50}
                  classParentString="c-accordion"
                  trigger={
                    <div className="c-accordion_trigger">
                      <span className="c-accordion_trigger_icon">
                        <FontAwesomeIcon
                          width={"20px"}
                          className="c-navbar_icon-link"
                          icon={faIcons.faChartLine}
                        />
                      </span>
                      <span className="c-accordion_trigger_title">
                        Price History
                      </span>
                    </div>
                  }
                >
                  <div
                    className={`c-accordion_content ${Boolean(
                      chartData?.length
                    ) && "h-96"} `}
                  >
                    {Boolean(chartData?.length) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          width={500}
                          height={300}
                          data={chartData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <XAxis dy={15} dataKey="name" />
                          <YAxis dx={-15} interval={0} />
                          <Tooltip content={CustomTooltip} />
                          <CartesianGrid vertical={false} stroke="#000" />

                          <Line
                            type="monotone"
                            dataKey="pv"
                            stroke="#2081e2"
                            strokeWidth={3}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="py-10">
                        <p className="u-tac u-margin-bottom-spacing-4">
                          <FontAwesomeIcon
                            size="3x"
                            className="u-text-theme-gray-mid"
                            icon={faIcons.faSearchMinus}
                          />
                        </p>

                        <p className="u-text-small u-tac u-text-theme-gray-mid">
                          No price history yet
                        </p>
                      </div>
                    )}
                  </div>
                </Collapsible>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12  container-max my-4">
            <div className="col-span-12 px-6 mb-6">
              <div className="u-border-radius-2 u-overflow-hidden">
                <Collapsible
                  transitionTime={50}
                  classParentString="c-accordion c-accordion--no-content-padding"
                  trigger={
                    <div className="c-accordion_trigger">
                      <span className="c-accordion_trigger_icon">
                        <FontAwesomeIcon
                          width={"20px"}
                          className="c-navbar_icon-link"
                          icon={faIcons.faExchangeAlt}
                        />
                      </span>
                      <span className="c-accordion_trigger_title">
                        Token Activity
                      </span>
                    </div>
                  }
                >
                  <div className="c-accordion_content">
                    {Boolean(transactions?.length) ? (
                      <Table
                        className="c-table"
                        rowClassName="c-table_row"
                        columns={activityTableColumns}
                        data={mapActivityTableData}
                      />
                    ) : (
                      <div className="py-10">
                        <p className="u-tac u-margin-bottom-spacing-4">
                          <FontAwesomeIcon
                            size="3x"
                            className="u-text-theme-gray-mid"
                            icon={faIcons.faSearchMinus}
                          />
                        </p>
                        <p className="u-text-small u-tac u-text-theme-gray-mid">
                          No activity yet
                        </p>
                      </div>
                    )}
                    {hasLoadMoreActivity && (
                      <div className="text-center my-10">
                        <button
                          onClick={() => {
                            triggerActivityLoad({ mergeWithExisting: true });
                          }}
                          className="c-button c-button--secondary"
                        >
                          Load more
                        </button>
                      </div>
                    )}
                  </div>
                </Collapsible>
              </div>
            </div>

            <div className="col-span-12 px-6 text-center">
              {collectionId && (
                <Link
                  to={`/collection/${collectionId}`}
                  className="c-button  c-button--secondary u-margin-top-spacing-2"
                >
                  View Collection
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;
