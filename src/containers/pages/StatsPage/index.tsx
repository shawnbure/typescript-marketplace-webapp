import { useEffect, useState } from "react";
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chart from "react-apexcharts";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";

//API Gateways
import {
    useGetDailyTradesCountMutation,
    useGetLastWeekVolumeMutation,
    useGetTokensCountMutation,
    useGetTotalVolumeMutation,
    useGetTradesCountMutation,
    useGetTransactionsListMutation,
} from "services/stats";
import { useGetCollectionNoteworthyMutation } from "services/collections";

export const StatsPage = () => {
    const [totalTokensCount, setTotalTokensCount] = useState<any>(0);
    const [transactionsList, setTransactionsList] = useState<any>([]);
    const [tradesCount, setTradesCount] = useState<any>(0);
    const [todayTradesCount, setTodayTradesCount] = useState<any>(0);
    const [yesterdayTradesCount, setYesterdayTradesCount] = useState<any>(0);
    const [totalVolume, setTotalVolume] = useState<any>(0);
    const [lastWeekVolume, setLastWeekVolume] = useState<any>([]);
    const [collectionNorthway, setCollectionNorthway] = useState<any>([]);

    let series = [
        {
            name: "series-1",
            data:
                lastWeekVolume.length > 0
                    ? [
                          lastWeekVolume[5].sum,
                          lastWeekVolume[4].sum,
                          lastWeekVolume[3].sum,
                          lastWeekVolume[2].sum,
                          lastWeekVolume[1].sum,
                          lastWeekVolume[0].sum,
                      ]
                    : [0, 0, 0, 0, 0],
        },
    ];

    let [volumeDataHover, setVolumeDataHover] = useState(
        series[0].data[5] || 0
    );

    const [
        getTokensCountRequestTrigger,
        {
            data: TokensCount,
            isLoading: isLoadingGetTokensCountRequest,
            isUninitialized: isUninitializedGetTokensCountRequest,
        },
    ] = useGetTokensCountMutation();

    const [
        getTransactionsListRequestTrigger,
        {
            data: TransactionsList,
            isLoading: isLoadingGetTransactionsListRequest,
            isUninitialized: isUninitializedGetTransactionsListRequest,
        },
    ] = useGetTransactionsListMutation();

    const [
        getTradesCountRequestTrigger,
        {
            data: TradesCount,
            isLoading: isLoadingGetTradesCountRequest,
            isUninitialized: isUninitializedGetTradesCountRequest,
        },
    ] = useGetTradesCountMutation();

    const [
        getDailyTradesCountRequestTrigger,
        {
            data: DailyTradesCount,
            isLoading: isLoadingGetDailyTradesCountRequest,
            isUninitialized: isUninitializedGetDailyTradesCountRequest,
        },
    ] = useGetDailyTradesCountMutation();

    const [
        getTotalVolumeRequestTrigger,
        {
            data: TotalVolume,
            isLoading: isLoadingGetTotalVolumeRequest,
            isUninitialized: isUninitializedGetTotalVolumeRequest,
        },
    ] = useGetTotalVolumeMutation();

    const [
        getLastWeekVolumeRequestTrigger,
        {
            data: LastWeekVolume,
            isLoading: isLoadingGetLastWeekVolumeRequest,
            isUninitialized: isUninitializedGetLastWeekVolumeRequest,
        },
    ] = useGetLastWeekVolumeMutation();

    const [
        getCollectionNoteworthyRequestTrigger,
        {
            data: CollectionNoteworthy,
            isLoading: isLoadingGetCollectionNoteworthyRequest,
            isUninitialized: isUninitializedGetCollectionNoteworthyRequest,
        },
    ] = useGetCollectionNoteworthyMutation();

    let dataProcessor = async (
        functionTrigger: any,
        triggerInputObject: any,
        stateGetter: any,
        stateSetter: any,
        responeHolder: any,
        requestCase: string
    ) => {
        switch (requestCase) {
            case "TokensCount":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data.sum);
                break;

            case "TransactionsList":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data.transactions);
                break;

            case "TradesCount":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data.Total);
                break;

            case "TotalVolume":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data.sum);
                break;

            case "LastWeekVolume":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data);
                break;

            case "DailyTradesCount":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data.Total);
                break;

            case "CollectionNoteworthy":
                responeHolder = await functionTrigger(triggerInputObject);
                stateSetter(responeHolder.data.data);
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        dataProcessor(
            getTokensCountRequestTrigger,
            {},
            totalTokensCount,
            setTotalTokensCount,
            {},
            "TokensCount"
        );
        dataProcessor(
            getTransactionsListRequestTrigger,
            {},
            transactionsList,
            setTransactionsList,
            {},
            "TransactionsList"
        );
        dataProcessor(
            getTradesCountRequestTrigger,
            {},
            tradesCount,
            setTradesCount,
            {},
            "TradesCount"
        );
        dataProcessor(
            getTotalVolumeRequestTrigger,
            {},
            totalVolume,
            setTotalVolume,
            {},
            "TotalVolume"
        );
        dataProcessor(
            getLastWeekVolumeRequestTrigger,
            {},
            lastWeekVolume,
            setLastWeekVolume,
            {},
            "LastWeekVolume"
        );
        dataProcessor(
            getCollectionNoteworthyRequestTrigger,
            { limit: 4 },
            collectionNorthway,
            setCollectionNorthway,
            {},
            "CollectionNoteworthy"
        );

        let today = new Date();
        let yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        dataProcessor(
            getDailyTradesCountRequestTrigger,
            { date: today.toISOString().split("T")[0] },
            todayTradesCount,
            setTodayTradesCount,
            {},
            "DailyTradesCount"
        );
        dataProcessor(
            getDailyTradesCountRequestTrigger,
            { date: yesterday.toISOString().split("T")[0] },
            yesterdayTradesCount,
            setYesterdayTradesCount,
            {},
            "DailyTradesCount"
        );
    }, []);

    return (
        <div className="stats-conatiner">
            <ReactTooltip
                backgroundColor="#ffffff"
                textColor="#000000"
                className="stats-tooltip"
            />
            <div className="stats-reportBox">
                <div className="stats-numericResults">
                    <div className="stats-numericResults__dailyVolume">
                        <div className="stats-numericResults__volumeValue">
                            <span>
                                {lastWeekVolume.length > 0
                                    ? lastWeekVolume[0].sum
                                    : 0}
                            </span>
                            <span>EGLD</span>
                        </div>
                        <div className="stats-numericResults__volumeTitle">
                            <span>Today Volume</span>
                            <span>
                                {lastWeekVolume.length > 0
                                    ? lastWeekVolume[1].sum > 0
                                        ? (
                                              ((lastWeekVolume[0].sum -
                                                  lastWeekVolume[1].sum) /
                                                  (lastWeekVolume[1].sum *
                                                      100)) *
                                              10000
                                          ).toFixed(1)
                                        : 0
                                    : null}
                                %
                            </span>
                        </div>
                    </div>
                    <div className="stats-numericResults__reports">
                        <div className="stats-numericResults__numericCharts">
                            <div className="stats-numericResults__numericCharts--chart">
                                <div
                                    data-tip={yesterdayTradesCount}
                                    style={{
                                        height: `${
                                            (yesterdayTradesCount * 100) / 220 <
                                            200
                                                ? (yesterdayTradesCount * 100) /
                                                      220 +
                                                  4
                                                : 204
                                        }px`,
                                    }}
                                ></div>
                                <span>Yester Trades</span>
                            </div>

                            <div className="stats-numericResults__numericCharts--chart">
                                <div
                                    data-tip={todayTradesCount}
                                    style={{
                                        height: `${
                                            (todayTradesCount * 100) / 220 < 200
                                                ? (todayTradesCount * 100) /
                                                      220 +
                                                  4
                                                : 204
                                        }px`,
                                    }}
                                ></div>
                                <span>Today Trades</span>
                            </div>

                            <div className="stats-numericResults__numericCharts--chart">
                                <div
                                    data-tip={tradesCount}
                                    style={{
                                        height: `${
                                            (tradesCount * 100) / 220 < 200
                                                ? (tradesCount * 100) / 220 + 4
                                                : 204
                                        }px`,
                                    }}
                                ></div>
                                <span>Total Trades</span>
                            </div>

                            <div className="stats-numericResults__numericCharts--chart">
                                <div
                                    data-tip={totalVolume}
                                    style={{
                                        height: `${
                                            (totalVolume * 100) / 220 < 200
                                                ? (totalVolume * 100) / 220 + 4
                                                : 204
                                        }px`,
                                    }}
                                ></div>
                                <span>Total Volume</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="stats-volumeChart">
                    <span>Volume Traded</span>
                    <span>
                        {volumeDataHover} <span>EGLD</span>
                    </span>
                    <select>
                        <option>Last Week</option>
                    </select>
                    <div className="stats-volumeChart--chart">
                        <Chart
                            options={{
                                chart: {
                                    id: "chart",
                                    height: 178,
                                    type: "line",
                                    toolbar: {
                                        show: false,
                                    },
                                    zoom: {
                                        enabled: false,
                                    },
                                },
                                dataLabels: {
                                    enabled: true,
                                    formatter: (val, opts) => {
                                        return `◉`;
                                    },
                                    background: {
                                        enabled: false,
                                        foreColor: "#fff",
                                        padding: 0,
                                        borderRadius: 0,
                                        borderWidth: 0,
                                        borderColor: "#fff",
                                        opacity: 0,
                                        dropShadow: {
                                            enabled: false,
                                        },
                                    },
                                    style: {
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        colors: ["#fff"],
                                    },
                                },
                                tooltip: {
                                    theme: "dark",
                                    custom: ({ dataPointIndex }) => {
                                        setVolumeDataHover(
                                            series[0].data[dataPointIndex]
                                        );
                                        return null;
                                    },
                                },
                                stroke: {
                                    curve: "smooth",
                                    lineCap: "butt",
                                    colors: ["#2081E2"],
                                    width: 3,
                                },
                                grid: {
                                    show: false,
                                },
                                yaxis: {
                                    show: false,
                                },
                                xaxis: {
                                    categories:
                                        lastWeekVolume.length > 0
                                            ? [
                                                  lastWeekVolume[5].date,
                                                  lastWeekVolume[4].date,
                                                  lastWeekVolume[3].date,
                                                  lastWeekVolume[2].date,
                                                  lastWeekVolume[1].date,
                                                  lastWeekVolume[0].date,
                                              ]
                                            : ["", "", "", "", "", ""],
                                    labels: {
                                        show: false,
                                        style: {
                                            colors: "#ffffff",
                                            fontSize: "14px",
                                        },
                                    },
                                    axisBorder: {
                                        show: false,
                                    },
                                    axisTicks: {
                                        show: false,
                                    },
                                },
                            }}
                            series={series}
                            type="line"
                            width="380"
                        />
                    </div>
                </div>
                <div className="stats-topCollections">
                    <div className="stats-topCollections__showMoreCollection">
                        <div>
                            <span>Top</span>
                            <span>Collections</span>
                        </div>
                        <FontAwesomeIcon
                            style={{ margin: "0 16px 4px 0", fontSize: "24px" }}
                            icon={faIcons.faFire}
                        />
                    </div>

                    {
                        // ------- Start TopCollection Rendering -------
                        collectionNorthway.length > 0
                            ? collectionNorthway.map(
                                  (item: any, index: any) => (
                                      <Link to={`/collection/${item.tokenId}`}>
                                          <div
                                              key={item.id}
                                              className="stats-topCollections__collection"
                                              style={{
                                                  backgroundSize: "contain",
                                                  backgroundImage: `url(${item.profileImageLink})`,
                                              }}
                                          >
                                              <div className="stats-topCollections__collection--collectionBox">
                                                  <span>
                                                      {item.name.length > 7
                                                          ? `${item.name.substring(
                                                                0,
                                                                7
                                                            )}..`
                                                          : item.name}
                                                  </span>
                                              </div>
                                          </div>
                                      </Link>
                                  )
                              )
                            : null
                        // ------- End TopCollection Rendering -------
                    }

                    {process.env.REACT_APP_NODE_ENV != "production" ? (
                        <>
                            <Link to="/collection/ENFT-e7b4b7">
                                <div
                                    className="stats-topCollections__collection"
                                    style={{
                                        backgroundSize: "contain",
                                        backgroundImage: `url('https://storage.googleapis.com/youbei.io/images/ENFT-e7b4b7.profile')`,
                                    }}
                                >
                                    <div className="stats-topCollections__collection--collectionBox">
                                        <span>
                                            {"Regal Eagles".substring(0, 7)}..
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/collection/EAPES-8f3c1f">
                                <div
                                    className="stats-topCollections__collection"
                                    style={{
                                        backgroundSize: "contain",
                                        backgroundImage: `url('https://ipfs.io/ipfs/bafybeifzsevzibsmooayzhewrxruc2xahsxmwg7izunvd3zyg4obt5xyhe/EAPES-8f3c1f.profile')`,
                                    }}
                                >
                                    <div className="stats-topCollections__collection--collectionBox">
                                        <span>
                                            {"ELRONDAPESCLUB".substring(0, 7)}..
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/collection/GNOGONS-73222b/">
                                <div
                                    className="stats-topCollections__collection"
                                    style={{
                                        backgroundSize: "contain",
                                        backgroundImage: `url('https://ipfs.io/ipfs/bafybeifzsevzibsmooayzhewrxruc2xahsxmwg7izunvd3zyg4obt5xyhe/GNOGONS-73222b.profile')`,
                                    }}
                                >
                                    <div className="stats-topCollections__collection--collectionBox">
                                        <span>
                                            {"GNOGONS".substring(0, 7)}..
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            <Link to="/collection/DRIFTERS-efd96c/">
                                <div
                                    className="stats-topCollections__collection"
                                    style={{
                                        backgroundSize: "contain",
                                        backgroundImage: `url('https://ipfs.io/ipfs/bafybeifa4exebupo44bj7dgkgptzgihbwxqsd3mi2jpkw3xopok3tuojhi/DRIFTERS-efd96c.profile')`,
                                    }}
                                >
                                    <div className="stats-topCollections__collection--collectionBox">
                                        <span>
                                            {"Drifters".substring(0, 7)}..
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </>
                    ) : null}
                </div>
            </div>
            <div className="stats-activitiesBox">
                <div className="stats-activitiesBox__nftsValue">
                    <div className="stats-activitiesBox__nftsValue--bannerBox">
                        <span>{totalTokensCount}</span>
                        <span>NFT's On Sale</span>
                    </div>
                    <FontAwesomeIcon
                        style={{ margin: "32px 40px", fontSize: "24px" }}
                        icon={faIcons.faCloud}
                    />
                </div>
                <div className="stats-activitiesBox__activitiesLog">
                    <div className="stats-activitiesBox__activitiesLog--title">
                        <span>Last Activities</span>
                        <select>
                            <option>All Time</option>
                        </select>
                    </div>
                    <div className="stats-activitiesBox__activitiesLog--content">
                        {
                            // ------- Start Activities Rendering -------
                            transactionsList.length > 0
                                ? transactionsList.map(
                                      (item: any, index: any) =>
                                          index < 4 ? (
                                              <div
                                                  key={item.txId.toString()}
                                                  style={{
                                                      height: "72px",
                                                      opacity: "1",
                                                  }}
                                              >
                                                  <img
                                                      src={item.tokenImageLink}
                                                  />
                                                  <span>{item.tokenName}</span>
                                                  <span>
                                                      {item.txPriceNominal.toFixed(
                                                          3
                                                      )}{" "}
                                                      EGLD
                                                  </span>
                                                  <span className="stats-label">
                                                      <FontAwesomeIcon
                                                          style={{
                                                              margin:
                                                                  "0 8px 2px 0",
                                                              fontSize: "8px",
                                                              color: "#2081e2",
                                                          }}
                                                          icon={
                                                              faIcons.faDotCircle
                                                          }
                                                      />
                                                      {item.txType}
                                                  </span>
                                              </div>
                                          ) : null
                                  )
                                : null
                            // ------- End Activities Rendering -------
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
