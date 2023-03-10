import { Link, Redirect } from "react-router-dom";

import { routePaths } from "constants/router";
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import * as faBrandIcons from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Footer } from "components/index";
import { useEffect, useState } from "react";

import { formatImgLink } from "utils";

import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

import {
    useGetCollectionVerifiedMutation,
    useGetCollectionNoteworthyMutation,
    useGetCollectionTrendingMutation,
} from "services/collections";
import * as Dapp from "@elrondnetwork/dapp";
import { url } from "inspector";

//Assets
import noteworthyCollectionBg from "./../../../assets/img/noteworthy-collections.png";
import verifiedCollectionBg from "./../../../assets/img/verified-collections.png";

SwiperCore.use([Autoplay, Pagination, Navigation]);

export const HomePage = () => {
    const { loggedIn, address: userAddress } = Dapp.useContext();

    const [collectionVerifiedList, setCollectionVerifiedList] = useState<
        Array<any>
    >([]);
    const [collectionNoteworthyList, setCollectionNoteworthyList] = useState<
        Array<any>
    >([]);
    const [collectionTrendingList, setCollectionTrendingList] = useState<
        Array<any>
    >([]);

    const [
        getCollectionVerifiedTrigger,
        { data: collectionVerified },
    ] = useGetCollectionVerifiedMutation();

    const [
        getCollectionNoteworthyTrigger,
        { data: collectionNoteworthy },
    ] = useGetCollectionNoteworthyMutation();

    const [
        getCollectionTrendingTrigger,
        { data: collectionTrending },
    ] = useGetCollectionTrendingMutation();

    useEffect(() => {
        initializeCollections();
    }, []);

    const HandleCreateCollectionClick = () => {
        if (loggedIn) {
            window.location.href = "/collection/create";
        } else {
            alert("Please login to Create a Collection");
        }
    };

    const HandleRegisterCollectionClick = () => {
        if (loggedIn) {
            window.location.href = "/collection/register";
        } else {
            alert("Please login to Register a Collection");
        }
    };

    const HandleVerifyClick = () => {
        window.open(
            "https://enftdao.notion.site/Verification-e874591432eb4e0388df94470a3854a9",
            "_blank" // <- This is what makes it open in a new window.
        );
    };

    const initializeCollections = async () => {
        //Collection data size
        const verifiedDataLimit = 3;
        const noteworthyDataLimit = 3;
        const trendingDataLimit = 9;

        const collectionsVerifiedData: any = await getCollectionVerifiedTrigger(
            { limit: verifiedDataLimit }
        );

        if (collectionsVerifiedData?.data) {
            //set the api collection data call to the state array variable
            setCollectionVerifiedList(collectionsVerifiedData.data.data);
        }

        const collectionsNoteworthyData: any = await getCollectionNoteworthyTrigger(
            { limit: noteworthyDataLimit }
        );

        if (collectionsNoteworthyData?.data) {
            //set the api collection data call to the state array variable
            setCollectionNoteworthyList(collectionsNoteworthyData.data.data);
        }

        const collectionsTrendingData: any = await getCollectionTrendingTrigger(
            { limit: trendingDataLimit }
        );

        if (collectionsTrendingData?.data) {
            //set the api collection data call to the state array variable
            setCollectionTrendingList([
                collectionsTrendingData.data.data[0],
                collectionsTrendingData.data.data[1],
                collectionsTrendingData.data.data[2],
                collectionsTrendingData.data.data[3],
                collectionsTrendingData.data.data[4],
            ]);
        }
    };

    const mapCollectionList = (collectionList: any) => {
        return collectionList.map((userCollection: any) => {
            const {
                id,
                name,
                tokenId,
                profileImageLink,
                description,
            } = userCollection;

            return (
                <Link
                    className="home-collectionBox__box--right_collections--collection"
                    to={`/collection/${tokenId}/`}
                >
                    <div
                        className="home-collectionBox__box--right_collections--collection_img"
                        style={{
                            backgroundImage: `url(${formatImgLink(
                                profileImageLink
                                    ? profileImageLink
                                    : "./img/collections/CollectionProfileImageEmpty.jpg"
                            )})`,
                        }}
                    ></div>
                    <div className="home-collectionBox__box--details">
                        <span>
                            {name.length > 12
                                ? name.substr(0, 12) + "..."
                                : name}
                        </span>
                        <p>
                            {description.length > 0
                                ? description.length > 100
                                    ? description.substr(0, 100) + "..."
                                    : description
                                : "This collection has no description! See the collection page for more information"}
                        </p>
                    </div>
                </Link>
            );
        });
    };

    return (
        <div className="p-homepage">
            <div className="row center-xs u-relative">
                <div className="p-homepage_lead-background"></div>

                <div className="p-homepage_lead-container col-xs-11 col-md-10">
                    <div className="row row--standard-max u-padding-bottom-spacing-10">
                        <div className="col-xs-12 col-md-6">
                            <div className="u-margin-top-spacing-13 u-padding-right-spacing-3">
                                <h1 className="u-visually-hidden">Youbei</h1>

                                <h2 className="u-heading-lead u-text-bold u-margin-bottom-spacing-6 u-text-theme-white">
                                    Get Paid to NFT.
                                </h2>

                                <div className="row">
                                    <div className="col-xs-12 col-md-10 col-lg-8">
                                        {/* <p className="u-text-lead u-text-theme-gray-mid">
                                            on the Elrond's first open NFT marketplace
                                        </p> */}

                                        <p className="u-text-lead u-text-theme-gray-mid u-margin-bottom-spacing-10">
                                            Trade with confidence. Create with
                                            ease.
                                            <br />
                                            <br />
                                            Youbei is the ????-sharing community
                                            marketplace for Elrond NFTs.
                                        </p>
                                    </div>
                                </div>

                                <p className="u-margin-bottom-spacing-10">
                                    {loggedIn && (
                                        <Link
                                            to={routePaths.account}
                                            className="c-button c-button--primary"
                                        >
                                            List any NFT for Free
                                        </Link>
                                    )}
                                    {!loggedIn && (
                                        <a
                                            href="javascript:alert('Please login to List an NFT');"
                                            className="c-button c-button--primary"
                                        >
                                            List an NFT for Free
                                        </a>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="col-xs-12 col-md-6">
                            <Link to={"/collection/ENFT-e7b4b7"}>
                                <div className="u-margin-top-spacing-9">
                                    <div
                                        className={`c-card c-card--homepage-feature`}
                                    >
                                        <div className="c-card_img-container">
                                            <img
                                                src={
                                                    "./img/collections/regal-eagles/homepage_gif.gif"
                                                }
                                                className="c-card_img"
                                                alt=""
                                            />
                                        </div>

                                        <div className="c-card_info">
                                            <img
                                                src={
                                                    "./img/collections/regal-eagles/homepage_gif.gif"
                                                }
                                                className="c-card_creator-avatar"
                                                alt=""
                                            />
                                            <div className="c-card_details">
                                                <span className="c-card_title">
                                                    {"Regal Eagles"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="row row--standard-max u-tac" style={{margin: '40px auto'}}>
                        <div
                            className="col-xs-12 col-md-4 u-margin-bottom-spacing-10"
                            style={{ cursor: "pointer" }}
                            onClick={HandleCreateCollectionClick}
                        >
                            <div className="u-padding-lr-spacing-2 p-homepage_hoverableArea">
                                <FontAwesomeIcon
                                    className="u-text-theme-blue-anchor c-navbar_icon-link"
                                    icon={faIcons.faBook}
                                />

                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Create Collections
                                </h3>

                                <p>
                                    Mint NFTs directly on our marketplace and
                                    list them instantly
                                </p>
                            </div>
                        </div>

                        <div
                            className="col-xs-12 col-md-4 u-margin-bottom-spacing-10"
                            style={{ cursor: "pointer" }}
                            onClick={HandleRegisterCollectionClick}
                        >
                            <div className="u-padding-lr-spacing-2 p-homepage_hoverableArea">
                                <FontAwesomeIcon
                                    className="u-text-theme-blue-anchor c-navbar_icon-link"
                                    icon={faIcons.faTags}
                                />

                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Register Collection
                                </h3>
                                <p>
                                    Creators need to register each collection to
                                    enable trading on Youbei
                                </p>
                            </div>
                        </div>

                        <div
                            className="col-xs-12 col-md-4 u-margin-bottom-spacing-10"
                            style={{ cursor: "pointer" }}
                            onClick={HandleVerifyClick}
                        >
                            <div className="u-padding-lr-spacing-2 p-homepage_hoverableArea">
                                <FontAwesomeIcon
                                    className="u-text-theme-blue-anchor c-navbar_icon-link"
                                    icon={faIcons.faCheckCircle}
                                />

                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Verify Collection
                                </h3>

                                <p>Learn how to get your collection verified</p>
                            </div>
                        </div>
                    </div>

                    <div className="home-collectionBox">
                        <div
                            className="home-collectionBox__box"
                            style={{ background: `#111217` }}
                        >
                            <div
                                className="home-collectionBox__box--right"
                                style={{
                                    background: `url(${noteworthyCollectionBg})`,
                                }}
                            >
                                <div className="home-collectionBox__box--right_title">
                                    <span>
                                        Noteworthy
                                        <br />
                                        Collections
                                    </span>
                                </div>

                                <div className="home-collectionBox__box--head">
                                    <span>Noteworthy Collections</span>
                                </div>

                                <div className="home-collectionBox__box--right_collections">
                                    {Boolean(collectionNoteworthyList.length)
                                        ? mapCollectionList(
                                              collectionNoteworthyList
                                          )
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="home-collectionBox">
                        <div
                            className="home-collectionBox__box"
                            style={{
                                background: `linear-gradient(to bottom, #303339, rgba(48, 51, 57, 0))`,
                            }}
                        >
                            <div
                                className="home-collectionBox__box--left"
                                style={{
                                    background: `url(${verifiedCollectionBg})`,
                                }}
                            >
                                <div className="home-collectionBox__box--left_title">
                                    <span>
                                        Verified
                                        <br />
                                        Collections
                                    </span>
                                </div>

                                <div className="home-collectionBox__box--head">
                                    <span>Verified Collections</span>
                                </div>

                                <div className="home-collectionBox__box--left_collections">
                                    {Boolean(collectionVerifiedList.length)
                                        ? mapCollectionList(
                                              collectionVerifiedList
                                          )
                                        : null}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row row--standard-max u-tac">
                        <h2 className="u-heading-lead u-text-bold u-margin-bottom-spacing-6 u-text-theme-white">
                            <FontAwesomeIcon
                                className="u-text-theme-blue-anchor u-heading-lead"
                                icon={faIcons.faChartLine}
                            />
                            &nbsp; Recently Created
                        </h2>
                    </div>

                    <div className="home-collectionBox__recents">
                        {Boolean(collectionTrendingList.length) ? (
                            mapCollectionList(collectionTrendingList)
                        ) : (
                            <div className="text-white text-center u-text-normal col-span-12 mr-8 mb-8">
                                Currently, There are No Trending Collections
                            </div>
                        )}
                    </div>

                    <br />

                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
