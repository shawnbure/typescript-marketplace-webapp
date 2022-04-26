//Modules
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";

//API Gateways
import { useGetActivitiesLogMutation } from "services/activity";
import { useGetCollectionTrendingMutation } from "services/collections";

//Assets
import egldIcon from "./../../../assets/img/egld-icon.png";

import dollarSign from "./../../../assets/img/labels/dollar-sign.svg";
import zapSign from "./../../../assets/img/labels/zap-sign.svg";
import tagSign from "./../../../assets/img/labels/tag-sign.svg";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
            console.log(filtered);
            setLogsFilteredByCollection(filtered);
        } else {
            setLogsFilteredByCollection(activities);
        }
    };

    useEffect(() => {
        dataProcessor(
            getActivitiesLogRequestTrigger,
            {},
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
    }, []);

    useEffect(() => {
        setLogsFilteredByCollection(activities);
    }, [activities]);

    return (
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
                                    collectionsTrending.map((item, index) => (
                                        <div key={index.toString()}
                                            onClick={() => {
                                                searchCollection(item.name);
                                                setSearchInputValue(item.name);
                                            }}
                                        >
                                            <img src={item.profileImageLink} />
                                            <span>
                                                {item.name.length > 10
                                                    ? `${item.name.substr(
                                                          0,
                                                          9
                                                      )}...`
                                                    : item.name}
                                            </span>
                                        </div>
                                    ))}
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
                                    onClick={() => setEventType("All")}
                                >
                                    All
                                </button>
                                <button
                                    style={
                                        eventType == "List"
                                            ? { background: "#4f4f4f" }
                                            : {}
                                    }
                                    onClick={() => setEventType("List")}
                                >
                                    Listings
                                </button>
                                <button
                                    style={
                                        eventType == "Buy"
                                            ? { background: "#4f4f4f" }
                                            : {}
                                    }
                                    onClick={() => setEventType("Buy")}
                                >
                                    Buys
                                </button>
                                <button
                                    style={
                                        eventType == "Auction"
                                            ? { background: "#4f4f4f" }
                                            : {}
                                    }
                                    onClick={() => setEventType("Auction")}
                                >
                                    Auctions
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <span className="activity-sidebar__title">Filters</span>
            </div>
            <div className="activity-main">
                <table className="activity-main__table">
                    <div className="activity-main__table--head">
                        <span>&nbsp;</span>
                        <span>Item</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>From</span>
                        <span>To</span>
                        <span>Time</span>
                    </div>

                    <div className="activity-main__table--body">
                        {logsFilteredByCollection &&
                        logsFilteredByCollection.length > 0 ? (
                            logsFilteredByCollection.map((item: any, index : any) =>
                                item.txType == eventType ||
                                eventType == "All" ? (
                                    <Link
                                        key={index.toString()}
                                        to={`/token/${item.collectionTokenId}/${
                                            item.tokenName.split("#")[1]
                                        }`}
                                    >
                                        <div className="activity-main__table--body-log">
                                            <div className="activity-main__table--body-log_label">
                                                <img
                                                    src={
                                                        item.txType == "Buy"
                                                            ? dollarSign
                                                            : item.txType ==
                                                              "Offer"
                                                            ? zapSign
                                                            : tagSign
                                                    }
                                                />
                                                <span>{item.txType}</span>
                                            </div>
                                            <div className="activity-main__table--body-log_item">
                                                <img
                                                    src={item.tokenImageLink}
                                                />
                                                <div>
                                                    <span>
                                                        {item.tokenName}
                                                    </span>
                                                    <span>
                                                        {item.collectionName}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="activity-main__table--body-log_price">
                                                <div>
                                                    <img src={egldIcon} />
                                                    {item.txPriceNominal}
                                                </div>
                                                EGLD
                                            </div>
                                            <span className="activity-main__table--body-log_quantity">
                                                1
                                            </span>
                                            <span className="activity-main__table--body-log_from">
                                                {item.fromAddress.slice(0, 4)}
                                                ...
                                                {item.fromAddress.slice(
                                                    item.fromAddress.length - 4,
                                                    item.fromAddress.length - 1
                                                )}
                                            </span>
                                            <span className="activity-main__table--body-log_to">
                                                {item.toAddress.slice(0, 4)}...
                                                {item.toAddress.slice(
                                                    item.toAddress.length - 4,
                                                    item.toAddress.length - 1
                                                )}
                                            </span>
                                            <span className="activity-main__table--body-log_time">
                                                {moment(
                                                    item.txTimestamp * 1000
                                                ).fromNow()}
                                            </span>
                                        </div>
                                    </Link>
                                ) : null
                            )
                        ) : (
                            <p style={{ margin: "160px auto 0 auto" }}>
                                There isn't item
                            </p>
                        )}
                    </div>
                </table>
            </div>
        </div>
    );
};

export default ActivityPage;
