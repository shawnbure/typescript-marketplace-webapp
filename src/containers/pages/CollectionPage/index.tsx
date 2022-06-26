import { toast } from "react-toastify";
import { useLocation, Link, useParams } from "react-router-dom";
import { UrlParameters } from "./interfaces";

// Modules
import ReactTooltip from "react-tooltip";
import Select from "react-select";

//Images
import egldIcon from "./../../../assets/img/egld-icon.png";

import * as Dapp from "@elrondnetwork/dapp";
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import * as faBrands from "@fortawesome/free-brands-svg-icons";

import { useForm } from "react-hook-form";

import { prepareTransaction } from "utils/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useGetMintTokensTemplateMutation } from "services/tx-template";
import {
    useGetCollectionByIdMutation,
    useGetCollectionInfoMutation,
    useGetCollectionTokensMutation,
} from "services/collections";

import { useGetAccountMutation } from "services/accounts";

import { shorterAddress } from "utils";
import { useGetWhitelistBuyCountLimitTemplateMutation } from "services/tokens";

import { MINT } from "constants/actions";

/* temporary hot fixes */
import { useGetActivitiesLogMutation } from "services/activity";
import moment from "moment";

export const CollectionPage: (props: any) => any = ({}) => {
    const { loggedIn, address: userWalletAddress } = Dapp.useContext();
    const { collectionId } = useParams<UrlParameters>();
    const [buyLimit, setBuyLimit] = useState<number>(0);
    const [buyCount, setBuyCount] = useState<number>(0);
    const queryString = window.location.search;
    const { pathname } = useLocation();

    // Defines
    let [scrollTopPosition, setScrollTopPosition] = useState(320);
    let [scrollWidePosition, setScrollWidePosition] = useState(45);
    let [overflowTracking, setOverflowTracking] = useState(false);
    let [tracking, setTracking] = useState(false);
    let [tokensState, setTokensState] = useState("OnSale");
    let [tokensShowType, setTokensShowType] = useState("Price");
    let [selectedTraits, setSelectedTraits] = useState({});
    let [collectionActivities, setCollectionActivities] = useState([]);

    // Modals
    let [overlay, setOverlay] = useState(false);
    let [filtersModal, setFiltersModal] = useState(false);
    let [mintModal, setMintModal] = useState(false);

    const sendTransaction = Dapp.useSendTransaction();

    const [
        getMintTokensTemplateTrigger,
        {},
    ] = useGetMintTokensTemplateMutation();

    const [
        getCollectionTokensTrigger,
        { data: collectionTokensData },
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

    const [getAccountRequestTrigger] = useGetAccountMutation();

    const [
        getActivitiesLogRequestTrigger,
        {
            data: ActivitiesLog,
            isLoading: isLoadingGetActivitiesLogRequest,
            isUninitialized: isUninitializedGetActivitiesLogRequest,
        },
    ] = useGetActivitiesLogMutation();

    // this refresh OR create the sessionState in DB
    const getWhitelistCountLimitTemplateTransaction = async () => {
        const formattedData = {
            contractAddress: contractAddress, //collection contract address
            userAddress: userWalletAddress,
        };

        const response: any = await getWhitelistBuyCountLimitTemplateTrigger({
            payload: formattedData,
        });

        if (response.error) {
            //handle any error here
            return;
        }

        const { data: txData } = response.data;

        var dataArray = txData.split(",");
        setBuyCount(parseInt(dataArray[0]));
        setBuyLimit(parseInt(dataArray[1]));
        // var userBuyCount = dataArray[0];
        // var userBuyLimit = dataArray[1];
    };

    const [hasLoadMore, setHasLoadMore] = useState(true);
    const [
        shouldDisplayMobileFilters,
        setShouldDisplayMobileFilters,
    ] = useState(false);

    const [requestedNumberOfTokens, setRequestedNumberOfTokens] = useState<
        number
    >(1);

    const [
        getWhitelistBuyCountLimitTemplateTrigger,
    ] = useGetWhitelistBuyCountLimitTemplateMutation();

    const options = [
        {
            value: {
                criteria: "created_at",
                mode: "desc",
            },
            label: "Time → Oldest",
        },
        {
            value: {
                criteria: "created_at",
                mode: "asc",
            },
            label: "Time → Recently listed",
        },
        {
            value: {
                criteria: "price_nominal",
                mode: "asc",
            },
            label: "Price → Low to High",
        },
        {
            value: {
                criteria: "price_nominal",
                mode: "desc",
            },
            label: "Price → High to Low",
        },
    ];

    const [sort, setSort] = useState<any>(options[2].value);
    const [onSaleOption, setOnSaleOption] = useState<any>(true);

    const [tokens, setTokens] = useState<any>([]);

    const [filterQuery, setFilterQuery] = useState<any>({});

    const onSubmitFilters = (data: any) => {
        let newFilterQuery: any = Object.assign({});
        newFilterQuery = data;

        setFilterQuery(newFilterQuery);
        triggerFilterAndSort({ newFilterQuery });
    };

    const triggerFilterAndSort = async ({
        mergeWithExisting = false,
        newFilterQuery,
        newSortQuery,
        newOnSaleOption,
        tokenTypeValue,
    }: {
        mergeWithExisting?: boolean;
        newFilterQuery?: any;
        newSortQuery?: any;
        newOnSaleOption?: any;
        tokenTypeValue?: number;
    }) => {
        const filters = newFilterQuery ? newFilterQuery : filterQuery;
        const offset = mergeWithExisting ? tokens.length : 0;
        const sortRules = newSortQuery ? newSortQuery : sort;
        let onSaleFlag = false;
        let onStakeFlag = false;

        var queryFilters = "";

        switch (Number(tokenTypeValue)) {
            case 0: //off market
                queryFilters = "on_sale|0|=;AND;on_stake|0|=";
                onSaleFlag = false;
                onStakeFlag = false;
                break;

            case 1: //on sale
                queryFilters = "on_sale|1|=;AND;on_stake|0|=";
                onSaleFlag = true;
                onStakeFlag = false;
                break;

            case 2: //on stake
                queryFilters = "on_sale|0|=;AND;on_stake|1|=";
                onSaleFlag = false;
                onStakeFlag = true;
                break;

            default:
                //off market
                queryFilters = "on_sale|0|=;AND;on_stake|0|=";
                onSaleFlag = false;
                onStakeFlag = false;
        }

        const collectionTokensResponse: any = await getCollectionTokensTrigger({
            collectionId,
            offset: offset,
            limit: 8,
            sortRules,
            filters,
            onSaleFlag,
            onStakeFlag,
            queryFilters,
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

    const isStakeable = collectionData?.data?.collection?.isStakeable;

    const mapFilters = () => {
        let collectionTraits: any = [];
        let traitTypes: any = {};

        attributes?.map((item: any, index: any) => {
            if (!collectionTraits.includes(item.trait_type)) {
                collectionTraits.push(item.trait_type);
                // traitTypes.item.trait_type = []
            }
        });

        collectionTraits?.map((trait: any) => {
            let activeTraitValues: any = [];
            attributes?.map((item: any) => {
                if (item.trait_type == trait) {
                    activeTraitValues.push({
                        value: item.value,
                        label: `${item.value} (${item.total})`,
                    });
                }
            });

            traitTypes[trait] = activeTraitValues;
        });

        return collectionTraits.map((item: any) => {
            let st = selectedTraits as any;
            return (
                <span>
                    <label>{item}</label>
                    <Select
                        value={{
                            label: st[item] != undefined ? st[item] : "...",
                            value: st[item] != undefined ? st[item] : "",
                        }}
                        onChange={(e: any) => {
                            setSelectedTraits({
                                ...selectedTraits,
                                [item]: e.value,
                            });
                        }}
                        styles={selectStyle}
                        options={traitTypes[item]}
                    />
                </span>
            );
        });
    };

    const handleMintTokens = async () => {
        if (userWalletAddress == null) {
            toast.error(
                `${`Please login (link in upper right) before minting.`}`,
                {
                    autoClose: 5000,
                    draggable: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    hideProgressBar: false,
                    position: "bottom-right",
                }
            );

            return;
        }

        if (requestedNumberOfTokens < 1 || requestedNumberOfTokens > 10) {
            toast.error(
                `${`Currently, minting is limited between 1 and a MAX of 10.`}`,
                {
                    autoClose: 5000,
                    draggable: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    hideProgressBar: false,
                    position: "bottom-right",
                }
            );
            return;
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

            toast.error(
                `${status} | We noticed a problem , please check the input values and internet connection`,
                {
                    autoClose: 5000,
                    draggable: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    hideProgressBar: false,
                    position: "bottom-right",
                }
            );

            return;
        }

        const { data: txData } = getBuyNFTResponse.data;

        const unconsumedTransaction = prepareTransaction(txData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: `/confirmation/${MINT}/${collectionId}/0?number_minted=${requestedNumberOfTokens}`,
        });
    };

    const handleChangeSelectValue = (option: any) => {
        // setTokens([]);

        setSort(option.value);

        triggerFilterAndSort({ newSortQuery: option.value });
    };

    const handleOnSaleRadioButtonChange = (option: any) => {
        const onSaleFlagChange = option == 1 || option == 2;
        setOnSaleOption(onSaleFlagChange);

        triggerFilterAndSort({
            newOnSaleOption: onSaleFlagChange,
            tokenTypeValue: option,
        });
    };

    const getInitialTokens = async () => {
        //const queryFilters = "on_sale" + "|" + onSaleOption + "|="
        const queryFilters = "on_sale|1|=;AND;on_stake|0|=";

        const response: any = await getCollectionTokensTrigger({
            collectionId,
            offset: 0,
            limit: 8,
            sortRules: sort,
            onSaleFlag: onSaleOption,
            queryFilters: queryFilters,
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

    const [showEdit, setShowEdit] = useState(false);

    const setValuesAccount = async () => {
        const accountData: any = await getAccountRequestTrigger({
            userWalletAddress: userWalletAddress,
        });

        if (accountData?.data) {
            if (accountData?.data?.data?.role == "RoleAdmin") {
                setShowEdit(true);
            }
        }
    };

    useEffect(() => {
        getCollectionInfoTrigger({ collectionId: collectionId });

        getCollectionByIdTrigger({ collectionId: collectionId })
            .then((r) => {
                setCollectionDataLoaded(true);
                setValuesAccount();
            })
            .catch((err) => {
                console.error(err);
            });
        getInitialTokens();
    }, []);

    useEffect(() => {
        if (collectionDataLoaded) {
            if (
                collectionData?.data?.creatorWalletAddress == userWalletAddress
            ) {
                setShowEdit(true);
            }

            if (userWalletAddress != null) {
                getWhitelistCountLimitTemplateTransaction();
            }
        }
    }, [collectionDataLoaded]);

    useEffect(() => {
        onSubmitFilters(selectedTraits);
    }, [selectedTraits]);

    useEffect(() => {
        const doThis = async () => {
            let responeHolder = (await getActivitiesLogRequestTrigger({
                timestamp: 0,
                currentPage: 1,
                nextPage: 1,
                collectionFilter: String(collectionData?.data?.collection?.id),
            })) as any;
            setCollectionActivities(responeHolder?.data?.data?.activities);
        };
        doThis();
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

    let startTracking = () => {
        if (!tracking) {
            setScrollTopPosition(192);
            setScrollWidePosition(83.3);

            setTimeout(() => {
                setOverflowTracking(true);
            }, 2100);
        } else {
            setOverflowTracking(false);

            setTimeout(() => {
                setScrollTopPosition(320);
                setScrollWidePosition(45);
            }, 300);
        }

        setTracking(!tracking);
    };

    //Traites
    const selectOptions = [
        { value: "chocolate", label: "Chocolate" },
        { value: "strawberry", label: "Strawberry" },
        { value: "vanilla", label: "Vanilla" },
    ];

    // Style Of Tratis Selectors
    const selectStyle = {
        control: (base: any, state: any) => ({
            ...base,
            background: "#303339",
            borderColor: "#202224",
            boxShadow: null,
            cursor: "pointer",
            color: "#fff",
            "&:hover": { background: "#373a40" },
        }),
        menu: (provided: any, state: any) => ({
            ...provided,
            background: "#303339",
        }),
        input: (provided: any, state: any) => ({
            ...provided,
            width: "180px",
            height: "32px",
        }),
        indicatorSeparator: (provided: any, state: any) => ({
            ...provided,
            height: "0px",
        }),
        singleValue: (provided: any, state: any) => ({
            ...provided,
            color: "#fff",
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            color: state.isSelected ? "#fff" : "#fff",
            background: state.isSelected ? "#303339" : "#202224",
            padding: "8px 16px",
            cursor: "pointer",
            "&:hover": { background: "#373a40" },
        }),
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
            backgroundColor: "#303339",
            borderColor: "#303339",
            onOptionHover: {
                borderColor: "red",
            },
            width: "100%",
            color: "white",
        }),
        indicatorSeparator: (provided: any, state: any) => ({
            ...provided,
            height: "0px",
            width: "0px",
        }),
        singleValue: (provided: any, state: any) => {
            // const opacity = state.isDisabled ? 0.5 : 1;
            // const transition = 'opacity 300ms';

            // return { ...provided, opacity, transition };

            // return provided;
            return {
                ...provided,
                color: "white",
                padding: 10,
                backgroundColor: "#303339",
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

    return (
        <div>
            <ReactTooltip
                className="collection-tooltip"
                place="right"
                type="dark"
                effect="float"
            />

            {overlay && (
                <div className="collection-overlay">
                    {filtersModal && (
                        <div className="collection-modal_traits">
                            <div className="collection-modal_traits--title">
                                <span>Filters</span>
                                <span
                                    onClick={() => {
                                        setOverlay(false);
                                        setFiltersModal(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faIcons.faTimes} />
                                </span>
                            </div>

                            <div className="collection-modal_traits--content">
                                {mapFilters()}
                            </div>
                        </div>
                    )}

                    {mintModal && (
                        <div className="collection-modal_mint">
                            <div className="collection-modal_mint--title">
                                <span>Mint</span>
                                <span
                                    onClick={() => {
                                        setOverlay(false);
                                        setMintModal(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faIcons.faTimes} />
                                </span>
                            </div>

                            <div className="collection-modal_mint--content">
                                {Boolean(
                                    collectionData?.data?.collection
                                        ?.contractAddress
                                ) &&
                                    Boolean(
                                        collectionData?.data?.collection
                                            ?.maxSupply > 0
                                    ) &&
                                    Boolean(
                                        collectionData?.data?.collection
                                            ?.mintStartDate == 0 ||
                                            collectionData?.data?.collection
                                                ?.mintStartDate <
                                                new Date().getTime()
                                    ) && (
                                        <>
                                            <span>Tokens to Mint</span>
                                            <span>
                                                (Max 10 per Transaction)
                                            </span>
                                            <input
                                                onChange={(e: any) => {
                                                    setRequestedNumberOfTokens(
                                                        e.target.value
                                                    );
                                                }}
                                                value={requestedNumberOfTokens}
                                                type="number"
                                                placeholder="Enter number of tokens"
                                            />
                                            <span>
                                                For {requestedNumberOfTokens}{" "}
                                                tokens you will pay{" "}
                                                {(
                                                    requestedNumberOfTokens *
                                                    collectionData?.data
                                                        ?.collection
                                                        ?.mintPricePerTokenNominal
                                                ).toFixed(3)}{" "}
                                                EGLD
                                            </span>
                                            <button onClick={handleMintTokens}>
                                                Mint Now
                                            </button>
                                            <div className="collection-modal_mint--content_info">
                                                <div>
                                                    <span>
                                                        {getCollectionInfoData
                                                            ?.data?.totalSold ||
                                                            0}
                                                    </span>
                                                    <span>Minted</span>
                                                </div>

                                                <div>
                                                    <span>
                                                        {
                                                            getCollectionInfoData
                                                                ?.data
                                                                ?.maxSupply
                                                        }
                                                    </span>
                                                    <span>Max Supply</span>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                {Boolean(
                                    collectionData?.data?.collection
                                        ?.mintStartDate != 0 &&
                                        collectionData?.data?.collection
                                            ?.mintStartDate >
                                            new Date().getTime()
                                ) && (
                                    <span>
                                        Minting for this Collection is Coming
                                        Soon.
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="collection-container">
                <div className="collection-details">
                    <img
                        data-tip={description}
                        className="collection-details_picture"
                        src={`${collectionData?.data?.collection?.profileImageLink}`}
                        alt="profile"
                    />

                    <div className="collection-details_title">
                        <span>{collectionName || collectionTokenId}</span>
                        <span>
                            Created by{" "}
                            <Link to={`/profile/${creatorWalletAddress}`}>
                                {creatorName ||
                                    shorterAddress(
                                        creatorWalletAddress || "",
                                        4,
                                        4
                                    )}{" "}
                            </Link>
                        </span>
                    </div>

                    <div className="collection-details_status">
                        <FontAwesomeIcon
                            icon={
                                Boolean(
                                    collectionData?.data?.collection?.isVerified
                                )
                                    ? faIcons.faCheck
                                    : faIcons.faTimes
                            }
                            style={{ fontSize: "13px" }}
                        />
                        <span>
                            {Boolean(
                                collectionData?.data?.collection?.isVerified
                            )
                                ? "Verified"
                                : "Unverified"}
                        </span>
                    </div>

                    <div className="collection-details_info">
                        <div>
                            {" "}
                            <span>Items</span> <span>{itemsTotal}</span>{" "}
                        </div>
                        <div>
                            {" "}
                            <span>Total Volume</span>{" "}
                            <span>
                                <img src={egldIcon} /> {volumeTraded || "--"}
                            </span>{" "}
                        </div>
                        <div>
                            {" "}
                            <span>Owners</span> <span>{ownersTotal}</span>{" "}
                        </div>
                        <div>
                            {" "}
                            <span>Floor Price</span>{" "}
                            <span>
                                <img src={egldIcon} /> {floorPrice || "--"}
                            </span>{" "}
                        </div>
                    </div>

                    <div className="collection-details_controllers">
                        <button
                            className={
                                tokensState == "OnSale"
                                    ? "collection-details_controllers--active"
                                    : ""
                            }
                            onClick={() => {
                                handleOnSaleRadioButtonChange(1);
                                setTokensState("OnSale");
                            }}
                        >
                            On Sale
                        </button>
                        <button
                            className={
                                tokensState == "Wallet"
                                    ? "collection-details_controllers--active"
                                    : ""
                            }
                            onClick={() => {
                                handleOnSaleRadioButtonChange(0);
                                setTokensState("Wallet");
                            }}
                        >
                            Wallet
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setOverlay(true);
                            setMintModal(true);
                        }}
                        className="collection-details_mint"
                    >
                        Mint Token
                    </button>

                    <div className="collection-details_socials">
                        {instagramLink && (
                            <a
                                href={`https://instagram.com/${instagramLink}`}
                                target="_blank"
                                className="c-icon-band_link"
                            >
                                <span>
                                    <FontAwesomeIcon
                                        icon={faBrands.faInstagram}
                                    />
                                </span>
                            </a>
                        )}
                        {twitterLink && (
                            <a
                                href={`https://twitter.com/${twitterLink}`}
                                target="_blank"
                                className="c-icon-band_link"
                            >
                                <span>
                                    <FontAwesomeIcon
                                        icon={faBrands.faTwitter}
                                    />
                                </span>
                            </a>
                        )}
                        {discordLink && (
                            <a
                                href={`https://discord.gg/${discordLink}`}
                                target="_blank"
                                className="c-icon-band_link"
                            >
                                <span>
                                    <FontAwesomeIcon
                                        icon={faBrands.faDiscord}
                                    />
                                </span>
                            </a>
                        )}
                        {websiteLink && (
                            <a
                                href={websiteLink}
                                target="_blank"
                                className="c-icon-band_link"
                            >
                                <span>
                                    <FontAwesomeIcon icon={faBrands.faChrome} />
                                </span>
                            </a>
                        )}
                        {telegramLink && (
                            <a
                                href={`https://t.me/${telegramLink}`}
                                target="_blank"
                                className="c-icon-band_link"
                            >
                                <span>
                                    <FontAwesomeIcon
                                        icon={faBrands.faTelegram}
                                    />
                                </span>
                            </a>
                        )}
                    </div>
                </div>
                <div className="collection-main">
                    <div
                        className="collection-main_banner"
                        style={{
                            backgroundImage: `url(${collectionData?.data?.collection?.coverImageLink})`,
                        }}
                    />

                    <div
                        className="collection-main_content"
                        style={{
                            top: `${scrollTopPosition}px`,
                            width: `${scrollWidePosition}%`,
                        }}
                    >
                        <div
                            className="collection-main_tokens"
                            style={{
                                padding: "40px 40px 0 40px",
                                overflow: `${
                                    overflowTracking ? "auto" : "hidden"
                                }`,
                                height: `${
                                    scrollWidePosition == 83.3
                                        ? "720px"
                                        : "auto"
                                }`,
                            }}
                        >
                            {tokens?.map((token: any, index: any) => (
                                <Link
                                    to={`/token/${collectionId}/${token.nonce}`}
                                >
                                    <div
                                        className="collection-main_token"
                                        style={{
                                            backgroundImage: `url(${token.imageLink})`,
                                        }}
                                    >
                                        <div>
                                            <span>{token.tokenName}</span>
                                            {tokensShowType == "Price" ? (
                                                <span>
                                                    <img src={egldIcon} />
                                                    {token?.priceNominal}{" "}
                                                    <span>EGLD</span>
                                                </span>
                                            ) : (
                                                <span>
                                                    Rank{" "}
                                                    <p>{token?.rank || "-"}</p>
                                                </span>
                                            )}
                                            <button>Buy</button>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {hasLoadMore && tokens?.length > 0 && (
                                <div
                                    className="collection-main_tokens--loadMore"
                                    onClick={() => {
                                        triggerFilterAndSort({
                                            mergeWithExisting: true,
                                        });
                                    }}
                                >
                                    <span>Load More</span>
                                </div>
                            )}

                            <div
                                className="collection-main_overlay"
                                style={{
                                    margin: "0 0 0 -40px",
                                    bottom: `0px`,
                                    width: `${scrollWidePosition}%`,
                                }}
                            >
                                <span
                                    onClick={() =>
                                        tokens?.length > 0
                                            ? startTracking()
                                            : null
                                    }
                                >
                                    {tracking
                                        ? "End Tracking"
                                        : tokens?.length <= 0
                                        ? "No tokens were found!"
                                        : "Start Tracking"}
                                </span>
                                <button
                                    onClick={() => {
                                        setOverlay(true);
                                        setFiltersModal(true);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faIcons.faFilter} />
                                </button>
                                {showEdit && (
                                    <Link
                                        to={`/collection/${collectionId}/edit`}
                                    >
                                        <FontAwesomeIcon icon={faIcons.faPen} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="collection-filters">
                    <div className="collection-filters_result">
                        <span>{tokens?.length || "0"}</span>
                        <span>Items Found</span>
                    </div>

                    <div className="collection-filters_sort">
                        <div className="collection-filters_sort--controllers">
                            <button
                                onClick={() => setTokensShowType("Price")}
                                className={
                                    tokensShowType == "Price"
                                        ? "collection-filters_sort--controllers--active"
                                        : ""
                                }
                            >
                                Price
                            </button>
                            <button
                                onClick={() => setTokensShowType("Rank")}
                                className={
                                    tokensShowType == "Rank"
                                        ? "collection-filters_sort--controllers--active"
                                        : ""
                                }
                            >
                                Rank
                            </button>
                        </div>

                        <div
                            style={{ width: "100%" }}
                            className="col-span-12 md:col-span-6  xl:col-span-4 m-4 md:m-0"
                        >
                            <Select
                                onChange={handleChangeSelectValue}
                                options={options}
                                isSearchable={false}
                                defaultValue={options[2]}
                                styles={customStyles}
                            />
                        </div>
                    </div>

                    <div className="collection-filters_activities">
                        {collectionActivities?.map((item: any, index: any) => {
                            if (index < 4) {
                                return (
                                    <div className="collection-filters_activities--item">
                                        <span>{item?.transaction?.type}</span>

                                        <img src={item?.token?.imageLink} />

                                        <div>
                                            <span>
                                                {item?.token?.tokenName}
                                            </span>
                                            <span>
                                                {moment(
                                                    item.transaction.timestamp *
                                                        1000
                                                ).fromNow()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>

                    <a
                        href={`https://explorer.elrond.com/collections/${collectionId}`}
                        target="_blank"
                        className="collection-filters_explorer"
                    >
                        <span>View On Explorer</span>
                        <FontAwesomeIcon icon={faIcons.faArrowUp} />
                    </a>

                    <a
                        onClick={() => {
                            setOverlay(true);
                            setFiltersModal(true);
                        }}
                        className="collection-filters_modalButton"
                    >
                        <span>Filters</span>
                        <FontAwesomeIcon icon={faIcons.faFilter} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CollectionPage;
