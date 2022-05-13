//Modules
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

//API Gateways
import { useGetActivitiesLogMutation } from "services/activity";
import { useGetAllCollectionMutation } from "services/collections";

//Assets
import egldIcon from "./../../../assets/img/egld-icon.png";
import tokenNoImage from "./../../../assets/img/token-no-img.png";
import dollarSign from "./../../../assets/img/labels/dollar-sign.svg";
import zapSign from "./../../../assets/img/labels/zap-sign.svg";
import tagSign from "./../../../assets/img/labels/tag-sign.svg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const ActivityPage = () => {
    let [collectionDropedDown, setCollectionDropedDown] = useState<any>(true);
    let [eventDropedDown, setEventDropedDown] = useState<any>(true);
    let [eventType, setEventType] = useState<string>("List");

    let [activities, setActivities] = useState<any[]>([]);
    let [allCollections, setAllCollections] = useState<any[]>([]);

    let [filteredCollections, setFilteredCollections] = useState<any>([]);
    let [searchInputValue, setSearchInputValue] = useState<any>([]);
    let [selectedCollections, setSelectedCollections] = useState<any>([]);
    let [filtersSideBar, setFiltersSideBar] = useState<any>(false);

    let [currentPage, setCurrentPage] = useState(1);
    let [nextPage, setNextPage] = useState(2);
    let [typeFilter, setTypeFilter] = useState<string>("type%7CList%7C%3D");
    let [collectionFilter, setCollectionFilter] = useState<string>("");

    let [hasMoreData, setHasMoreData] = useState<boolean>(true);

    const [
        getActivitiesLogRequestTrigger,
        {
            data: ActivitiesLog,
            isLoading: isLoadingGetActivitiesLogRequest,
            isUninitialized: isUninitializedGetActivitiesLogRequest,
        },
    ] = useGetActivitiesLogMutation();

    const [getAllCollectionTrigger] = useGetAllCollectionMutation();

    let dataProcessor = async (
        functionTrigger: any,
        triggerInputObject: any,
        stateGetter: any,
        stateSetter: any,
        responeHolder: any,
        requestCase: string
    ) => {
        switch (requestCase) {
            case "ActivitiesLog":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data.activities);
                break;

            case "LoadMoreLogs":
                responeHolder = await functionTrigger(triggerInputObject);
                if (responeHolder.data.data.activities.length < 30) {
                    setHasMoreData(false);
                }
                stateSetter([
                    ...stateGetter,
                    ...responeHolder.data.data.activities,
                ]);
                break;

            case "AllCollections":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data);
                break;

            default:
                break;
        }
    };

    let openSideMenu = () => {
        return (
            <>
                <div className="activity-SideMenu">
                    <div
                        onClick={() => setFiltersSideBar(false)}
                        className="activity-sidebar__dropbox--title"
                        style={{
                            margin: "0 0 32px 0",
                            justifyContent: "center",
                        }}
                    >
                        <FontAwesomeIcon
                            style={{ fontSize: "24px", color: "#fff" }}
                            icon={faIcons.faTimesCircle}
                        />
                    </div>

                    <div className="activity-sidebar__dropbox">
                        <div
                            className="activity-sidebar__dropbox--title"
                            onClick={() =>
                                setCollectionDropedDown(!collectionDropedDown)
                            }
                        >
                            <span>Collections</span>
                            <FontAwesomeIcon
                                style={{ fontSize: "16px", color: "#fff" }}
                                icon={
                                    collectionDropedDown
                                        ? faIcons.faChevronDown
                                        : faIcons.faChevronRight
                                }
                            />
                        </div>
                        {collectionDropedDown && (
                            <div className="activity-sidebar__dropbox--content">
                                <div className="activity-sidebar__dropbox--content_searchInput">
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

                                <div className="activity-sidebar__dropbox--content_selectedLabelBox">
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

                                <div className="activity-sidebar__dropbox--content_collectionsBox">
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
                                                                `collection_id%7C${item.id}%7C%3D`
                                                            );
                                                            setSearchInputValue(
                                                                ""
                                                            );
                                                        } else {
                                                            toast.error(
                                                                `Error! Duplicate item or more than 1 items can not be selected`,
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
                                                                  9
                                                              )}...`
                                                            : item.name}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="activity-sidebar__dropbox">
                        <div
                            className="activity-sidebar__dropbox--title"
                            onClick={() => setEventDropedDown(!eventDropedDown)}
                        >
                            <span>Event Type</span>
                            <FontAwesomeIcon
                                style={{ fontSize: "16px", color: "#fff" }}
                                icon={
                                    eventDropedDown
                                        ? faIcons.faChevronDown
                                        : faIcons.faChevronRight
                                }
                            />
                        </div>
                        {eventDropedDown && (
                            <div className="activity-sidebar__dropbox--content">
                                <div className="activity-sidebar__dropbox--content_selectionBox">
                                    <button
                                        style={
                                            eventType == "All"
                                                ? { background: "#2081e2" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("All");
                                            setTypeFilter("");
                                            setSearchInputValue("");
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faLayerGroup}
                                            style={{
                                                margin: "0 8px 0 0",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        />{" "}
                                        All
                                    </button>
                                    <button
                                        style={
                                            eventType == "List"
                                                ? { background: "#2081e2" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("List");
                                            setTypeFilter(`type%7CList%7C%3D`);
                                            setSearchInputValue("");
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faTag}
                                            style={{
                                                margin: "0 8px 0 0",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        />{" "}
                                        Listings
                                    </button>
                                    <button
                                        style={
                                            eventType == "Buy"
                                                ? { background: "#2081e2" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("Buy");
                                            setTypeFilter(`type%7CBuy%7C%3D`);
                                            setSearchInputValue("");
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faDollarSign}
                                            style={{
                                                margin: "0 8px 0 0",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        />{" "}
                                        Buys
                                    </button>
                                    <button
                                        style={
                                            eventType == "Auction"
                                                ? { background: "#2081e2" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("Auction");
                                            setTypeFilter(
                                                `type%7CAuction%7C%3D`
                                            );
                                            setSearchInputValue("");
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faHammer}
                                            style={{
                                                margin: "0 8px 0 0",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        />{" "}
                                        Auctions
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="activity-overlay"></div>
            </>
        );
    };

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

    let loadMoreLogs = (
        timestamp: any,
        currentPage: any,
        nextPage: any,
        filters: any
    ) => {
        dataProcessor(
            getActivitiesLogRequestTrigger,
            {
                timestamp,
                currentPage,
                nextPage,
                filters,
            },
            activities,
            setActivities,
            {},
            "LoadMoreLogs"
        );
        setCurrentPage(currentPage + 1);
        setNextPage(nextPage + 1);
    };

    useEffect(() => {
        setHasMoreData(true);
        dataProcessor(
            getActivitiesLogRequestTrigger,
            {
                timestamp: 0,
                currentPage: 1,
                nextPage: 1,
                filters:
                    typeFilter.length > 0
                        ? collectionFilter.length > 0
                            ? `${typeFilter}%3BAND%3B${collectionFilter}`
                            : `${typeFilter}`
                        : collectionFilter.length > 0
                        ? `${collectionFilter}`
                        : "",
            },
            activities,
            setActivities,
            {},
            "ActivitiesLog"
        );
        dataProcessor(
            getAllCollectionTrigger,
            {},
            allCollections,
            setAllCollections,
            {},
            "AllCollections"
        );
    }, [typeFilter, collectionFilter]);

    useEffect(() => {
        setFilteredCollections(allCollections);
    }, [allCollections]);

    return (
        <>
            {filtersSideBar ? openSideMenu() : null}
            <div className="activity-modal">
                <button onClick={() => setFiltersSideBar(!filtersSideBar)}>
                    {filtersSideBar ? "Done" : "Filters"}
                </button>
            </div>
            <div className="activity-container">
                <div className="activity-sidebar">
                    <div className="activity-sidebar__dropbox">
                        <div
                            className="activity-sidebar__dropbox--title"
                            onClick={() =>
                                setCollectionDropedDown(!collectionDropedDown)
                            }
                        >
                            <span>Collections</span>
                            <FontAwesomeIcon
                                style={{ fontSize: "16px", color: "#fff" }}
                                icon={
                                    collectionDropedDown
                                        ? faIcons.faChevronDown
                                        : faIcons.faChevronRight
                                }
                            />
                        </div>
                        {collectionDropedDown && (
                            <div className="activity-sidebar__dropbox--content">
                                <div className="activity-sidebar__dropbox--content_searchInput">
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

                                <div className="activity-sidebar__dropbox--content_selectedLabelBox">
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

                                <div className="activity-sidebar__dropbox--content_collectionsBox">
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
                                                                `collection_id%7C${item.id}%7C%3D`
                                                            );
                                                            setSearchInputValue(
                                                                ""
                                                            );
                                                        } else {
                                                            toast.error(
                                                                `Error! Duplicate item or more than 1 items can not be selected`,
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
                                                                  9
                                                              )}...`
                                                            : item.name}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="activity-sidebar__dropbox">
                        <div
                            className="activity-sidebar__dropbox--title"
                            onClick={() => setEventDropedDown(!eventDropedDown)}
                        >
                            <span>Event Type</span>
                            <FontAwesomeIcon
                                style={{ fontSize: "16px", color: "#fff" }}
                                icon={
                                    eventDropedDown
                                        ? faIcons.faChevronDown
                                        : faIcons.faChevronRight
                                }
                            />
                        </div>
                        {eventDropedDown && (
                            <div className="activity-sidebar__dropbox--content">
                                <div className="activity-sidebar__dropbox--content_selectionBox">
                                    <button
                                        style={
                                            eventType == "All"
                                                ? { background: "#2081e2" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("All");
                                            setTypeFilter("");
                                            setSearchInputValue("");
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faLayerGroup}
                                            style={{
                                                margin: "0 8px 0 0",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        />{" "}
                                        All
                                    </button>
                                    <button
                                        style={
                                            eventType == "List"
                                                ? { background: "#2081e2" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("List");
                                            setTypeFilter(`type%7CList%7C%3D`);
                                            setSearchInputValue("");
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faTag}
                                            style={{
                                                margin: "0 8px 0 0",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        />{" "}
                                        Listings
                                    </button>
                                    <button
                                        style={
                                            eventType == "Buy"
                                                ? { background: "#2081e2" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("Buy");
                                            setTypeFilter(`type%7CBuy%7C%3D`);
                                            setSearchInputValue("");
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faDollarSign}
                                            style={{
                                                margin: "0 8px 0 0",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        />{" "}
                                        Buys
                                    </button>
                                    <button
                                        style={
                                            eventType == "Auction"
                                                ? { background: "#2081e2" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("Auction");
                                            setTypeFilter(
                                                `type%7CAuction%7C%3D`
                                            );
                                            setSearchInputValue("");
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faIcons.faHammer}
                                            style={{
                                                margin: "0 8px 0 0",
                                                color: "#fff",
                                                fontSize: "12px",
                                            }}
                                        />{" "}
                                        Auctions
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <span className="activity-sidebar__title">Activity</span>
                </div>
                <div className="activity-main">
                    <table className="activity-main__table">
                        <div className="activity-main__table--head">
                            <span>
                                <div
                                    onClick={() =>
                                        setFiltersSideBar(!filtersSideBar)
                                    }
                                    style={
                                        filtersSideBar
                                            ? { background: "#2081e2" }
                                            : {}
                                    }
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            fontSize: "16px",
                                            color: "#fff",
                                        }}
                                        icon={faIcons.faFilter}
                                    />
                                </div>
                            </span>

                            <>
                                <span>Item</span>
                                <span>Price</span>
                                <span>Quantity</span>
                                <span>From</span>
                                <span>To</span>
                                <span>Time</span>
                            </>
                        </div>

                        <div className="activity-main__table--body">
                            <InfiniteScroll
                                className="activity-main__table--body__scrollArea"
                                dataLength={activities.length}
                                next={() =>
                                    loadMoreLogs(
                                        activities[activities.length - 1]
                                            ? activities[activities.length - 1]
                                                  .txTimestamp
                                            : null,
                                        currentPage,
                                        nextPage,
                                        typeFilter.length > 0
                                            ? collectionFilter.length > 0
                                                ? `${typeFilter}%3BAND%3B${collectionFilter}`
                                                : `${typeFilter}`
                                            : collectionFilter.length > 0
                                            ? `${collectionFilter}`
                                            : ""
                                    )
                                }
                                hasMore={hasMoreData}
                                loader={
                                    activities && activities.length > 0 ? (
                                        <p style={{ textAlign: "center" }}>
                                            <b>Loading...</b>
                                        </p>
                                    ) : null
                                }
                                height={560}
                                endMessage={
                                    activities && activities.length > 0 ? (
                                        <p style={{ textAlign: "center" }}>
                                            <b>Yay! You have seen it all</b>
                                        </p>
                                    ) : null
                                }
                            >
                                {activities.length > 0 ? (
                                    activities.map((item: any, index: any) =>
                                        selectedCollections.length > 0 ? (
                                            selectedCollections.includes(
                                                item.collectionName
                                            ) ? (
                                                <Link
                                                    key={index.toString()}
                                                    to={`/token/${
                                                        item.collectionTokenId
                                                    }/${
                                                        item.tokenName.split(
                                                            "#"
                                                        )[1]
                                                    }`}
                                                >
                                                    <div className="activity-main__table--body-log">
                                                        <div className="activity-main__table--body-log_label">
                                                            <img
                                                                src={
                                                                    item.txType ==
                                                                    "Buy"
                                                                        ? dollarSign
                                                                        : item.txType ==
                                                                          "Acution"
                                                                        ? zapSign
                                                                        : tagSign
                                                                }
                                                            />
                                                            <span>
                                                                {item.txType}
                                                            </span>
                                                        </div>
                                                        <div className="activity-main__table--body-log_item">
                                                            <img
                                                                src={
                                                                    item.tokenImageLink
                                                                }
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    let tar = e.target as any;
                                                                    tar.src = tokenNoImage;
                                                                }}
                                                            />
                                                            <div>
                                                                <span>
                                                                    {
                                                                        item.tokenName
                                                                    }
                                                                </span>
                                                                <span>
                                                                    {
                                                                        item.collectionName
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="activity-main__table--body-log_price">
                                                            <div>
                                                                <img
                                                                    src={
                                                                        egldIcon
                                                                    }
                                                                />
                                                                {
                                                                    item.txPriceNominal
                                                                }
                                                            </div>
                                                            EGLD
                                                        </div>
                                                        <span className="activity-main__table--body-log_quantity">
                                                            1
                                                        </span>
                                                        <span className="activity-main__table--body-log_from">
                                                            {item.fromAddress.slice(
                                                                0,
                                                                4
                                                            )}
                                                            ...
                                                            {item.fromAddress.slice(
                                                                item.fromAddress
                                                                    .length - 4,
                                                                item.fromAddress
                                                                    .length - 1
                                                            )}
                                                        </span>
                                                        <span className="activity-main__table--body-log_to">
                                                            {item.toAddress.slice(
                                                                0,
                                                                4
                                                            )}
                                                            ...
                                                            {item.toAddress.slice(
                                                                item.toAddress
                                                                    .length - 4,
                                                                item.toAddress
                                                                    .length - 1
                                                            )}
                                                        </span>
                                                        <span
                                                            className="activity-main__table--body-log_time"
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            {moment(
                                                                item.txTimestamp *
                                                                    1000
                                                            ).fromNow()}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ) : null
                                        ) : (
                                            <Link
                                                key={index.toString()}
                                                to={`/token/${
                                                    item.collectionTokenId
                                                }/${
                                                    item.tokenName.split("#")[1]
                                                }`}
                                            >
                                                <div className="activity-main__table--body-log">
                                                    <div className="activity-main__table--body-log_label">
                                                        <img
                                                            src={
                                                                item.txType ==
                                                                "Buy"
                                                                    ? dollarSign
                                                                    : item.txType ==
                                                                      "Acution"
                                                                    ? zapSign
                                                                    : tagSign
                                                            }
                                                        />
                                                        <span>
                                                            {item.txType}
                                                        </span>
                                                    </div>
                                                    <div className="activity-main__table--body-log_item">
                                                        <img
                                                            src={
                                                                item.tokenImageLink
                                                            }
                                                            onError={(e) => {
                                                                let tar = e.target as any;
                                                                tar.src = tokenNoImage;
                                                            }}
                                                        />
                                                        <div>
                                                            <span>
                                                                {item.tokenName}
                                                            </span>
                                                            <span>
                                                                {
                                                                    item.collectionName
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="activity-main__table--body-log_price">
                                                        <div>
                                                            <img
                                                                src={egldIcon}
                                                            />
                                                            {
                                                                item.txPriceNominal
                                                            }
                                                        </div>
                                                        EGLD
                                                    </div>
                                                    <span className="activity-main__table--body-log_quantity">
                                                        1
                                                    </span>
                                                    <span className="activity-main__table--body-log_from">
                                                        {item.fromAddress.slice(
                                                            0,
                                                            4
                                                        )}
                                                        ...
                                                        {item.fromAddress.slice(
                                                            item.fromAddress
                                                                .length - 4,
                                                            item.fromAddress
                                                                .length - 1
                                                        )}
                                                    </span>
                                                    <span className="activity-main__table--body-log_to">
                                                        {item.toAddress.slice(
                                                            0,
                                                            4
                                                        )}
                                                        ...
                                                        {item.toAddress.slice(
                                                            item.toAddress
                                                                .length - 4,
                                                            item.toAddress
                                                                .length - 1
                                                        )}
                                                    </span>
                                                    <span
                                                        className="activity-main__table--body-log_time"
                                                        style={{
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        {moment(
                                                            item.txTimestamp *
                                                                1000
                                                        ).fromNow()}
                                                    </span>
                                                </div>
                                            </Link>
                                        )
                                    )
                                ) : (
                                    <div style={{ width: "100%" }}>
                                        <p
                                            style={{
                                                margin: "160px auto 0 auto",
                                            }}
                                        >
                                            There isn't item
                                        </p>
                                    </div>
                                )}
                            </InfiniteScroll>
                        </div>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ActivityPage;
