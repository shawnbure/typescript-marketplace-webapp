import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
import { Link, useHistory } from "react-router-dom";
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import * as faBrandIcons from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { routePaths } from "constants/router";
import { WalletSidebar } from "components/index";
import { selectShouldDisplayWalletSidebar } from "redux/selectors/ui";
import { useAppDispatch, useAppSelector } from "redux/store";
import { toggleShouldDisplayWalletSidebar } from "redux/slices/ui";

import { SearchBar } from "components/SearchBar";

import * as Dapp from "@elrondnetwork/dapp";
import {
    useGetAccountGatewayTokensMutation,
    useGetOnSaleAccountTokensMutation,
} from "services/accounts";
import { getCookie, setCookie } from "utils";

export const Navbar = () => {
    const dappLogout = Dapp.useLogout();

    const history = useHistory();

    const { loggedIn, address: userWalletAddress } = Dapp.useContext();

    const dispatch = useAppDispatch();
    const shouldDisplayWalletSidebar = useAppSelector(
        selectShouldDisplayWalletSidebar
    );

    const handleToggleSidebar = () => {
        dispatch(toggleShouldDisplayWalletSidebar());
    };

    // Read Profile Data
    const [onSaleNfts, setOnSaleNfts] = useState<Array<any>>([]);
    const [loadMoreOnSale, setLoadMoreOnSale] = useState<boolean>(true);
    const [availableTokens, setAvailableTokens] = useState<any>({});
    const [unlistedNfts, setUnlistedNfts] = useState<Array<any>>([]);

    // Data Mutations
    const [
        getOnSaleAccountTokensRequestTrigger,
        {
            data: accountOnSaleTokenData,
            isLoading: isLoadingOnSaleAccountTokensRequest,
            isUninitialized: isUninitializedOnSaleAccountTokensRequest,
        },
    ] = useGetOnSaleAccountTokensMutation();

    const [
        getAccountGatewayRequestTrigger,
        {
            data: accountGatewayData,
            isLoading: isLoadingAccountGatewayRequest,
            isUninitialized: isUninitializedAccountGatewayRequest,
        },
    ] = useGetAccountGatewayTokensMutation();

    // Controllers
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

            hasFetchedNewData =
                previousDataArrayLenght !== newDataArray?.length;

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

    const InitialLoadOfUnlistedData = async (getFunctionTrigger: any) => {
        var offset = 0;
        var limit = 25;
        var gotAllRecords = false;
        var arrayNFTs = new Array();

        do {
            const dataResponse = await getFunctionTrigger({
                userWalletAddress,
                limit,
                offset,
            });

            if (!dataResponse.data) {
                gotAllRecords = true;
            }

            //extract out nft and token data
            const { nfts, availableTokensData } = dataResponse.data;

            const newNFTs = [...nfts];

            if (newNFTs.length == 0) {
                gotAllRecords = true;

                break;
            }

            arrayNFTs = [...arrayNFTs, ...nfts];

            setAvailableTokens({ ...availableTokens, ...availableTokensData });

            offset += limit;
        } while (!gotAllRecords);

        setUnlistedNfts(arrayNFTs);
    };

    useEffect(() => {
        if (loggedIn) {
            getMoreOnSaleTokens();
            InitialLoadOfUnlistedData(getAccountGatewayRequestTrigger);

            if (getCookie(userWalletAddress.toString()) != "false") {
                window.onbeforeunload = () =>
                    setCookie(
                        userWalletAddress.toString(),
                        "false",
                        "Thu, 19 Jan 2100 12:00:00 UTC"
                    );
            }
        }
    }, [loggedIn]);

    return (
        <>
            <div className="c-navbar">
                <div className="grid grid-cols-12">
                    <div className="col-span-2">
                        <div className="c-navbar_brand">
                            <Link to={routePaths.home}>
                                <img
                                    src="/img/logos/logo_youbei.svg"
                                    className="c-navbar_brand-logo"
                                />
                            </Link>
                            <Link
                                to={routePaths.home}
                                className="c-navbar_brand-name"
                            >
                                Youbei
                            </Link>
                            &nbsp;
                            <span className="c-navbar_brand-name-sub">
                                {process.env.REACT_APP_NODE_ENV == "production" ? 'ALPHA' : 'DEV'}
                            </span>
                        </div>
                    </div>

                    <div className="col-start-4  col-span-3 hidden lg:block">
                        <SearchBar
                            wrapperClassNames={
                                "align-items-center flex h-full justify-content-center"
                            }
                        />
                    </div>

                    <div className="col-start-9 col-span-4 hidden lg:block">
                        <ul className="c-navbar_list  float-right">
                            <li className="c-navbar_list-item">
                                <Link
                                    to={routePaths.rewards}
                                    className="c-navbar_list-link"
                                >
                                    Rewards
                                </Link>
                            </li>

                            <li className="c-navbar_list-item">
                                <Link
                                    to={routePaths.explorer}
                                    className="c-navbar_list-link"
                                >
                                    Explorer
                                </Link>
                            </li>

                            <li className="c-navbar_list-item">
                                <Link
                                    to={routePaths.activity}
                                    className="c-navbar_list-link"
                                >
                                    Activity
                                </Link>
                            </li>

                            {loggedIn && (
                                <li
                                    className="c-navbar_list-item"
                                    onClick={handleToggleSidebar}
                                >
                                    <span className="c-navbar_list-link">
                                        <FontAwesomeIcon
                                            width={"20px"}
                                            className="c-navbar_icon-link"
                                            icon={faIcons.faWallet}
                                        />
                                    </span>
                                </li>
                            )}
                            {!loggedIn && (
                                <li
                                    className="c-navbar_list-item"
                                    onClick={handleToggleSidebar}
                                >
                                    <span className="c-navbar_list-link">
                                        Login
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="col-start-9 col-span-4 block lg:hidden">
                        <ul className="c-navbar_list  float-right">
                            <li
                                className="c-navbar_list-item"
                                onClick={handleToggleSidebar}
                            >
                                <span className="c-navbar_list-link">
                                    <FontAwesomeIcon
                                        width={"20px"}
                                        className="c-navbar_icon-link"
                                        icon={faIcons.faBars}
                                    />
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {
                <div className={`${!shouldDisplayWalletSidebar && "hidden"}`}>
                    <WalletSidebar overlayClickCallback={handleToggleSidebar} />
                </div>
            }
        </>
    );
};

export default Navbar;
