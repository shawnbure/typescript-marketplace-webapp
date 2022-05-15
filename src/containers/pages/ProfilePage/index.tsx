import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from "react-collapsible";
import { Link, useParams, useLocation, Redirect } from "react-router-dom";
import * as faIcons from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { formatHexMetaImage, formatImgLink, shorterAddress } from "utils";
import {
  useGetAccountCollectionsMutation,
  useGetAccountMutation,
  useGetAccountTokensMutation,
  useGetOnSaleAccountTokensMutation,
  useGetAccountGatewayTokensMutation,
  useGetOnStakeAccountTokensMutation,
} from "services/accounts";
import { UrlParameters } from "./interfaces";
import { routePaths } from "constants/router";
import { Collapse } from "components";
import * as faBrands from "@fortawesome/free-brands-svg-icons";
import { Footer } from 'components/index';

/* temporary hot fixes */
import {releaseFeaureStaking} from 'configs/dappConfig';


export const ProfilePage: (props: any) => any = ({}) => {
  const { walletAddress: walletAddressParam } = useParams<UrlParameters>();

  const { pathname } = useLocation();

  const { loggedIn, address: userAddress } = Dapp.useContext();

  // const shortUserWalletAddress: string = shorterAddress(userWalletAddress, 7, 4);

  const [
    getAccountRequestTrigger,
    {
      data: accountData,
      isLoading: isLoadingGetAccountRequest,
      isUninitialized: isUninitializedGetAccountRequest,
    },
  ] = useGetAccountMutation();

  const [
    getAccountTokensRequestTrigger,
    {
      data: accountTokensData,
      isLoading: isLoadingAccountTokensRequest,
      isUninitialized: isUninitializedAccountTokensRequest,
    },
  ] = useGetAccountTokensMutation();

  const [
    getOnSaleAccountTokensRequestTrigger,
    {
      data: accountOnSaleTokenData,
      isLoading: isLoadingOnSaleAccountTokensRequest,
      isUninitialized: isUninitializedOnSaleAccountTokensRequest,
    },
  ] = useGetOnSaleAccountTokensMutation();

  const [
    getOnStakeAccountTokensRequestTrigger,
    {
      data: accountOnStakeTokenData,
      isLoading: isLoadingOnStakeAccountTokensRequest,
      isUninitialized: isUninitializedOnStakeAccountTokensRequest,
    },
  ] = useGetOnStakeAccountTokensMutation();


  const [
    getAccountGatewayRequestTrigger,
    {
      data: accountGatewayData,
      isLoading: isLoadingAccountGatewayRequest,
      isUninitialized: isUninitializedAccountGatewayRequest,
    },
  ] = useGetAccountGatewayTokensMutation();

  



  const [
    getAccountCollectionsTrigger,
    {
      data: accountCollections,
      isLoading: isLoadingAccountCollectionsRequest,
      isUninitialized: isUninitializedAccountCollectionsRequest,
    },
  ] = useGetAccountCollectionsMutation();

  const isAccountPath = pathname === "/account";
  const userWalletAddress = walletAddressParam
    ? walletAddressParam
    : userAddress;
  const isOwnProfile = loggedIn && !walletAddressParam && isAccountPath;

  const [onSaleNfts, setOnSaleNfts] = useState<Array<any>>([]);
  const [unlistedNfts, setUnlistedNfts] = useState<Array<any>>([]);
  const [onStakeNfts, setOnStakeNfts] = useState<Array<any>>([]);
  const [availableTokens, setAvailableTokens] = useState<any>({});
  const [userCollections, setUserCollections] = useState<Array<any>>([]);

  const [loadMoreOnSale, setLoadMoreOnSale] = useState<boolean>(true);
  const [loadMoreOnStake, setLoadMoreOnStake] = useState<boolean>(true);
  const [loadMoreUnlisted, setLoadMoreUnlisted] = useState<boolean>(true);
  const [loadMoreCollections, setLoadMoreCollections] = useState<boolean>(true);



  // hold all the NFTs that are unlisted - only gets called once initial load - the base collection to bench from
  const [unlistedNftsNoLimits, setUnlistedNftsNoLimits] = useState<Array<any>>([]);

  // the list to "grow from" when press "load more" which will put it into the unlistedNFTs
  const [unlistedNftsFiltered, setUnlistedNftsFiltered] = useState<Array<any>>([]);
  
  // number of "get more" nfts offset size
  const [unlistedNftsNoLimitsOffset, setUnlistedNftsNoLimitsOffset] = useState(16);



  // const shouldRedirectHome = !loggedIn && !walletAddressParam;




  // ================================== UNLISTED NFTS ==================================

  const InitialLoadOfUnlistedData = async (
    getFunctionTrigger: any,
    ) => {

    ShowElement("pLoadingUnlistedNFTs");

    let hasFetchedNewData = false;  

    var offset = 0
    var limit = 25
    var gotAllRecords = false
    var arrayNFTs = new Array()

    do 
    {
      const dataResponse = await getFunctionTrigger({ userWalletAddress, limit, offset});

      if (!dataResponse.data) {
        gotAllRecords = true
        
      }      

      //extract out nft and token data
      const { nfts, availableTokensData } = dataResponse.data;

      const newNFTs = [...nfts];

      if( newNFTs.length == 0 )
      {
        gotAllRecords = true

        break;
      }

      arrayNFTs = [...arrayNFTs, ...nfts];

      setAvailableTokens({ ...availableTokens, ...availableTokensData });
      
      offset += limit
    }
    while (!gotAllRecords);

    if( gotAllRecords )
    {
      HideElement("pLoadingUnlistedNFTs");
    }

    setUnlistedNftsNoLimits(arrayNFTs);

    //inital so set it to the "filtered"
    setUnlistedNftsFiltered(arrayNFTs);

    const startIndex = 0
    const offsetLength = unlistedNftsNoLimitsOffset
    const arraySplice = arrayNFTs.slice(startIndex,offsetLength)
    setUnlistedNfts(arraySplice)

  };

  

  const GetMoreUnlistedProcess = async () => {
  
    const startIndex = 0
    const offsetLength =  unlistedNfts.length + unlistedNftsNoLimitsOffset
    const arraySlice = unlistedNftsFiltered.slice(startIndex,offsetLength)

    setUnlistedNfts(arraySlice)
        
    setLoadMoreUnlisted(unlistedNftsFiltered.length > arraySlice.length);
    
    return {
      hasFetchedNewData : true,
    };

    /*
    const displayLoadMoreBool = arraySplice.length < unlistedNftsNoLimits.length

    return {
      displayLoadMore : displayLoadMoreBool,
    };
    */
    };




    function HideElement(elementID: string)
    {
        var element = document.getElementById(elementID) as HTMLInputElement;

        if( element != null )
        {
          element.hidden = true;
        }        
    }
    
    function ShowElement(elementID: string)
    {
        var element = document.getElementById(elementID) as HTMLInputElement;

        if( element != null )
        {
          element.hidden = false;
        }           
    }




  const handleFilterOnSale = async () => {

    alert("handle Filter On Sale")
    
  }

  const handleFilterUnlisted = async () =>
   {
    //filter on the existing 
    let filteredArray = unlistedNftsNoLimits.filter(function (record) {
      // the current value is an object, so you can check on its properties
      return record.name.toLowerCase().includes(GetTextboxValue("txtFilterUnlisted").toLowerCase()) || 
             record.collection.toLowerCase().includes(GetTextboxValue("txtFilterUnlisted").toLowerCase());
    });
    
    
    setUnlistedNftsFiltered(filteredArray);

    const startIndex = 0
    const offsetLength =  unlistedNftsNoLimitsOffset
    const arraySlice = filteredArray.slice(startIndex,offsetLength)
    
    setUnlistedNfts(arraySlice)

    const bLoadMoreDisplay = filteredArray.length > unlistedNftsNoLimitsOffset


    setLoadMoreUnlisted(bLoadMoreDisplay);

  }
  
  const handleFilterUnlistedReset = async () => 
  {
      setUnlistedNftsFiltered(unlistedNftsNoLimits);

      const startIndex = 0
      const offsetLength =  unlistedNftsNoLimitsOffset
      const arraySlice = unlistedNftsNoLimits.slice(startIndex,offsetLength)
      
      
      setUnlistedNfts(arraySlice)
  
      const bLoadMoreDisplay = unlistedNftsNoLimits.length > unlistedNftsNoLimitsOffset


      setLoadMoreUnlisted(bLoadMoreDisplay);
      
      //reset search text box
      SetTextboxValue("txtFilterUnlisted", "");

  } 

  function GetTextboxValue(elementID: string)
  {
      var element = document.getElementById(elementID) as HTMLInputElement;

      return element.value;
  }

  
  function SetTextboxValue(elementID: string, newValue: string)
  {
      var element = document.getElementById(elementID) as HTMLInputElement;

      element.value = newValue;
  }
  
  const getOffsetToLimit = async (
    getFunction: any,
    offset: number = 0,
    limit: number = 8,
    dataArray: Array<any>,
    setDataArray: any,
    flag?: any
  ) => { 
    let hasFetchedNewData = false;

    

    const dataResponse = await getFunction({
      userWalletAddress,
      limit,
      offset,
    });

    if (!dataResponse.data) {
      return {
        hasFetchedNewData: false,
      };
    }

    const previousDataArrayLenght = dataArray.length;

    if (flag === "gateway") {
      const { nfts, availableTokensData } = dataResponse.data;

      const newDataArray = [...dataArray, ...nfts];

      setDataArray(newDataArray);
      setAvailableTokens({ ...availableTokens, ...availableTokensData });

      hasFetchedNewData = previousDataArrayLenght !== newDataArray?.length;

      return {
        hasFetchedNewData,
      };
    }

    const newDataArray = [...dataArray, ...dataResponse.data.data];

    setDataArray(newDataArray);

    hasFetchedNewData = previousDataArrayLenght !== newDataArray?.length;

    return {
      hasFetchedNewData,
    };
  };

  const mapCollections = () => {
    return userCollections.map((userCollection: any) => {
      const {
        profileImageLink,
        coverImageLink,
        name,
        tokenId,
      } = userCollection;

      return (
        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:mx-4 mb-8">
          <Link to={`/collection/${tokenId}/`}>
            <div className={`c-card`}>
              <div className="c-card_img-container">
                <img
                  src={formatImgLink(profileImageLink)}
                  className="c-card_img"
                  alt=""
                />
              </div>

              <div className="c-card_info h-24 md:h-48 justify-content-center">
                <div className="c-card_details ">
                  <p className="text-2xl u-text-bold">{name || tokenId}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  const mapOnSaleTokens = () => {
    return onSaleNfts.map((tokenData: any) => {
      const { collection, token } = tokenData;
      const { collectionName } = collection;
      const {
        imageLink,
        tokenName,
        tokenId,
        nonce,
        state,
        priceNominal,
      } = token;
      const icon =
        (state as string).toLocaleLowerCase() === "list"
          ? faIcons.faList
          : faIcons.faGavel;

      return (
        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:mx-4 mb-8">
          <Link to={`/token/${tokenId}/${nonce}`}>
            <div className={`c-card`}>
              <div className="c-card_img-container">
                <img
                  src={formatImgLink(imageLink)}
                  className="c-card_img"
                  alt=""
                />
              </div>

              <div className="c-card_info justify-between">
                <div className="c-card_details">
                  <p className="text-gray-700 text-xs">
                    {collectionName && (
                      <Link
                        className="text-gray-500 hover:text-gray-200"
                        to={`/collection/${tokenId}`}
                      >
                        {collectionName || tokenId}
                      </Link>
                    )}
                  </p>

                  <p className="text-sm u-text-bold">{tokenName}</p>
                </div>

                <div className="c-card_price">
                  <p className="text-sm">{priceNominal}</p>

                  <p className="text-xs">
                    <FontAwesomeIcon
                      className="text-gray-500 mr-1"
                      icon={icon}
                    />
                    <span className="text-gray-500 u-text-bold">{state}</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  const mapOnStakeTokens = () => {
    return onStakeNfts.map((tokenData: any) => {
      const { collection, token } = tokenData;
      const { collectionName } = collection;
      const {
        imageLink,
        tokenName,
        tokenId,
        nonce,
        state,
        priceNominal
      } = token;
      const icon = faIcons.faCoins;

      return (
        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:mx-4 mb-8">
          <Link to={`/token/${tokenId}/${nonce}`}>
            <div className={`c-card`}>
              <div className="c-card_img-container">
                <img
                  src={formatImgLink(imageLink)}
                  className="c-card_img"
                  alt=""
                />
              </div>

              <div className="c-card_info justify-between">
                <div className="c-card_details">
                  <p className="text-gray-700 text-xs">
                    {collectionName && (
                      <Link
                        className="text-gray-500 hover:text-gray-200"
                        to={`/collection/${tokenId}`}
                      >
                        {collectionName || tokenId}
                      </Link>
                    )}
                  </p>

                  <p className="text-sm u-text-bold">{tokenName}</p>
                </div>

                <div className="c-card_price">
                  <p className="text-sm">{priceNominal}</p>

                  <p className="text-xs">
                    <FontAwesomeIcon
                      className="text-gray-500 mr-1"
                      icon={icon}
                    />
                    <span className="text-gray-500 u-text-bold">{state}</span>
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  const mapUnlistedTokens = (): any => {
    return unlistedNfts?.map((tokenData: any) => {
      const {
        url: imageLink,
        name: tokenName,
        ticker: tokenId,
        nonce,
        identifier,
      } = tokenData;
      const tokenIndentData = availableTokens[identifier];
      const isTokenAvailable = Boolean(tokenIndentData?.token?.available);
      const isCollectionAvailable = Boolean(
        tokenIndentData?.collection?.available
      );
      const tokenLink = `/token/${userWalletAddress}/${tokenId}/${nonce}`;

      return (


        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:mx-4 mb-8">
          <Link to={tokenLink}>
            <div className={`c-card c-card--colection`}>
              <div className="c-card_img-container">
              <img 
                src={(formatImgLink(imageLink) )}
                className="c-card_img"
                alt=""
              />  

 
              </div>

              <div className="c-card_info justify-between">
                <div className="c-card_token-details">
                  {isCollectionAvailable && (
                    <p className="text-gray-700 text-xs">
                      <Link
                        className="text-gray-500 hover:text-gray-200"
                        to={`/collection/${tokenId}`}
                      >
                         {tokenIndentData.collection.name}
                      </Link>
                    </p>
                  )}

                  <p className="text-sm u-text-bold">{tokenName}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  };

  const getMoreUnlistedTokens = async () => {

    const { hasFetchedNewData } = await GetMoreUnlistedProcess();

    //setLoadMoreUnlisted(unlistedNftsFiltered.length > unlistedNfts.length);
    
  };

  const getMoreOnStakeTokens = async () => {
    const { hasFetchedNewData } = await getOffsetToLimit(
      getOnStakeAccountTokensRequestTrigger,
      onStakeNfts.length,
      8,
      onStakeNfts,
      setOnStakeNfts
    );

    setLoadMoreOnStake(hasFetchedNewData);
  };
  
  const getMoreOnSaleTokens = async () => {
    const { hasFetchedNewData } = await getOffsetToLimit(
      getOnSaleAccountTokensRequestTrigger,
      onSaleNfts.length,
      8,
      onSaleNfts,
      setOnSaleNfts
    );

    setLoadMoreOnSale(hasFetchedNewData);
  };

  const getMoreUserCollections = async () => {
    const { hasFetchedNewData } = await getOffsetToLimit(
      getAccountCollectionsTrigger,
      userCollections.length,
      8,
      userCollections,
      setUserCollections
    );

    setLoadMoreCollections(hasFetchedNewData);
  };

  const dateOptions: any = { year: "numeric", month: "long" };
  const joinnedDate: Date = new Date(accountData?.data.createdAt * 1000);
  const joinedDateFormated: string = joinnedDate.toLocaleDateString(
    "en-US",
    dateOptions
  );



  useEffect(() => {

    getAccountRequestTrigger({ userWalletAddress: userWalletAddress });

    InitialLoadOfUnlistedData( getAccountGatewayRequestTrigger );

  }, []);


  return (
    <div className="p-profile-page">
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <div
            style={{
              backgroundImage: `url(${accountData?.data?.coverImageLink})`,
            }}
            className="bg-gray-800 w-full h-60 bg-cover bg-center"
          ></div>
        </div>

        <div className="col-span-12 flex justify-center mb-10 pb-16 relative">
          <div
            style={{
              backgroundImage: `url(${accountData?.data?.profileImageLink})`,
            }}
            className="-bottom-1/4 absolute bg-yellow-700 border border-black h-40 rounded-circle w-40 bg-cover"
          ></div>
        </div>

        <div className="col-span-12 text-center mb-6">
          {isOwnProfile && (
            <div className="c-icon-band mb-6">
              <div className="c-icon-band_item">
                <Link className="inline-block" to={`./account/settings`}>
                  <FontAwesomeIcon
                    className="text-white"
                    style={{ width: 25, height: 25, margin: "10px 15px" }}
                    icon={faIcons.faUserCog}
                  />
                </Link>
              </div>
            {/* TODO UNCOMMENT */}
              {/* <div className="c-icon-band_item">
                <Link className="inline-block" to={`/royalties`}>
                  <FontAwesomeIcon
                    className="text-white"
                    style={{ width: 25, height: 25, margin: "10px 15px" }}
                    icon={faIcons.faCrown}
                  />
                </Link>
              </div> */}
            </div>
          )}

          <h2 className="u-regular-heading u-text-bold">
            {accountData?.data.name || "Unnamed"}
          </h2>

          {loggedIn && (
            <p className="u-text-theme-gray-mid ">
              {shorterAddress(userWalletAddress, 7, 4)}
            </p>
          )}
          {accountData?.data.createdAt && (
            <p className="u-text-theme-gray-mid">Joined {joinedDateFormated}</p>
          )}

          <div className="mb-20">
            <div className="grid grid-cols-3">
              <div className="col-span-3 lg:col-start-2 lg:col-span-1">
                <Collapse>
                  <div className="p-6">
                    <div className="my-6">
                      <ul className="c-icon-band text-gray-500">
                        {accountData?.data?.website && (
                          <li className="c-icon-band_item">
                            <a
                              href={accountData?.data?.website}
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

                        {accountData?.data?.twitterLink && (
                          <li className="c-icon-band_item">
                            <a
                              href={`https://twitter.com/${accountData?.data?.twitterLink}`}
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

                        {accountData?.data?.instagramLink && (
                          <li className="c-icon-band_item">
                            <a
                              href={`https://instagram.com/${accountData?.data?.instagramLink}`}
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
                    <div className="text-gray-400">
                      {accountData?.data?.description}
                    </div>
                  </div>
                </Collapse>
              </div>
            </div>
          </div>
        </div>

        <div className="col-start-2 col-span-10 mb-20">
          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <Collapsible
                transitionTime={50}
                open={false}
                className="c-accordion"
                onOpening={() => {
                  if (isUninitializedAccountCollectionsRequest) {
                    getMoreUserCollections();
                  }
                }}
                trigger={
                  <div className="c-accordion_trigger">
                    <span className="c-accordion_trigger_icon">
                      <FontAwesomeIcon
                        width={"20px"}
                        className="c-navbar_icon-link"
                        icon={faIcons.faListAlt}
                      />
                    </span>
                    <span className="c-accordion_trigger_title">
                      Collections
                    </span>
                  </div>
                }
              >
                <div className="c-accordion_content bg-transparent">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12">
                      {isOwnProfile && (
                        <>
                          <div className="mb-10 md:text-center">
                            <span className=" mr-4 inline-block mb-6 md:mb-0">

                            
                                  <Link
                                    to={`/collection/create`}
                                    className="c-button c-button--primary"
                                  >
                                    {" "}
                                    Create collection{" "}
                                  </Link>   

 

                            </span>
                            <span className=" mr-4 inline-block">

                                <Link
                                    to={`/collection/register`}
                                    className="c-button c-button--primary inline-block"
                                  >
                                    {" "}
                                    Register collection{" "}
                                  </Link>


                            </span>
                          </div>
                          <hr className="text-white mb-10" />
                        </>
                      )}
                    </div>

                    {Boolean(userCollections.length) ? (
                      mapCollections()
                    ) : (
                      <div className="text-gray-500 text-center u-text-bold col-span-12 mr-8 mb-8">
                        no collections
                      </div>
                    )}
                  </div>
                </div>
              </Collapsible>
            </div>
          </div>

          <div className="grid grid-cols-12">
            <div className="col-span-12">
              <Collapsible
                transitionTime={50}
                open={false}
                className="c-accordion"
                onOpening={() => {
                  if (isUninitializedAccountTokensRequest) {
                    getMoreOnSaleTokens();
                  }
                }}
                trigger={
                  <div className="c-accordion_trigger">
                    <span className="c-accordion_trigger_icon">
                      <FontAwesomeIcon
                        width={"20px"}
                        className="c-navbar_icon-link"
                        icon={faIcons.faBarcode}
                      />
                    </span>
                    <span className="c-accordion_trigger_title">On Sale</span>
     
                    
                  </div>
                }
              >

                
                <div className="c-accordion_content bg-transparent">
                  <div className="grid grid-cols-12">

                  {
                    /*
                  <div className="col-span-12">
                      {isOwnProfile && (
                        <>
                          <div className="mb-10 md:text-center">
                            <span className=" mr-4 inline-block mb-6 md:mb-0">
                            <input autoComplete="off" type="text" id="txtFilterListed" placeholder="🔍 Filter on NFTs Name" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white" />
                            
                            </span>

                          </div>
                          <hr className="text-white mb-10" />
                        </>
                      )}
                    </div>
                    */
                  }

                    

                    {Boolean(onSaleNfts.length) ? (
                      mapOnSaleTokens()
                    ) : (
                      <div className="text-gray-500 text-center u-text-bold col-span-12 mr-8 mb-8">
                        no NFTs on sale
                      </div>
                    )}
                  </div>

                  {loadMoreOnSale && Boolean(onSaleNfts.length) && (
                    <div className="col-span-12 mr-8 mb-8">
                      <div className="text-center my-10">
                        <button
                          onClick={getMoreOnSaleTokens}
                          className="c-button c-button--secondary"
                        >
                          Load more
                        </button>
                      </div>
                      1
                    </div>
                  )}
                </div>
              </Collapsible>
              { /* HOT FIX releaseFeaureStaking */
              releaseFeaureStaking && (      
              <Collapsible
                transitionTime={50}
                open={false}
                className="c-accordion"
                onOpening={() => {
                  if (isUninitializedAccountTokensRequest) {
                    getMoreOnStakeTokens();
                  }
                }}
                trigger={
                  <div className="c-accordion_trigger">
                    <span className="c-accordion_trigger_icon">
                      <FontAwesomeIcon
                        width={"20px"}
                        className="c-navbar_icon-link"
                        icon={faIcons.faCoins}
                      />
                    </span>
                    <span className="c-accordion_trigger_title">Staked (Earning Rewards)</span>
                  </div>
                }
              >
                <div className="c-accordion_content bg-transparent">
                  <div className="grid grid-cols-12">
                    
                    {Boolean(onStakeNfts.length) ? (
                      mapOnStakeTokens()
                    ) : (
                      <div className="text-gray-500 text-center u-text-bold col-span-12 mr-8 mb-8">
                        no NFTs being staked
                      </div>
                    )}
                  </div>

                  {loadMoreOnStake && Boolean(onStakeNfts.length) && (
                    <div className="col-span-12 mr-8 mb-8">
                      <div className="text-center my-10">
                        <button
                          onClick={getMoreOnStakeTokens}
                          className="c-button c-button--secondary"
                        >
                          Load more
                        </button>
                      </div>
                      1
                    </div>
                  )}
                </div>
              </Collapsible>
              )}

              <Collapsible
                transitionTime={50}
                open={false}
                className="c-accordion"
                onOpening={() => {

                  //Get 
                  //if (isUninitializedAccountGatewayRequest) {
                  //  getMoreUnlistedTokens();
                  //}

                }}
                trigger={
                  <div className="c-accordion_trigger">
                    <span className="c-accordion_trigger_icon">
                      <FontAwesomeIcon
                        width={"20px"}
                        className="c-navbar_icon-link"
                        icon={faIcons.faWallet}
                      />
                    </span>
                    <span className="c-accordion_trigger_title">Wallet</span>
                  </div>
                }
              >


                
                <div className="c-accordion_content bg-transparent">
                  <div className="grid grid-cols-12">

                  <div className="col-span-12">
                      {isOwnProfile && (
                        <>
                          <div className="mb-10 md:text-center">
                            <span className=" mr-4 inline-block">
                            <input autoComplete="off" type="text" id="txtFilterUnlisted" placeholder="🔍 Wallet NFTs" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white" />
                            
                            </span>

                            <span className=" mr-4 inline-block">
                                  &nbsp;
                                <button
                                  onClick={handleFilterUnlisted}
                                  className="c-button c-button--primary">
                                  Filter
                              </button>

                            </span>

                            <span className=" mr-4 inline-block">
                                &nbsp;
                                <button
                                  onClick={handleFilterUnlistedReset}
                                  className="c-button c-button--primary">
                                  Reset
                              </button>

                            </span>

                          </div>
                          <hr className="text-white mb-10" />
                        </>
                      )}
                    </div>
                    


                    {Boolean(availableTokens) &&
                    Boolean(unlistedNfts?.length) ? (
                      mapUnlistedTokens()
                    ) : (
                      <div className="text-gray-500 text-center u-text-bold col-span-12 mr-8 mb-8">
                        No Wallet NFTs found

                        <p id="pLoadingUnlistedNFTs" hidden={true} className="my-10 text-2xl text-center">
                          Loading Wallet NFTs...
                        </p>

                        </div>
                      )}

                    {loadMoreUnlisted && Boolean(unlistedNfts.length) && (
                      <div className="col-span-12 mr-8 mb-8">
                        <div className="text-center my-10">
                          <button
                            onClick={getMoreUnlistedTokens}
                            className="c-button c-button--secondary"
                          >
                            Load more
                          </button>
                        </div>
                        
                      </div>
                    )}
                  </div>
                </div>
              </Collapsible>
            </div>
          </div>

          <br/>

        <Footer /> 
                  
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;