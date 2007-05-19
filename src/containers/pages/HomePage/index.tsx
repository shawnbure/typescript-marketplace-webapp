

import { Link } from 'react-router-dom';


import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Footer } from 'components/index';



import SwiperCore, { Pagination, Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';


SwiperCore.use([Autoplay, Pagination, Navigation]);

export const HomePage = () => {


    const mapCarouselImgHolders = () => {

        const pics = [];

        for (let index = 1; index <= 26; index++) {

            const imgSrc = `./img/carousel/${index}.png`;

            pics.push(
                <SwiperSlide className="" key={`sp-${index}`}>


                    {/* <div className="c-card_img-container">
                    <img className="c-carousel_item" src={imgSrc} alt={`Carousel img #${index}`} />

                                    </div> */}

                    <div className="col-xs-12">
                        <div className="u-margin-tb-spacing-4">

                            <div className={`c-card c-card--homepage-feature`}>

                                <div className="c-card_img-container">
                                    <img src={imgSrc} className="c-card_img" alt="" />
                                </div>

                                {/* <div className="c-card_info">
                                        <img src={'./img/collections/moonkeyz/moonkeyz-promo-1.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            <span className="c-card_title">
                                                {'Moonkey #XYZ'}
                                            </span>
                                            <span className="c-card_collection-name u-text-theme-blue-place">
                                                {'Moonkeyz'}
                                            </span>
                                        </div>
                                    </div> */}
                            </div>

                        </div>
                    </div>


                </SwiperSlide>
            )


        }

        return pics;


    };


    return (

        <div className="p-homepage">


            <div className="row center-xs u-relative">

                <div className="p-homepage_lead-background"></div>

                <div className="p-homepage_lead-container col-xs-11 col-md-10">


                    <div className="row row--standard-max u-padding-bottom-spacing-10">

                        <div className="col-xs-12 col-md-6">

                            <div className="u-margin-top-spacing-13 u-padding-right-spacing-3">

                                <h1 className="u-visually-hidden">Erdsea</h1>

                                <h2 className="u-heading-lead u-text-bold u-margin-bottom-spacing-6 u-text-theme-white">
                                    Discover, collect, and sell exceptional NFTs
                                </h2>

                                <div className="row">

                                    <div className="col-xs-12 col-md-10 col-lg-8">

                                        {/* <p className="u-text-lead u-text-theme-gray-mid">
                                            on the Elrond's first open NFT marketplace
                                        </p> */}

                                        <p className="u-text-lead u-text-theme-gray-mid u-margin-bottom-spacing-10">
                                            Erdsea is the first open NFT marketplace on Elrond
                                        </p>

                                    </div>

                                </div>

                                <p className="u-margin-bottom-spacing-10 u-hidden-tablet-block">

                                    <a href={'https://discord.gg/VS3bfZVn5J'} className="c-button c-button--primary u-margin-bottom-spacing-4 u-margin-right-spacing-4">Get latest</a>
                                    <a href={'https://twitter.com/ErdseaNFT'} className="c-button c-button--secondary">Follow us</a>

                                </p>

                                <p className="u-margin-bottom-spacing-10 u-hidden-desktop-block">

                                    <a href={'https://discord.gg/VS3bfZVn5J'} className="c-button c-button--primary u-margin-spacing-2">Get latest</a>
                                    <a href={'https://twitter.com/ErdseaNFT'} className="c-button c-button--secondary u-margin-spacing-2">Follow us</a>

                                </p>



                            </div>

                        </div>

                        <div className="col-xs-12 col-md-6">
                            <div className="u-margin-top-spacing-9">

                                <div className={`c-card c-card--homepage-feature`}>

                                    <div className="c-card_img-container">
                                        <img src={'./img/collections/ergo-esse-natura/the-bird-catchers.jpg'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/collections/ergo-esse-natura/the-bird-catchers.jpg'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            <span className="c-card_title">
                                                {'The Bird Catchers'}
                                            </span>
                                            <span className="c-card_collection-name u-text-theme-blue-place">
                                                {'Ergo esse natura'}
                                            </span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>



                    <div className="row row--standard-max u-tac">

                        <div className="col-xs-12 col-md-3 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">
                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faBook} />


                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Create collections
                                </h3>

                                <p>
                                    Tutorials & docs about how to create your own collection with our ERD-721 standard
                                </p>

                            </div>

                        </div>


                        <div className="col-xs-12 col-md-3 u-margin-bottom-spacing-10">


                            <div className="u-padding-lr-spacing-2">

                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faTags} />


                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Minting NFTs
                                </h3>

                                <p>
                                    Mint NFTs directly on our marketplace and list them instantly
                                </p>

                            </div>


                        </div>


                        <div className="col-xs-12 col-md-3 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">

                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faCoins} />


                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Zero fees
                                </h3>

                                <p>
                                    Erdsea offers minting, listing and bidding* features with zero additional fees
                                </p>

                            </div>

                        </div>


                        <div className="col-xs-12 col-md-3 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">
                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faListOl} />


                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Rarity ranking
                                </h3>

                                <p>
                                    Erdsea displays rarity rank, score and traits statistics for every collection
                                </p>
                            </div>

                        </div>


                    </div>




                    <div className="row row--standard-max">


                        <div className="col-xs-12">
                            <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                Collections launching exclusively on Erdsea
                            </h3>
                        </div>

                        <div className="col-xs-12 col-md-4">
                            <div className="u-margin-tb-spacing-4">
                                <div className={`c-card c-card--homepage-feature`}>

                                    <div className="c-card_img-container">
                                        <img src={'./img/collections/kool-kitties/kool-kitties-promo-3.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/collections/kool-kitties/kool-kitties-promo-5.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            {/* <span className="c-card_title">
                                                {'Kool Kitty #XYZ'}
                                            </span> */}
                                            <span className="c-card_collection-name">
                                                {'Kool Kitties'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="col-xs-12 col-md-4">
                            <div className="u-margin-tb-spacing-4">

                                <div className={`c-card c-card--homepage-feature`}>

                                    <div className="c-card_img-container">
                                        <img src={'./img/collections/erdpunks/erdpunks-promo-1.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/collections/erdpunks/erdpunks-promo-3.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            {/* <span className="c-card_title">
                                                {'ErdPunk #XYZ'}
                                            </span> */}
                                            <span className="c-card_collection-name">
                                                {'ErdPunks'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div className="col-xs-12 col-md-4">
                            <div className="u-margin-tb-spacing-4">
                                <div className={`c-card c-card--homepage-feature`}>

                                    <div className="c-card_img-container">
                                        <img src={'./img/collections/mini-robos/mini-robos-promo-1.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/carousel/8.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            {/* <span className="c-card_title">
                                                {'Mini Robo #XYZ'}
                                            </span> */}
                                            <span className="c-card_collection-name">
                                                {'Mini Robos'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>





                        <div className="col-xs-12 col-md-4">
                            <div className="u-margin-tb-spacing-4">
                                <div className={`c-card c-card--homepage-feature`}>

                                    <div className="c-card_img-container">
                                        <img src={'./img/collections/duckerds/duckerds-promo-2.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/carousel/17.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            {/* <span className="c-card_title">
                                                {'Duckerd #XYZ'}
                                            </span> */}
                                            <span className="c-card_collection-name">
                                                {'Duckerds'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="col-xs-12 col-md-4">
                            <div className="u-margin-tb-spacing-4">
                                <div className={`c-card c-card--homepage-feature`}>

                                    <div className="c-card_img-container">
                                        <img src={'./img/collections/pixel-ladies/pixel-ladies-promo-1.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/carousel/10.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            {/* <span className="c-card_title">
                                                {'Pixel Lady #XYZ'}
                                            </span> */}
                                            <span className="c-card_collection-name">
                                                {'Pixel Ladies'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>



                        <div className="col-xs-12 col-md-4">
                            <div className="u-margin-tb-spacing-4">

                                <div className={`c-card c-card--homepage-feature`}>

                                    <div className="c-card_img-container">
                                        <img src={'./img/collections/moonkeyz/moonkeyz-promo-1.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/carousel/9.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            {/* <span className="c-card_title">
                                                {'Moonkey #XYZ'}
                                            </span> */}
                                            <span className="c-card_collection-name">
                                                {'Moonkeyz'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-xs-12">
                            <h3 className="u-margin-bottom-spacing-6 u-tac u-text-bold u-text-small">
                                More collections will be announced until the Erdsea launch date
                            </h3>
                        </div>

                        <div className="col-xs-12">


                            <Swiper
                                slidesPerView={3}
                                loop={true}
                                autoplay={{
                                    "delay": 2000,
                                    "disableOnInteraction": true
                                }}
                                className="">
                                {mapCarouselImgHolders()}
                            </Swiper>


                        </div>


                    </div>


                    <Footer />



                </div>

            </div>

        </div>
    );
};

export default HomePage;
