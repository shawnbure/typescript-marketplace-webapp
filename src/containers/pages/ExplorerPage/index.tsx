//Modules
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingBar from 'react-top-loading-bar'

import { isMobile } from "utils";

//API Gateways
import { useGetAllCollectionMutation } from "services/collections";
import { useGetExplorationItemsMutation } from "services/explorer";

//Assets
import tokenNoImage from "./../../../assets/img/token-no-img.png";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export const ExplorerPage = (props:any) => {

    let { setLoadStage } = props

    let [explorationItems, setExplorationItems] = useState<any>([]);
    let [totalExplorationItems, setTotalExplorationItems] = useState<any>(0);
    let [priceRangeExplorationItems, setPriceRangeExplorationItems] = useState<
        any
    >({});

    let [currentPage, setCurrentPage] = useState<any>(1);
    let [nextPage, setNextPage] = useState<any>(2);
    let [hasMoreData, setHasMoreData] = useState<any>(true);

    let [typeFilter, setTypeFilter] = useState<any>("List");
    let [saleTypeSelected, setSaleTypeSelected] = useState<any>("List");
    let [sortTypeSelected, setSortTypeSelected] = useState<any>("desc");
    let [priceRangeSelector, setPriceRangeSelector] = useState<any>(0);
    let [priceLimitationType, setPriceLimitationType] = useState<any>("More");

    let [allCollections, setAllCollections] = useState<any[]>([]);
    let [filteredCollections, setFilteredCollections] = useState<any>([]);
    let [searchInputValue, setSearchInputValue] = useState<any>([]);
    let [selectedCollections, setSelectedCollections] = useState<any>([]);
    let [collectionFilter, setCollectionFilter] = useState<string>("");
    let [showVerifiedItems, setShowVerifiedItems] = useState<boolean>(true);

    //Modals
    let [showModal, setShowModal] = useState<boolean>(false);
    let [activeModal, setActiveModal] = useState<any>("saleType");

    //SideMenu
    let [showSideMenu, setShowSideMenu] = useState<any>(false);

    const [
        getExplorationItemsRequestTrigger,
        {
            data: ExplorationItems,
            isLoading: isLoadingGetExplorationItemsRequest,
            isUninitialized: isUninitializedGetExplorationItemsRequest,
        },
    ] = useGetExplorationItemsMutation();

    const [getAllCollectionTrigger] = useGetAllCollectionMutation();

    let searchCollection = (keyword: any) => {
        if (keyword.length > 0) {
            let filtered = allCollections.filter(
                (item) => item.name.toUpperCase().includes(keyword) == true
            );
            setFilteredCollections(filtered);
        } else {
            setFilteredCollections(allCollections);
        }
    };

    let openSideMenu = () => {
        return (
            <>
                <div className="explorer-SideMenu">
                    <div>
                        <span>Filters</span>
                        <FontAwesomeIcon
                            onClick={() => setShowSideMenu(false)}
                            style={{ color: "#fff", fontSize: "24px" }}
                            icon={faIcons.faTimes}
                        />
                    </div>
                    <div className="explorer-filterBox__filters">
                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("saleType");
                                    setShowModal(true);
                                    setShowSideMenu(false);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faShoppingBag}
                                />
                                Sale type
                            </button>
                            {saleTypeSelected != "List" ? <span></span> : null}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("collections");
                                    setShowModal(true);
                                    setShowSideMenu(false);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faWindowMaximize}
                                />{" "}
                                Collections
                            </button>
                            {selectedCollections.length > 0 ? (
                                <span></span>
                            ) : null}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("sort");
                                    setShowModal(true);
                                    setShowSideMenu(false);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faLayerGroup}
                                />{" "}
                                Sort
                            </button>
                            {sortTypeSelected != "desc" ? <span></span> : null}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("priceRange");
                                    setShowModal(true);
                                    setShowSideMenu(false);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faMoneyBill}
                                />{" "}
                                Price range
                            </button>
                            {priceRangeSelector > 0 ? <span></span> : null}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("status");
                                    setShowModal(true);
                                    setShowSideMenu(false);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faFilter}
                                />
                                Verified Status
                            </button>
                            {showVerifiedItems == false ? <span></span> : null}
                        </div>
                    </div>
                </div>
                <div className="explorer-overlay"></div>
            </>
        );
    };

    let dataProcessor = async (
        functionTrigger: any,
        triggerInputObject: any,
        stateGetter: any,
        stateSetter: any,
        responeHolder: any,
        requestCase: string
    ) => {
        switch (requestCase) {
            case "ExplorationItems":
                setLoadStage(10)
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter([]);
                if (responeHolder.data) {
                    setTotalExplorationItems(responeHolder.data.data.total);
                    setPriceRangeExplorationItems({
                        min: responeHolder.data.data.min_price,
                        max: responeHolder.data.data.max_price,
                    });
                    stateSetter(responeHolder.data.data.tokens);
                    setLoadStage(100)
                }
                if (responeHolder.data == null) {
                    setTotalExplorationItems(0);
                }
                break;

            case "LoadMoreItems":
                setLoadStage(10)
                responeHolder = await functionTrigger(triggerInputObject);
                if (explorationItems.length >= responeHolder.data.data.total) {
                    setHasMoreData(false);
                }
                if (explorationItems.length < responeHolder.data.data.total) {
                    stateSetter([
                        ...stateGetter,
                        ...responeHolder.data.data.tokens,
                    ]);
                    setLoadStage(100)
                }
                break;

            case "AllCollections":
                setLoadStage(10)
                responeHolder = await functionTrigger(triggerInputObject);
                if(responeHolder.data) {
                    stateSetter(responeHolder.data.data);
                    setLoadStage(100)
                }
                break;

            default:
                break;
        }
    };

    let openModal = (modal: any) => {
        switch (modal) {
            case "saleType":
                return (
                    <div className="explorer-modal">
                        <div className="explorer-modal__box">
                            <div className="explorer-modal__box--title">
                                <span>Sale Type</span>
                                <span>Select an item to filter result</span>
                            </div>
                            <div className="explorer-modal__box--content">
                                <div
                                    onClick={() => {
                                        setSaleTypeSelected("Auction");
                                        setTypeFilter(`Auction`);
                                    }}
                                    className="explorer-modal__box--content_item-saleType"
                                    style={
                                        saleTypeSelected == "Auction"
                                            ? { background: "#2081e2" }
                                            : { background: "#202224" }
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={faIcons.faHammer}
                                        style={{ color: "#fff" }}
                                    />
                                    <span>Auction</span>
                                </div>

                                <div
                                    onClick={() => {
                                        setSaleTypeSelected("List");
                                        setTypeFilter(`List`);
                                    }}
                                    className="explorer-modal__box--content_item-saleType"
                                    style={
                                        saleTypeSelected == "List"
                                            ? { background: "#2081e2" }
                                            : { background: "#202224" }
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={faIcons.faTag}
                                        style={{ color: "#8a939b" }}
                                    />
                                    <span>List</span>
                                </div>
                            </div>
                            <div className="explorer-modal__box--control_single">
                                <button onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
                break;

            case "sort":
                return (
                    <div className="explorer-modal">
                        <div className="explorer-modal__box">
                            <div className="explorer-modal__box--title">
                                <span>Sort</span>
                                <span>Select an option to filter result</span>
                            </div>
                            <div className="explorer-modal__box--content">
                                <div className="explorer-modal__box--content_item-sort">
                                    <div
                                        onClick={() =>
                                            setSortTypeSelected("asc")
                                        }
                                        style={
                                            sortTypeSelected == "asc"
                                                ? { background: "#2081e2" }
                                                : { background: "#303339" }
                                        }
                                    >
                                        <span>Older Tokens</span>
                                        <span>
                                            List NFTs from longest listed to
                                            most recent.
                                        </span>
                                    </div>
                                    <div
                                        onClick={() =>
                                            setSortTypeSelected("desc")
                                        }
                                        style={
                                            sortTypeSelected == "desc"
                                                ? { background: "#2081e2" }
                                                : { background: "#303339" }
                                        }
                                    >
                                        <span>Newest Tokens</span>
                                        <span>
                                            List NFTs from most recent listed to
                                            longest.
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="explorer-modal__box--control_single">
                                <button onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
                break;

            case "status":
                return (
                    <div className="explorer-modal">
                        <div className="explorer-modal__box">
                            <div className="explorer-modal__box--title">
                                <span>Verified Status</span>
                                <span>Select an option to filter result</span>
                            </div>
                            <div className="explorer-modal__box--content">
                                <div className="explorer-modal__box--content_item-sort">
                                    <div
                                        onClick={() =>
                                            setShowVerifiedItems(false)
                                        }
                                        style={
                                            !showVerifiedItems
                                                ? { background: "#2081e2" }
                                                : { background: "#303339" }
                                        }
                                    >
                                        <span>All</span>
                                        <span>
                                            List of all NFTs available on the
                                            platform.
                                        </span>
                                    </div>
                                    <div
                                        onClick={() =>
                                            setShowVerifiedItems(true)
                                        }
                                        style={
                                            showVerifiedItems
                                                ? { background: "#2081e2" }
                                                : { background: "#303339" }
                                        }
                                    >
                                        <span>Verified</span>
                                        <span>
                                            Only NFTs from verified projects will be shown
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="explorer-modal__box--control_single">
                                <button onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
                break;

            case "collections":
                return (
                    <div className="explorer-modal">
                        <div className="explorer-modal__box explorer-modal__box--collections">
                            <div className="explorer-modal__box--title">
                                <span>Collections</span>
                                <span>
                                    Select a collection to filter result
                                </span>
                            </div>
                            <div className="explorer-modal__box--content">
                                <div className="explorer-modal__box--content_item-collectionsSearch">
                                    <input
                                        type="text"
                                        placeholder="Collection"
                                        onChange={(e) => {
                                            searchCollection(
                                                e.target.value.toUpperCase()
                                            );
                                            setSearchInputValue(e.target.value);
                                        }}
                                        value={searchInputValue}
                                        style={{
                                            backgroundImage:
                                                "url(/img/search-field-icon.png)",
                                        }}
                                    />

                                    <span
                                        onClick={() => {
                                            setSearchInputValue("");
                                            setFilteredCollections(
                                                allCollections
                                            );
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faTimes}
                                        />
                                    </span>
                                </div>

                                <div className="explorer-modal__box--content_item-selectedLabelBox">
                                    {selectedCollections.map(
                                        (item: any, index: any) => (
                                            <div
                                                key={index.toString()}
                                                onClick={() => {
                                                    let filtered = selectedCollections.filter(
                                                        (i: any) => i != item
                                                    );
                                                    setSelectedCollections(
                                                        filtered
                                                    );
                                                    setCollectionFilter("");
                                                    setSearchInputValue("");
                                                }}
                                            >
                                                {item}{" "}
                                                <FontAwesomeIcon
                                                    style={{ color: "#fff" }}
                                                    icon={faIcons.faTimes}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>

                                <div
                                    className="explorer-modal__box--content_item-collectionsResult"
                                    style={
                                        selectedCollections.length
                                            ? { height: "120px" }
                                            : { height: "160px" }
                                    }
                                >
                                    {filteredCollections &&
                                        filteredCollections.length > 0 &&
                                        filteredCollections.map(
                                            (item: any, index: any) => (
                                                <div
                                                    key={index.toString()}
                                                    onClick={() => {
                                                        if (
                                                            !selectedCollections.includes(
                                                                item.name
                                                            ) &&
                                                            selectedCollections.length <
                                                                1
                                                        ) {
                                                            setSelectedCollections(
                                                                [
                                                                    ...selectedCollections,
                                                                    `${item.name}`,
                                                                ]
                                                            );
                                                            setCollectionFilter(
                                                                `${item.id}`
                                                            );
                                                            setSearchInputValue(
                                                                ""
                                                            );
                                                        } else {
                                                            toast.error(
                                                                `Error! Duplicate item or more than 1 item can not be selected`,
                                                                {
                                                                    autoClose: 5000,
                                                                    draggable: true,
                                                                    closeOnClick: true,
                                                                    pauseOnHover: true,
                                                                    hideProgressBar: false,
                                                                    position:
                                                                        "bottom-right",
                                                                }
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            item.profileImageLink
                                                        }
                                                        onError={(e) => {
                                                            let tar = e.target as any;
                                                            tar.src = tokenNoImage;
                                                        }}
                                                    />
                                                    <span>
                                                        {item.name.length > 10
                                                            ? `${item.name.substr(
                                                                  0,
                                                                  isMobile() ? 10 : 40
                                                              )}${isMobile() ? item.name.length > 10 ? '...' : '' : item.name.length > 40 ? '...' : ''}`
                                                            : item.name}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>
                            <div className="explorer-modal__box--control_single">
                                <button onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
                break;

            case "priceRange":
                return (
                    <div className="explorer-modal">
                        <div className="explorer-modal__box">
                            <div className="explorer-modal__box--title">
                                <span>Price Range</span>
                                <span>
                                    Select range of price to filter result
                                </span>
                            </div>
                            <div className="explorer-modal__box--content">
                                <div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        defaultValue={priceRangeSelector}
                                        step={0.01}
                                        onInput={(e) => {
                                            let et = e.target as any;
                                            setPriceRangeSelector(et.value);
                                        }}
                                    />
                                </div>

                                <div className="explorer-modal__box--content_item-priceRangeType">
                                    <span
                                        onClick={() =>
                                            setPriceLimitationType("More")
                                        }
                                        style={
                                            priceLimitationType == "More"
                                                ? { background: "#2081e2" }
                                                : { background: "#303339" }
                                        }
                                    >
                                        More than
                                    </span>
                                    <span
                                        onClick={() =>
                                            setPriceLimitationType("Less")
                                        }
                                        style={
                                            priceLimitationType == "Less"
                                                ? { background: "#2081e2" }
                                                : { background: "#303339" }
                                        }
                                    >
                                        Less than
                                    </span>
                                </div>

                                <div className="explorer-modal__box--content_item-priceRangeValue">
                                    <span>{priceRangeSelector}</span>
                                    <span>EGLD</span>
                                </div>
                            </div>
                            <div className="explorer-modal__box--control_single">
                                <button onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                );
                break;

            default:
                break;
        }
    };

    let contentRender = (
        height: any,
        tokenImage: any,
        tokenPrice: any,
        tokenName: any,
        collectionName: any,
        collectionTokenId: any,
        tokenNonce: any
    ) => {
        return (
            <Link to={`/token/${collectionTokenId}/${tokenNonce}`}>
                <div className="explorer-contentBox__holderBox--holder">
                    <div
                        className="explorer-contentBox__content"
                        style={{ height: `${height}px` }}
                    >
                        <div
                            className="explorer-contentBox__content--image"
                            style={{
                                background: `url(${tokenImage})`,
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                            }}
                        >
                            <div>
                                <span>
                                    {tokenPrice}
                                    <span> EGLD</span>
                                </span>
                            </div>
                        </div>
                        <div className="explorer-contentBox__content--details">
                            <div className="explorer-contentBox__content--details_collectionLogo">
                                {collectionName[0]}
                            </div>
                            <div>
                                <span>{tokenName}</span>
                                <span>{collectionName}</span>
                            </div>
                            <div>
                                <span>BUY</span>
                                <span>NOW</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    let loadMoreItems = (
        lastTimestamp: any,
        currentPage: any,
        nextPage: any,
        priceNominalFilter: any,
        priceSortFilter: any,
        typeFilter : any,
        collectionFilter : any,
        sortTypeFilter : any,
        statusFilter : any
    ) => {
        dataProcessor(
            getExplorationItemsRequestTrigger,
            {
                lastTimestamp,
                currentPage,
                nextPage,
                priceNominalFilter,
                priceSortFilter,
                typeFilter,
                collectionFilter,
                sortTypeFilter,
                statusFilter
            },
            explorationItems,
            setExplorationItems,
            {},
            "LoadMoreItems"
        );
        setCurrentPage(currentPage + 1);
        setNextPage(nextPage + 1);
    };

    useEffect(() => {
        setExplorationItems([]);
        setHasMoreData(true);
        setCurrentPage(1);
        setNextPage(2);

        dataProcessor(
            getExplorationItemsRequestTrigger,
            {
                lastTimestamp: "0",
                currentPage: "1",
                nextPage: "1",
                priceNominalFilter: priceRangeSelector,
                priceSortFilter: priceLimitationType,
                typeFilter : typeFilter,
                collectionFilter : collectionFilter,
                sortTypeFilter : sortTypeSelected,
                statusFilter : showVerifiedItems
            },
            explorationItems,
            setExplorationItems,
            {},
            "ExplorationItems"
        );

        dataProcessor(
            getAllCollectionTrigger,
            {},
            allCollections,
            setAllCollections,
            {},
            "AllCollections"
        );
    }, [
        typeFilter,
        priceRangeSelector,
        priceLimitationType,
        collectionFilter,
        sortTypeSelected,
        showVerifiedItems
    ]);

    useEffect(() => {
        setFilteredCollections(allCollections);
    }, [allCollections]);

    return (
        <React.Fragment>

            {showModal && openModal(activeModal)}
            {showSideMenu && openSideMenu()}
            <div className="explorer-container">
                <div className="explorer-filterBox">
                    <span className="explorer-filterBox__title">Explorer</span>
                    <div className="explorer-filterBox__filters">
                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("saleType");
                                    setShowModal(true);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faShoppingBag}
                                />
                                Sale type
                            </button>
                            {saleTypeSelected != "List" ? <span></span> : null}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("collections");
                                    setShowModal(true);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faWindowMaximize}
                                />{" "}
                                Collections
                            </button>
                            {selectedCollections.length > 0 ? (
                                <span></span>
                            ) : null}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("sort");
                                    setShowModal(true);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faLayerGroup}
                                />{" "}
                                Sort
                            </button>
                            {sortTypeSelected != "desc" ? <span></span> : null}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("priceRange");
                                    setShowModal(true);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faMoneyBill}
                                />{" "}
                                Price range
                            </button>
                            {priceRangeSelector > 0 ? <span></span> : null}
                        </div>

                        <div>
                            <button
                                onClick={() => {
                                    setActiveModal("status");
                                    setShowModal(true);
                                }}
                            >
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faFilter}
                                />{" "}
                                Verified Status
                            </button>
                            {showVerifiedItems == false ? <span></span> : null}
                        </div>
                    </div>

                    <div className="explorer-filterBox__info">
                        <div>
                            <span>{totalExplorationItems}</span>
                            <span>Items Found</span>
                            <span>for exploring</span>
                        </div>
                        <div
                            onClick={() => {
                                setSaleTypeSelected("List");
                                setTypeFilter('List')
                                setPriceRangeSelector(0);
                                setPriceLimitationType("More");
                                setSortTypeSelected("desc");
                                setCollectionFilter("");
                                setSelectedCollections([]);
                                setShowVerifiedItems(true)
                            }}
                        >
                            <FontAwesomeIcon icon={faIcons.faTrash} />
                        </div>
                    </div>
                </div>
                <div className="explorer-contentBox">
                    <div className="explorer-contentBox__topMenu">
                        <span>Explorer</span>
                        <FontAwesomeIcon
                            onClick={() => setShowSideMenu(true)}
                            icon={faIcons.faBars}
                            className="explorer-contentBox__topMenu--menu"
                        />

                        <div className="explorer-contentBox__topMenu--filters">
                            <div>
                                <button
                                    onClick={() => {
                                        setActiveModal("saleType");
                                        setShowModal(true);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            margin: "0 8px 0 0",
                                            opacity: "0.5",
                                        }}
                                        icon={faIcons.faShoppingBag}
                                    />{" "}
                                    Sale type
                                </button>
                                {saleTypeSelected != "List" ? (
                                    <span></span>
                                ) : null}
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        setActiveModal("collections");
                                        setShowModal(true);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            margin: "0 8px 0 0",
                                            opacity: "0.5",
                                        }}
                                        icon={faIcons.faWindowMaximize}
                                    />{" "}
                                    Collections
                                </button>
                                {selectedCollections.length > 0 ? (
                                    <span></span>
                                ) : null}
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        setActiveModal("sort");
                                        setShowModal(true);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            margin: "0 8px 0 0",
                                            opacity: "0.5",
                                        }}
                                        icon={faIcons.faLayerGroup}
                                    />{" "}
                                    Sort
                                </button>
                                {sortTypeSelected != "desc" ? (
                                    <span></span>
                                ) : null}
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        setActiveModal("priceRange");
                                        setShowModal(true);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            margin: "0 8px 0 0",
                                            opacity: "0.5",
                                        }}
                                        icon={faIcons.faMoneyBill}
                                    />{" "}
                                    Price range
                                </button>
                                {priceRangeSelector > 0 ? <span></span> : null}
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        setActiveModal("status");
                                        setShowModal(true);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            margin: "0 8px 0 0",
                                            opacity: "0.5",
                                        }}
                                        icon={faIcons.faFilter}
                                    />{" "}
                                    Verified Status
                                </button>
                                {showVerifiedItems == false ? <span></span> : null}
                            </div>
                        </div>
                    </div>

                    <div className="explorer-filterBox__topMenu">
                        <div className="explorer-filterBox__topMenu--info">
                            <span>{totalExplorationItems}</span>
                            <div>
                                <p>Items Found</p>
                                <p>for exploring</p>
                            </div>
                        </div>
                        <div
                        className="explorer-filterBox__topMenu--btn"
                            onClick={() => {
                                setSaleTypeSelected("List");
                                setTypeFilter('List')
                                setPriceRangeSelector(0);
                                setPriceLimitationType("More");
                                setSortTypeSelected("desc");
                                setCollectionFilter("");
                                setSelectedCollections([]);
                                setShowVerifiedItems(true)
                            }}
                        >
                            <FontAwesomeIcon icon={faIcons.faTrash} />
                        </div>
                    </div>

                    <InfiniteScroll
                        className="explorer-contentBox__scrollArea"
                        dataLength={explorationItems.length}
                        next={() =>
                            loadMoreItems(
                                explorationItems[explorationItems.length - 1] ? explorationItems[ explorationItems.length - 1 ].token.lastMarketTimestamp : null,
                                currentPage,
                                nextPage,
                                priceRangeSelector,
                                priceLimitationType,
                                typeFilter,
                                collectionFilter,
                                sortTypeSelected,
                                showVerifiedItems
                            )
                        }
                        hasMore={hasMoreData}
                        loader={<></>}
                        height={isMobile() ? 420 : 705}
                        endMessage={<></>}
                    >
                        <div className="explorer-contentBox__holderBox">
                            {explorationItems && explorationItems.length > 0 ? (
                                explorationItems.map(
                                    (item: any, index: any) => {
                                        return contentRender(
                                            320,
                                            item.token.imageLink,
                                            item.token.priceNominal,
                                            item.token.tokenName,
                                            item.collection.name,
                                            item.collection.tokenId,
                                            item.token.nonce
                                        );
                                    }
                                )
                            ) : (
                                <p
                                    style={{
                                        margin: "auto",
                                        padding: "20% 0",
                                        fontWeight: "bold",
                                        color: "#fff",
                                    }}
                                >
                                    There isn't items
                                </p>
                            )}
                        </div>
                    </InfiniteScroll>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ExplorerPage;
function priceNominalFilter(arg0: any, currentPage: any, nextPage: any, priceNominalFilter: any): any {
    throw new Error("Function not implemented.");
}

