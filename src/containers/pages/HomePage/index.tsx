

import { Link } from 'react-router-dom';


import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Footer } from 'components/index';

import { asciiToHex } from "utils";

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

                                <h1 className="u-visually-hidden">Youbei</h1>

                                <h2 className="u-heading-lead u-text-bold u-margin-bottom-spacing-6 u-text-theme-white">
                                Get Paid to Collect, Hold-To-Earn. 

                                </h2>

                                <div className="row">

                                    <div className="col-xs-12 col-md-10 col-lg-8">

                                        {/* <p className="u-text-lead u-text-theme-gray-mid">
                                            on the Elrond's first open NFT marketplace
                                        </p> */}

                                        <p className="u-text-lead u-text-theme-gray-mid u-margin-bottom-spacing-10">
                                        Youbei is the profit-sharing community marketplace for Elrond NFTs. 
                                        Easy and Fast for Creators, Safe and Reliable for Collectors.

                                        </p>

                                    </div>

                                </div>

                             

                                <p className="u-margin-bottom-spacing-10 u-hidden-tablet-block">

                                    <a href={'https://discord.gg/xBh7dEEeBc'} className="c-button c-button--primary u-margin-bottom-spacing-4 u-margin-right-spacing-4">Get latest</a>
                                    <a href={'https://twitter.com/ElrondNFT'} className="c-button c-button--secondary">Follow us</a>

                                </p>

                                <p className="u-margin-bottom-spacing-10 u-hidden-desktop-block">

                                    <a href={'https://discord.gg/xBh7dEEeBc'} className="c-button c-button--primary u-margin-spacing-2">Get latest</a>
                                    <a href={'https://twitter.com/ElrondNFT'} className="c-button c-button--secondary u-margin-spacing-2">Follow us</a>

                                </p>



                            </div>

                        </div>

                        <div className="col-xs-12 col-md-6">

                            <Link to={'/collection/PIGSEL-91e91b'}>
                                <div className="u-margin-top-spacing-9">

                                    <div className={`c-card c-card--homepage-feature`}>

                                        <div className="c-card_img-container">
                                            <img src={'./img/collections/regal-eagles/regal-eagles-promo.png'} className="c-card_img" alt="" />
                                        </div>

                                        <div className="c-card_info">
                                            <img src={'./img/collections/regal-eagles/regal-eagles-profile.png'} className="c-card_creator-avatar" alt="" />
                                            <div className="c-card_details">
                                                <span className="c-card_title">
                                                    {'Regal Eagles'}
                                                </span>

                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </Link>
                        </div>

                    </div>



                    <div className="row row--standard-max u-tac">

                        <div className="col-xs-12 col-md-3 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">
                                { /*
                                    <img src = "./img/SVG/icon_create.svg?" alt="My Happy SVG" className="u-text-theme-blue-anchor c-navbar_icon-link" />
                                */ }

                                   
                                
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
                                { /*  
                                    <img src = "./img/SVG/icon_minting.svg?" alt="My Happy SVG" className="u-text-theme-blue-anchor c-navbar_icon-link" />
                                */ }
                                
                                
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

                            { /*  <img src = "./img/SVG/icon_zero_fees.svg?" alt="My Happy SVG" className="u-text-theme-blue-anchor c-navbar_icon-link" /> */ }

                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faCoins} />
                                


                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Zero fees
                                </h3>

                                <p>
                                    Youbei offers minting, listing and bidding features with zero additional fees to save collectors crypto
                                </p>

                            </div>

                        </div>


                        <div className="col-xs-12 col-md-3 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">
                                
                                
                                { /* <<img src = "./img/SVG/icon_zero_fees.svg?" alt="My Happy SVG" className="u-text-theme-blue-anchor c-navbar_icon-link" /> */ }

                                
                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faListOl} />

                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Rarity ranking
                                </h3>

                                <p>
                                    Youbei displays rarity rank, score and trait statistics for every collection to give collectors the right information at the right time
                                </p>
                            </div>

                        </div>


                    </div>




                    <div className="grid grid-cols-12">






                        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 md:mx-4 mb-8">


                            <Link to={`/collection/TinyWings`}>
                                <div className="u-margin-tb-spacing-4">

                                    <div className={`c-card c-card--homepage-feature`}>

                                        <div className="c-card_img-container">
                                            <img src={'./img/collections/TinyWings/Promo_TinyWings.png'} className="c-card_img" alt="" />
                                        </div>

                                        <div className="c-card_info">
                                            <img src={'./img/collections/TinyWings/Profile_TinyWings.png'} className="c-card_creator-avatar" alt="" />
                                            <div className="c-card_details">
                                                <span className="c-card_title">
                                                    {'Tiny Wings'}
                                                </span>
                                            </div>
                                        </div>


                                    </div>


                                </div>

                            </Link>
                        </div>


                        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 md:mx-4 mb-8">
                            <Link to={`/collection/MNROBOS-39ece5`}>
                                <div className="u-margin-tb-spacing-4">
                                    <div className={`c-card c-card--homepage-feature`}>

                                        <div className="c-card_img-container">
                                            <img src={'./img/collections/mini-robos/mini-robos-promo-1.png'} className="c-card_img" alt="" />
                                        </div>

                                        <div className="c-card_info">
                                            <img src={'./img/carousel/8.png'} className="c-card_creator-avatar" alt="" />
                                            <div className="c-card_details">

                                                <span className="c-card_collection-name">
                                                    {'Mini Robos'}
                                                </span>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </Link>
                        </div>





                        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 md:mx-4 mb-8">

                            <Link to={`/collection/DUCKERDS-348dd3`}>
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

                            </Link>
                        </div>

                        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 md:mx-4 mb-8">

                            <Link to={`/collection/MOONKEYZ-7af2e1`}>
                                <div className="u-margin-tb-spacing-4">

                                    <div className={`c-card c-card--homepage-feature`}>

                                        <div className="c-card_img-container">
                                            <img src={'./img/collections/moonkeyz/moonkeyz-promo-1.png'} className="c-card_img" alt="" />
                                        </div>

                                        <div className="c-card_info">
                                            <img src={'./img/carousel/9.png'} className="c-card_creator-avatar" alt="" />
                                            <div className="c-card_details">
                                                <span className="c-card_collection-name">
                                                    {'Moonkeyz'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </Link>
                        </div>


                        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 md:mx-4 mb-8">

                            <Link to={`/collection/LADIES-677dc6`}>
                                <div className="u-margin-tb-spacing-4">

                                    <div className={`c-card c-card--homepage-feature`}>

                                        <div className="c-card_img-container">
                                            <img src={'./img/collections/pixel-ladies/pixel-ladies-promo-1.png'} className="c-card_img" alt="" />
                                        </div>

                                        <div className="c-card_info">
                                            <img src={'./img/carousel/10.png'} className="c-card_creator-avatar" alt="" />
                                            <div className="c-card_details">
                                                <span className="c-card_collection-name">
                                                    {'Pixel Ladies'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </Link>
                        </div>



                        <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 md:mx-4 mb-8">

                            <Link to={'/collection/PIGSEL-91e91b'}>

                                <div className="u-margin-top-spacing-4">

                                    <div className={`c-card c-card--homepage-feature`}>

                                        <div className="c-card_img-container">
                                            <img src={'./img/avatar.jpg'} className="c-card_img" alt="" />
                                        </div>

                                        <div className="c-card_info">
                                            <img src={'https://res.cloudinary.com/deaezbrer/image/upload/v1636990119/erd1dtug93adfr7jd8q35u8jjp34prnpwscpvgtrfe8gltmdas44zppspzhgje.profile.png'} className="c-card_creator-avatar" alt="" />
                                            <div className="c-card_details">
                                                <span className="c-card_title">
                                                    {'Pigselated'}
                                                </span>

                                            </div>
                                        </div>


                                    </div>
                                </div>

                            </Link>

                        </div>


                    </div>



                    <br/><br/>

                    <h1 className="u-tac u-text-bold">Roadmap</h1>

                    <div className="row row--standard-max u-tac">

                        <div className="col-xs-12 col-md-4 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">
                                { /*
                                    <img src = "./img/SVG/icon_create.svg?" alt="My Happy SVG" className="u-text-theme-blue-anchor c-navbar_icon-link" />
                                */ }

                                   
                                
                            <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessPawn} />  
                                
                     
                                

                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Alpha Phase: <br/>
                                    Reward Early Adopters
                                </h3>

                                <p>
                                
                                
                                    2% fee to holders of Onchain Warriors, EGLD Vault and Regal Eagle NFTs.
.5% fee to DAO Development. 

                                </p>

                            </div>

                        </div>


 

                        <div className="col-xs-12 col-md-4 u-margin-bottom-spacing-10">


                            <div className="u-padding-lr-spacing-2">
                                { /*  
                                    <img src = "./img/SVG/icon_minting.svg?" alt="My Happy SVG" className="u-text-theme-blue-anchor c-navbar_icon-link" />
                                */ }
                                
                                
                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessKnight} />

                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Beta Phase:<br/>
                                    Reward Our Users 
                                </h3>

                                <p>
                                
                                

                                    80% profits to daily active users in User Basic Income (UBI).
							 20% profits to DAO Development.

                                </p>

                            </div>


                        </div>


                        <div className="col-xs-12 col-md-4 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">

                            { /*  <img src = "./img/SVG/icon_zero_fees.svg?" alt="My Happy SVG" className="u-text-theme-blue-anchor c-navbar_icon-link" /> */ }

                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessKing} />
                                


                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Gamma Phase:<br/>
                                    Grow Sustainably 
                                </h3>

                                <p>
                                    
                                    80% profits to daily active users in User Basic Income (UBI).
							20% profits to $ENFT Treasury.

                                </p>

                            </div>

                        </div>





                    </div>


                    <br/>

                    <Footer />




                </div>

            </div>

        </div>
    );
};

export default HomePage;
