import Select from "react-select";
import { toast } from "react-toastify";
import { useLocation, Link, useParams } from "react-router-dom";
import { UrlParameters } from "./interfaces";

import * as Dapp from "@elrondnetwork/dapp";
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import * as faBrands from "@fortawesome/free-brands-svg-icons";

import { useForm} from "react-hook-form";

import { prepareTransaction } from "utils/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse } from "components";
import Collapsible from "react-collapsible";
import { useEffect, useState } from "react";
import { useGetMintTokensTemplateMutation } from "services/tx-template";
import {
  useGetCollectionByIdMutation,
  useGetCollectionInfoMutation,
  useGetCollectionTokensMutation,
} from "services/collections";
import { shorterAddress } from "utils";

import { useGetWhitelistBuyCountLimitTemplateMutation,  } from "services/tokens";

export const CollectionPage: (props: any) => any = ({}) => {
  
  const { loggedIn, address: userWalletAddress } = Dapp.useContext();
  const { collectionId } = useParams<UrlParameters>();
  const [buyLimit,setBuyLimit] = useState<number>(0);
  const [buyCount,setBuyCount] = useState<number>(0);

  const { pathname } = useLocation();
  
  const sendTransaction = Dapp.useSendTransaction();

  const [
    getMintTokensTemplateTrigger, 
    {}
  ] = useGetMintTokensTemplateMutation();

  const [
    getCollectionTokensTrigger, 
    { 
      data: collectionTokensData 
    },
  ] = useGetCollectionTokensMutation();

  const [
    getCollectionByIdTrigger,
    {
      data: collectionData,
      isError: isErrorGetCollectionData,
      isSuccess: isSuccessGetCollectionData,
    },
  ] = useGetCollectionByIdMutation();

  const [
    getCollectionInfoTrigger,
    { data: getCollectionInfoData },
  ] = useGetCollectionInfoMutation();

  // this refresh OR create the sessionState in DB
  const getWhitelistCountLimitTemplateTransaction = async () => {

    const formattedData = {
      contractAddress: contractAddress,  //collection contract address
      userAddress: userWalletAddress,
    }
  
    const response: any = await getWhitelistBuyCountLimitTemplateTrigger({ payload: formattedData });

      if (response.error) {
        //handle any error here
        return;
    }

    const { data: txData } = response.data;

    var dataArray = txData.split(',');
    setBuyCount(parseInt(dataArray[0]))
    setBuyLimit(parseInt(dataArray[1]))
    // var userBuyCount = dataArray[0];
    // var userBuyLimit = dataArray[1];
};

  const [hasLoadMore, setHasLoadMore] = useState(true);
  const [shouldDisplayMobileFilters, setShouldDisplayMobileFilters] = useState(false);

  const [requestedNumberOfTokens, setRequestedNumberOfTokens] = useState<number>(1);
  
  const [getWhitelistBuyCountLimitTemplateTrigger] = useGetWhitelistBuyCountLimitTemplateMutation();

  const mobileFiltersStyles = shouldDisplayMobileFilters
    ? { zIndex: 100, width: "100%", height: "100%", backgroundColor: "#262b2f" }
    : {};

  const columnMobileFiltersStyles = shouldDisplayMobileFilters
    ? {
        zIndex: 10,
        width: "calc(100% - 16px)",
        borderBottom: "1px solid black",
      }
    : {};

  const options = [
    {
      value: {
        criteria: "created_at",
        mode: "desc",
      },
      label: "Oldest",
    },
    {
      value: {
        criteria: "created_at",
        mode: "asc",
      },
      label: "Recently listed",
    },
    {
      value: {
        criteria: "price_nominal",
        mode: "asc",
      },
      label: "Price: Low to High",
    },
    {
      value: {
        criteria: "price_nominal",
        mode: "desc",
      },
      label: "Price: High to Low",
    },
  ];

  const [sort, setSort] = useState<any>(options[0].value);

  const [tokens, setTokens] = useState<any>([]);

  const [filterQuery, setFilterQuery] = useState<any>({});

  const {
    trigger,
    register: registerFilters,
    handleSubmit: handleSubmitFilters,
    formState: { errors: errorsFilters },
  } = useForm({});

  const onSubmitFilters = (data: any) => {
    const filtersCategories: Array<string> = Object.keys(data.filter);

    const newFilterQuery: any = Object.assign({});

    filtersCategories.forEach((filterCategory: string) => {
      if (data.filter[filterCategory]) {
        newFilterQuery[filterCategory] = data.filter[filterCategory];
      }
    });

    setFilterQuery(newFilterQuery);

    triggerFilterAndSort({ newFilterQuery });
  };

  const triggerFilterAndSort = async ({
    mergeWithExisting = false,
    newFilterQuery,
    newSortQuery,
  }: {
    mergeWithExisting?: boolean;
    newFilterQuery?: any;
    newSortQuery?: any;
  }) => {
    const filters = newFilterQuery ? newFilterQuery : filterQuery;
    const offset = mergeWithExisting ? tokens.length : 0;
    const sortRules = newSortQuery ? newSortQuery : sort;

    const collectionTokensResponse: any = await getCollectionTokensTrigger({
      collectionId,
      offset: offset,
      limit: 8,
      sortRules,
      filters,
    });

    if (collectionTokensData?.data) {
      const tokensResponse = collectionTokensResponse?.data?.data;

      const newTokens = tokensResponse || [];

      if (mergeWithExisting) {
        setTokens([...tokens, ...newTokens]);
      } else {
        setTokens(newTokens);
      }

      setHasLoadMore(Boolean(tokensResponse?.length));
    }
  };

  const description = collectionData?.data?.collection?.description;
  const discordLink = collectionData?.data?.collection?.discordLink;
  const twitterLink = collectionData?.data?.collection?.twitterLink;
  const telegramLink = collectionData?.data?.collection?.telegramLink;
  const instagramLink = collectionData?.data?.collection?.instagramLink;
  const websiteLink = collectionData?.data?.collection?.website;

  const attributes = collectionData?.data?.statistics?.attributes;

  const floorPrice = collectionData?.data?.statistics?.floorPrice;
  const itemsTotal = collectionData?.data?.statistics?.itemsTotal;
  const ownersTotal = collectionData?.data?.statistics?.ownersTotal;
  const volumeTraded = collectionData?.data?.statistics?.volumeTraded;

  const creatorName = collectionData?.data?.creatorName;
  const collectionName = collectionData?.data?.collection?.name;
  const collectionTokenId = collectionData?.data?.collection?.tokenId;
  const creatorWalletAddress = collectionData?.data?.creatorWalletAddress;
  const contractAddress = collectionData?.data?.collection?.contractAddress;

  const isCollectionOwner = userWalletAddress === creatorWalletAddress;

  const mapFilters = () => {
    const mappedAttributes: any = {};

    attributes?.forEach((attribute: any) => {
      const { trait_type, value, total } = attribute;

      if (!mappedAttributes[trait_type]) {
        mappedAttributes[trait_type] = {};
      }

      if (mappedAttributes[trait_type][value] === undefined) {
        mappedAttributes[trait_type][value] = 0;
      }

      if (mappedAttributes[trait_type][value] === 0) {
        mappedAttributes[trait_type][value] = total;
      } else {
        mappedAttributes[trait_type][value] =
          mappedAttributes[trait_type][value] + total;
      }
    });

    const attributesKeys = Object.keys(mappedAttributes);

    const mappedFilters = attributesKeys.map((attributeKey) => {
      let totalKeyValues = 0;

      const traitsValuesKeys = Object.keys(mappedAttributes[attributeKey]);

      traitsValuesKeys.forEach((traitValue: any) => {
        totalKeyValues =
          totalKeyValues + mappedAttributes[attributeKey][traitValue];
      });

      return (
        <Collapsible
          open={false}
          disabled={true}
          transitionTime={50}
          className="c-accordion"
          trigger={
            <div className="c-accordion_trigger justify-between">
              <div>
                <span className="c-accordion_trigger_icon">
                  <FontAwesomeIcon width={"10px"} icon={faIcons.faList} />
                </span>
                <span className="c-accordion_trigger_title">
                  {attributeKey}
                </span>
              </div>
              <div className="text-sm text-gray-400">{totalKeyValues}</div>
            </div>
          }
        >
          <div className="c-accordion_content">
            {traitsValuesKeys.map((traitValue: string, index: number) => {
              return (
                <>
                  {Boolean(index === 0) && (
                    <div className="flex justify-between u-text-small my-3 border-b-2 border-bottom justify-content-center">
                      <label>
                        <input
                          defaultChecked
                          value={``}
                          {...registerFilters(`filter.${attributeKey}`, {
                            onChange: (e) => {
                              handleSubmitFilters(onSubmitFilters)();
                            },
                          })}
                          type="radio"
                          className="mr-2"
                        />
                        <span className="u-text-theme-gray-light">
                          No {attributeKey} filter selected
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="flex justify-between u-text-small my-3">
                    <label>
                      <input
                        value={`${traitValue}`}
                        {...registerFilters(`filter.${attributeKey}`, {
                          onChange: (e) => {
                            handleSubmitFilters(onSubmitFilters)();
                          },
                        })}
                        type="radio"
                        className="mr-2"
                      />
                      <span className="u-text-theme-gray-light">
                        {traitValue}
                      </span>
                    </label>

                    <span className="">
                      {mappedAttributes[attributeKey][traitValue]}
                    </span>
                  </div>
                </>
              );
            })}
          </div>
        </Collapsible>
      );
    });

    return (
      <form onSubmit={handleSubmitFilters(onSubmitFilters)}>
        {mappedFilters}
      </form>
    );
  };

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
      // color: state.isSelected ? 'red' : 'blue',
      backgroundColor: "#353840",
      color: "white",
      padding: 20,
      onOptionHover: {
        backgroundColor: "red",
      },
      width: "100%",
    }),
    control: (provided: any) => ({
      // none of react-select's styles are passed to <Control />
      // width: 200,
      ...provided,
      backgroundColor: "#353840",
      borderColor: "#353840",
      onOptionHover: {
        borderColor: "red",
      },
      width: "100%",
      color: "white",
    }),
    indicatorSeparator: (provided: any, state: any) => {
      //hide
      return {};
    },
    singleValue: (provided: any, state: any) => {
      // const opacity = state.isDisabled ? 0.5 : 1;
      // const transition = 'opacity 300ms';

      // return { ...provided, opacity, transition };

      // return provided;
      return {
        ...provided,
        color: "white",
        padding: 10,
        backgroundColor: "#353840",
      };
    },
    input: (provided: any, state: any) => {
      return {
        ...provided,
        color: "white",
      };
    },
    menuList: (provided: any, state: any) => {
      return {
        ...provided,
        padding: 0,
        margin: 0,
      };
    },
  };

  const handleMintTokens = async () => {

    if( userWalletAddress == null )
    {
      toast.error(`${`Please login (link in upper right) before minting.`}`, {
        autoClose: 5000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        position: "bottom-right",
      });

      return
    }


    if(requestedNumberOfTokens < 1 || requestedNumberOfTokens > 10 )
    {

      toast.error(`${`Currently, minting is limited between 1 and a MAX of 10.`}`, {
        autoClose: 5000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        position: "bottom-right",
      });
      return      
    }


    if (buyCount >= buyLimit && buyLimit != -1){

      toast.error(`${`You have reached your mint limit, Or you are not whitelisted`}`, {
        autoClose: 5000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        position: "bottom-right",
      });
      return
    }



    const getBuyNFTResponse: any = await getMintTokensTemplateTrigger({
      userWalletAddress,
      collectionId,
      numberOfTokens: requestedNumberOfTokens,
    });

    if (getBuyNFTResponse.error) {
      const {
        status,
        data: { error },
      } = getBuyNFTResponse.error;

      console.log("handleMintTokens 4 ");

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
      callbackRoute: pathname,
    });
  };

  const handleChangeSelectValue = (option: any) => {
    // setTokens([]);

    setSort(option.value);

    triggerFilterAndSort({ newSortQuery: option.value });
  };

  const getInitialTokens = async () => {
    const response: any = await getCollectionTokensTrigger({
      collectionId,
      offset: 0,
      limit: 8,
      sortRules: sort,
    });

    if (response?.error) {
      toast.error(`Error getting initial tokens`, {
        autoClose: 5000,
        draggable: true,
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        position: "bottom-right",
      });
      return;
    }

    setTokens(response.data.data);
  };

  const toggleMobileFilters = () => {
    // if (!shouldDisplayMobileFilters === true) {

    //     document.body.classList.add('overflow-hidden');

    // } else {

    //     document.body.classList.remove('overflow-hidden');

    // }

    setShouldDisplayMobileFilters(!shouldDisplayMobileFilters);
  };

  const [collectionDataLoaded, setCollectionDataLoaded] = useState(false);

  useEffect(() => {

    getCollectionInfoTrigger({ collectionId: collectionId });

    getCollectionByIdTrigger({ collectionId: collectionId }).then(r=>{
      setCollectionDataLoaded(true)
    }).catch(err=>{
      console.error(err)
    });
    getInitialTokens();

  }, []);

  useEffect(() => {

    if( collectionDataLoaded ) {
      console.log(collectionDataLoaded)
      console.log(contractAddress)

      if( userWalletAddress != null )
      {
        console.log("inside userWalletAddress")
        getWhitelistCountLimitTemplateTransaction();
      }
      
    }
  }, [collectionDataLoaded]);

  if (isErrorGetCollectionData) {
    return (
      <p className="my-10 text-2xl text-center">
        Collection ({collectionId}) not found
      </p>
    );
  }

  if (!isSuccessGetCollectionData && !collectionData) {
    return <p className="my-10 text-2xl text-center">Loading...</p>;
  }

  return (
    <div className="p-profile-page">
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <div
            style={{
              backgroundImage: `url(${collectionData?.data?.collection?.coverImageLink})`,
            }}
            className="bg-gray-800 w-full h-60 bg-cover bg-center"
          ></div>
        </div>

        <div className="col-span-12 flex justify-center mb-10 pb-16 relative">
          <div
            style={{
              backgroundImage: `url(${collectionData?.data?.collection?.profileImageLink})`,
            }}
            className="-bottom-1/4 absolute bg-yellow-700 border border-black h-40 rounded-circle w-40 bg-cover"
          ></div>
        </div>

        <div className="col-span-12 text-center mb-10">
          {isCollectionOwner && (
            <div className="c-icon-band mb-6">
              <div className="c-icon-band_item">
                <Link
                  className="inline-block"
                  to={`/collection/${collectionId}/edit`}
                >
                  <FontAwesomeIcon
                    className="text-white"
                    style={{ width: 25, height: 25, margin: "10px 15px" }}
                    icon={faIcons.faPen}
                  />
                </Link>
              </div>
            </div>
          )}

          <h2 className="flex justify-content-center mb-2 text-4xl md:text-5xl u-text-bold">
            {collectionName || collectionTokenId}{" "}
            {Boolean(collectionData?.data?.collection?.isVerified) && (
              <FontAwesomeIcon
                width={"20px"}
                className="text-lg u-text-theme-blue-place"
                icon={faIcons.faCheckCircle}
              />
            )}
          </h2>

          <p className="text-gray-500 text-xl2 mb-6">
            Created by{" "}
            <Link to={`/profile/${creatorWalletAddress}`}>
              {" "}
              {creatorName || shorterAddress(creatorWalletAddress || "", 4, 4)}
            </Link>
          </p>

          <ul className="c-icon-band c-icon-band--collection mb-10 flex-col md:flex-row">
            <li className="c-icon-band_item">
              <div className="text-2xl md:text-3xl u-text-bold">
                {itemsTotal}
              </div>

              <div className="">items</div>
            </li>

            <li className="c-icon-band_item">
              <div className="text-2xl md:text-3xl u-text-bold">
                {ownersTotal}
              </div>

              <div className="">owners</div>
            </li>

            <li className="c-icon-band_item">
              <div className="text-2xl md:text-3xl u-text-bold">
                {floorPrice || "---"}
              </div>
              <div className="">floor price</div>
            </li>

            <li className="c-icon-band_item">
              <div className="text-2xl md:text-3xl u-text-bold">
                {volumeTraded || "---"}
              </div>
              <div className="text-sm">volume traded</div>
            </li>
          </ul>

          {Boolean(collectionData?.data?.collection?.contractAddress) && (
            <>
              <div className="grid grid-cols-10 mb-4">
                <div className="col-span-12 md:col-start-5 md:col-span-2  p-10 md:p-0 ">
                  <p className="text-sm mb-4">Number of tokens to mint: </p>
                  <input
                    min={1} max={7}
                    onChange={(e: any) => {
                      setRequestedNumberOfTokens(e.target.value);
                    }}
                    value={requestedNumberOfTokens}
                    type="number"
                    className="text-center text-4xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full"
                  />
                  <p className="text-lg mt-2">
                    For {requestedNumberOfTokens} tokens you will pay{" "}
                    {(
                      requestedNumberOfTokens *
                      collectionData?.data?.collection?.mintPricePerTokenNominal
                    ).toFixed(3)}{" "}
                    EGLD{" "}
                  </p>
                </div>
              </div>

              <button
                onClick={handleMintTokens}
                className="c-button c-button--primary mb-5">
                Mint now
              </button>

              <ul className="c-icon-band c-icon-band--collection mb-10 flex-col md:flex-row">
                <li className="c-icon-band_item">
                  <div className="text-3xl u-text-bold">
                    {getCollectionInfoData?.data?.totalSold || 0}
                  </div>

                  <div className="">minted</div>
                </li>

                <li className="c-icon-band_item">
                  <div className="text-3xl u-text-bold">
                    {getCollectionInfoData?.data?.maxSupply}
                  </div>

                  <div className="">max supply</div>
                </li>
              </ul>
            </>
          )}

          <div className="grid grid-cols-3">
            <div className="col-span-3 lg:col-start-2 lg:col-span-1 px-4">
              <Collapse>
                <div>
                  <div className="mb-6">
                    <ul className="c-icon-band text-gray-500">
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
                  <div className="text-gray-400">{description}</div>
                </div>
              </Collapse>
            </div>
          </div>
        </div>

        {/* <div className="fixed bottom-2 z-50 flex w-full justify-center md:hidden">
                    <button onClick={toggleMobileFilters} style={{ display: "flex", minWidth: "230px" }} className="align-items-center c-button c-button--primary justify-center" >
                        <FontAwesomeIcon width={'20px'} className="mr-2" icon={faIcons.faFilter} />
                        Filters

                        <span className="align-items-center bg-white flex h-8 ml-2 justify-center rounded-full w-8">
                            <span className="u-text-theme-blue-anchor">
                                {Object.keys(filterQuery)?.length}
                            </span>
                        </span>

                    </button>
                </div> */}

        <div
          style={mobileFiltersStyles}
          className="col-span-12 md:col-span-3 fixed md:relative"
        >
          <div
            className={`overflow-auto h-full md:block ${shouldDisplayMobileFilters ||
              "hidden"}`}
          >
            {/* <div style={columnMobileFiltersStyles} className="c-accordion_trigger absolute md:relative  justify-between cursor-pointer">
                            <span>
                                <span className="c-accordion_trigger_icon">
                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faFilter} />
                                </span>
                                <span className="c-accordion_trigger_title">
                                    Filters
                                </span>
                            </span>

                            <button onClick={toggleMobileFilters} className="c-button c-button--secondary md:hidden" >
                                Done
                            </button>
                        </div> */}

            <div className="pt-24 md:pt-0">
              {Boolean(attributes?.length) && mapFilters()}
            </div>
          </div>

          {/* <div className={`hidden md:block`}>

                        <div className="c-accordion_trigger cursor-pointer">
                            <span className="c-accordion_trigger_icon">
                                <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faFilter} />
                            </span>
                            <span className="c-accordion_trigger_title">
                                Filters
                            </span>


                        </div>

                        {
                            Boolean(attributes?.length) && mapFilters()
                        }

                    </div> */}
        </div>

        <div className="col-span-12 md:col-span-9">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-6  xl:col-span-4 m-4 md:m-0">
              <Select
                onChange={handleChangeSelectValue}
                options={options}
                isSearchable={false}
                defaultValue={options[0]}
                styles={customStyles}
              />
            </div>

            <div className="col-span-12 mx-4">
              <p className="text-gray-300 text-sm mb-8">
                {tokens?.length} results
              </p>
            </div>

            <div className="col-span-12 mx-3">
              <div className="grid grid-cols-12">
                {!Boolean(tokens?.length) && (
                  <div className="col-span-12 my-3 mx-2">
                    {" "}
                    <p className="my-10 text-2xl text-center">
                      Loading...
                    </p>{" "}
                  </div>
                )}

                {tokens?.map((token: any) => {
                  return (
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 md:mx-4 mb-8 my-3 mx-2">
                      <Link to={`/token/${token.owner.address}/${collectionId}/${token.nonce}`}>
                        <div className={`c-card c-card--colection`}>
                          <div className="c-card_img-container">
                            <img
                              src={token.imageLink}
                              className="c-card_img"
                              alt=""
                            />
                          </div>

                          <div className="c-card_info">
                            <div className="c-card_token-details">
                              <p className="text-gray-700 text-xs">
                                <Link
                                  className="text-gray-500 hover:text-gray-200"
                                  to={`/collection/${collectionId}`}
                                >
                                  {collectionName || collectionId}
                                </Link>
                              </p>
                              <p className="text-sm u-text-bold">
                                {token.tokenName}
                              </p>
                            </div>

                            <div className="c-card_price">
                              <p className="text-sm">{token?.priceNominal}</p>
                              <p className="text-xs">
                                <span className="text-gray-500">Last</span>{" "}
                                {token?.lastBuyPriceNominal} EGLD
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>

              {hasLoadMore && (
                <div className="text-center my-10">
                  <button
                    onClick={() => {
                      triggerFilterAndSort({ mergeWithExisting: true });
                    }}
                    className="c-button c-button--secondary"
                  >
                    Load more
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
