import * as faIcons from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Chart from "react-apexcharts";

// Mock NFT Avatars
import nftAvatar1 from "./../../../assets/img/mock/nft-avatar-1.png";
import nftAvatar2 from "./../../../assets/img/mock/nft-avatar-2.png";
import nftAvatar3 from "./../../../assets/img/mock/nft-avatar-3.png";
import nftAvatar4 from "./../../../assets/img/mock/nft-avatar-4.png";

// Mock Collection Avatars
import collectionAvatar1 from "./../../../assets/img/mock/collection-avatar-1.png";
import collectionAvatar2 from "./../../../assets/img/mock/collection-avatar-2.png";
import collectionAvatar3 from "./../../../assets/img/mock/collection-avatar-3.png";
import collectionAvatar4 from "./../../../assets/img/mock/collection-avatar-4.png";
import { useEffect, useState } from "react";
import { DARK } from "constants/ui";

//API Gateways
import { useGetLastWeekVolumeMutation, useGetTokensCountMutation, useGetTotalVolumeMutation, useGetTradesCountMutation, useGetTransactionsListMutation } from "services/stats";

export const StatsPage = () => {
    let series = [
        {
            name: "series-1",
            data: [200, 600, 450, 200, 490, 600],
        },
    ];

    let [volumeDataHover, setVolumeDataHover] = useState(
        series[0].data[0] || 0
    );

    const [totalTokensCount, setTotalTokensCount] = useState<any>(0);
    const [transactionsList, setTransactionsList] = useState<any>({});
    const [tradesCount, setTradesCount] = useState<any>({});
    const [totalVolume, setTotalVolume] = useState<any>({});
    const [lastWeekVolume, setLastWeekVolume] = useState<any>({});
    

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

    let dataProcessor = async (
        functionTrigger: any,
        stateGetter: any,
        stateSetter: any,
        responeHolder: any,
        requestCase: string
    ) => {
        switch (requestCase) {

            case 'TokensCount':
                responeHolder = await functionTrigger({})
                stateSetter(responeHolder.data.data.sum)
                break;

            case 'TransactionsList':
                responeHolder = await functionTrigger([])
                stateSetter(responeHolder.data.data.transactions)
                break;
            
            case 'TradesCount':
                responeHolder = await functionTrigger([])
                stateSetter(responeHolder.data.data.Total)
                break;

            case 'TotalVolume':
                responeHolder = await functionTrigger([])
                stateSetter(responeHolder.data.data.sum)
                break;

            case 'LastWeekVolume':
                responeHolder = await functionTrigger([])
                stateSetter(responeHolder.data.data)
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        dataProcessor(getTokensCountRequestTrigger, totalTokensCount, setTotalTokensCount, {}, 'TokensCount');
        dataProcessor(getTransactionsListRequestTrigger, transactionsList, setTransactionsList, {}, 'TransactionsList');
        dataProcessor(getTradesCountRequestTrigger, tradesCount, setTradesCount, {}, 'TradesCount');
        dataProcessor(getTotalVolumeRequestTrigger, totalVolume, setTotalVolume, {}, 'TotalVolume');
        dataProcessor(getLastWeekVolumeRequestTrigger, lastWeekVolume, setLastWeekVolume, {}, 'LastWeekVolume');
    }, []);

    return (
        <div className="stats-conatiner">
            <div className="stats-reportBox">
                <div className="stats-numericResults">
                    <div className="stats-numericResults__dailyVolume">
                        <div className="stats-numericResults__volumeValue">
                            <span>62.3</span>
                            <span>EGLD</span>
                        </div>
                        <div className="stats-numericResults__volumeTitle">
                            <span>Today Volume</span>
                            <span>16%</span>
                        </div>
                    </div>
                    <div className="stats-numericResults__reports">
                        <div className="stats-numericResults__numericCharts">
                            <div className="stats-numericResults__numericCharts--chart">
                                <div style={{ height: "120px" }}></div>
                                <span>Growth Rate</span>
                            </div>

                            <div className="stats-numericResults__numericCharts--chart">
                                <div style={{ height: "70px" }}></div>
                                <span>Daily Trades</span>
                            </div>

                            <div className="stats-numericResults__numericCharts--chart">
                                <div style={{ height: "160px" }}></div>
                                <span>Total Trades</span>
                            </div>

                            <div className="stats-numericResults__numericCharts--chart">
                                <div style={{ height: "120px" }}></div>
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
                        <option>Weekly</option>
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
                                    categories: [
                                        `02/04`,
                                        `03/01`,
                                        `03/02`,
                                        `03/03`,
                                        `03/04`,
                                        `04/01`,
                                    ],
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
                            style={{ margin: "0 16px 0 0", fontSize: "24px" }}
                            icon={faIcons.faArrowAltCircleLeft}
                        />
                    </div>

                    <div
                        className="stats-topCollections__collection"
                        style={{ background: `url(${collectionAvatar1})` }}
                    >
                        <div className="stats-topCollections__collection--collectionBox">
                            <span>Lil Heros</span>
                        </div>
                    </div>

                    <div
                        className="stats-topCollections__collection"
                        style={{ background: `url(${collectionAvatar2})` }}
                    >
                        <div className="stats-topCollections__collection--collectionBox">
                            <span>Doodle</span>
                        </div>
                    </div>

                    <div
                        className="stats-topCollections__collection"
                        style={{ background: `url(${collectionAvatar3})` }}
                    >
                        <div className="stats-topCollections__collection--collectionBox">
                            <span>Regal Eagles</span>
                        </div>
                    </div>

                    <div
                        className="stats-topCollections__collection"
                        style={{ background: `url(${collectionAvatar4})` }}
                    >
                        <div className="stats-topCollections__collection--collectionBox">
                            <span>Apes Club</span>
                        </div>
                    </div>
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
                        icon={faIcons.faArrowAltCircleRight}
                    />
                </div>
                <div className="stats-activitiesBox__activitiesLog">
                    <div className="stats-activitiesBox__activitiesLog--title">
                        <span>Activities</span>
                        <select>
                            <option>Weekly</option>
                        </select>
                    </div>
                    <div className="stats-activitiesBox__activitiesLog--content">
                        <div style={{ height: "64px", opacity: 1 }}>
                            <img src={nftAvatar1} />
                            <span>ElrondApes #2887</span>
                            <span>3m</span>
                            <span
                                className="stats-label"
                                style={{ background: "#E2204E" }}
                            >
                                List
                            </span>
                        </div>

                        <div style={{ height: "80px", opacity: 1 }}>
                            <img src={nftAvatar2} />
                            <span>ElrondApes #2887</span>
                            <span>
                                5.67 <span>EGLD</span>
                            </span>
                            <span>8m</span>
                        </div>

                        <div style={{ height: "64px", opacity: 0.4 }}>
                            <img src={nftAvatar3} />
                            <span>ElrondApes #2887</span>
                            <span>56m</span>
                            <span
                                className="stats-label"
                                style={{ background: "#2081E2" }}
                            >
                                Offer
                            </span>
                        </div>

                        <div style={{ height: "80px", opacity: 0.1 }}>
                            <img src={nftAvatar4} />
                            <span>ElrondApes #2887</span>
                            <span>
                                5.67 <span>EGLD</span>
                            </span>
                            <span>1h 46m</span>
                        </div>
                    </div>
                    <button>Load More</button>
                </div>
            </div>
        </div>
    );
};

export default StatsPage;
