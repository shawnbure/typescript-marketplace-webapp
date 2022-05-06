//Modules
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";

//API Gateways
import { useGetActivitiesLogMutation } from "services/activity";
import { useGetCollectionTrendingMutation } from "services/collections";

//Assets
import egldIcon from "./../../../assets/img/egld-icon.png";
import tokenNoImage from "./../../../assets/img/token-no-img.png";
import dollarSign from "./../../../assets/img/labels/dollar-sign.svg";
import zapSign from "./../../../assets/img/labels/zap-sign.svg";
import tagSign from "./../../../assets/img/labels/tag-sign.svg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isMobile } from "utils";

export const ActivityPage = () => {
    let [collectionDropedDown, setCollectionDropedDown] = useState<any>(true);
    let [eventDropedDown, setEventDropedDown] = useState<any>(true);
    let [eventType, setEventType] = useState<string>("All");

    let [activities, setActivities] = useState<any[]>([]);
    let [collectionsTrending, setCollectionsTrending] = useState<any[]>([]);

    let [logsFilteredByCollection, setLogsFilteredByCollection] = useState<any>(
        []
    );
    let [searchInputValue, setSearchInputValue] = useState<any>([]);
    let [filtersBar, setFiltersBar] = useState<any>(false);

    let [currentPage, setCurrentPage] = useState(1);
    let [nextPage, setNextPage] = useState(2);
    let [filters, setFilters] = useState<string>("");

    let [hasMoreData, setHasMoreData] = useState<boolean>(true);

    const [
        getActivitiesLogRequestTrigger,
        {
            data: ActivitiesLog,
            isLoading: isLoadingGetActivitiesLogRequest,
            isUninitialized: isUninitializedGetActivitiesLogRequest,
        },
    ] = useGetActivitiesLogMutation();

    const [
        getCollectionTrendingTrigger,
        { data: collectionTrending },
    ] = useGetCollectionTrendingMutation();

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

            case "CollectionTrending":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data);
                break;

            default:
                break;
        }
    };

    let searchCollection = (keyword: any) => {
        if (keyword.length > 0) {
            let filtered = activities.filter(
                (item) =>
                    item.collectionName.toUpperCase().includes(keyword) == true
            );
            setLogsFilteredByCollection(filtered);
        } else {
            setLogsFilteredByCollection(activities);
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
                filters: filters,
            },
            activities,
            setActivities,
            {},
            "ActivitiesLog"
        );
        dataProcessor(
            getCollectionTrendingTrigger,
            { limit: 3 },
            collectionsTrending,
            setCollectionsTrending,
            {},
            "CollectionTrending"
        );
    }, [filters]);

    useEffect(() => {
        setLogsFilteredByCollection(activities);
    }, [activities]);

    return (
        <>
            <div className="activity-modal">
                <button onClick={() => setFiltersBar(!filtersBar)}>
                    {filtersBar ? "Done" : "Filters"}
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
                                <div className="activity-sidebar__dropbox--content_collectionsBox">
                                    {collectionsTrending &&
                                        collectionsTrending.length > 0 &&
                                        collectionsTrending.map(
                                            (item, index) => (
                                                <div
                                                    key={index.toString()}
                                                    onClick={() => {
                                                        searchCollection(
                                                            item.name
                                                        );
                                                        setSearchInputValue(
                                                            item.name
                                                        );
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            item.profileImageLink
                                                        }
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
                                                ? { background: "#4f4f4f" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("All");
                                            setFilters("");
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
                                                ? { background: "#4f4f4f" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("List");
                                            setFilters("type|List|=");
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
                                                ? { background: "#4f4f4f" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("Buy");
                                            setFilters("type|Buy|=");
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
                                                ? { background: "#4f4f4f" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("Auction");
                                            setFilters("type|Auction|=");
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
                                    onClick={() => setFiltersBar(!filtersBar)}
                                    style={
                                        filtersBar
                                            ? { background: "#2081e2" }
                                            : {}
                                    }
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            fontSize: "16px",
                                            color: "#fff",
                                        }}
                                        icon={
                                            filtersBar
                                                ? faIcons.faWindowClose
                                                : faIcons.faFilter
                                        }
                                    />
                                </div>
                            </span>
                            {!filtersBar ? (
                                <>
                                    <span>Item</span>
                                    <span>Price</span>
                                    <span>Quantity</span>
                                    <span>From</span>
                                    <span>To</span>
                                    <span>Time</span>
                                </>
                            ) : (
                                <div className="activity-main__table--head__filterBox">
                                    <button
                                        style={
                                            eventType == "All"
                                                ? { background: "#4f4f4f" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("All");
                                            setFilters("");
                                            setSearchInputValue("");
                                        }}
                                    >
                                        All
                                    </button>
                                    <button
                                        style={
                                            eventType == "List"
                                                ? { background: "#4f4f4f" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("List");
                                            setFilters("type|List|=");
                                            setSearchInputValue("");
                                        }}
                                    >
                                        Listings
                                    </button>
                                    <button
                                        style={
                                            eventType == "Buy"
                                                ? { background: "#4f4f4f" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("Buy");
                                            setFilters("type|Buy|=");
                                            setSearchInputValue("");
                                        }}
                                    >
                                        Buys
                                    </button>
                                    <button
                                        style={
                                            eventType == "Auction"
                                                ? { background: "#4f4f4f" }
                                                : {}
                                        }
                                        onClick={() => {
                                            setEventType("Auction");
                                            setFilters("type|Auction|=");
                                            setSearchInputValue("");
                                        }}
                                    >
                                        Auctions
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="activity-main__table--body">
                            <InfiniteScroll
                                className="activity-main__table--body__scrollArea"
                                dataLength={logsFilteredByCollection.length}
                                next={() =>
                                    loadMoreLogs(
                                        logsFilteredByCollection[
                                            logsFilteredByCollection.length - 1
                                        ]
                                            ? logsFilteredByCollection[
                                                  logsFilteredByCollection.length -
                                                      1
                                              ].txTimestamp
                                            : null,
                                        currentPage,
                                        nextPage,
                                        filters
                                    )
                                }
                                hasMore={hasMoreData}
                                loader={
                                    logsFilteredByCollection &&
                                    logsFilteredByCollection.length > 0 ? (
                                        <p style={{ textAlign: "center" }}>
                                            <b>Loading...</b>
                                        </p>
                                    ) : null
                                }
                                height={560}
                                endMessage={
                                    logsFilteredByCollection &&
                                    logsFilteredByCollection.length > 0 ? (
                                        <p style={{ textAlign: "center" }}>
                                            <b>Yay! You have seen it all</b>
                                        </p>
                                    ) : null
                                }
                            >
                                {logsFilteredByCollection &&
                                logsFilteredByCollection.length > 0 ? (
                                    logsFilteredByCollection.map(
                                        (item: any, index: any) => (
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
