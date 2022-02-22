

import { Link } from 'react-router-dom';


import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Footer } from 'components/index';
import { useEffect, useState } from "react";

import { formatImgLink } from "utils";

import SwiperCore, { Pagination, Navigation, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';


 import { useGetAllCollectionMutation } from 'services/collections';



SwiperCore.use([Autoplay, Pagination, Navigation]);



export const HomePage = () => {

    const [collectionList, setCollectionList] = useState<Array<any>>([]);

    const [getAllCollectionTrigger, {
         data: allCollections
     }] = useGetAllCollectionMutation();


    useEffect(() => {

        //This is called once on render
        getAllCollectionTrigger({});

        initializeAllCollection();        
      }, []);
      
      

    const initializeAllCollection = async () => {

        const formattedData = {
            //add any data for post (here as a placeholder)
        }

        //retrieve the session state
        const collectionsData: any = await getAllCollectionTrigger(formattedData);
        
         if( collectionsData?.data )
         {
             //set the api collection data call to the state array variable
             setCollectionList(collectionsData.data.data);
         }   
    }


    const mapCollections = () => {
        return collectionList.map((userCollection: any) => {
            const {
              id,
              name,
              tokenId,
              profileImageLink
            } = userCollection;
            return (
                    <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 md:mx-4 mb-8">

                    <Link to={`/collection/${tokenId}/`}>
                        <div className="u-margin-tb-spacing-4">
                            <div className={`c-card c-card--homepage-feature`}>

                                <div className="c-card_img-container">
                                    <img src={ formatImgLink(profileImageLink ? profileImageLink : './img/collections/CollectionProfileImageEmpty.jpg') } className="c-card_img" alt="" />
                                </div>

                                <div className="c-card_info">
                                    <div className="c-card_details">
                                        <span className="c-card_collection-name">
                                            {name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Link>
                </div>
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
                                        Trade with confidence. Create with ease.
                                        <br /><br />
                                        Youbei is the 💰-sharing community marketplace for Elrond NFTs.

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

                            <Link to={'/collection/HELIOS-d263f3'}>
                                <div className="u-margin-top-spacing-9">

                                    <div className={`c-card c-card--homepage-feature`}>

                                        <div className="c-card_img-container">
                                            <img src={'./img/collections/helios/preview.gif'} className="c-card_img" alt="" />
                                        </div>

                                        <div className="c-card_info">
                                            <img src={'./img/collections/helios/preview.gif'} className="c-card_creator-avatar" alt="" />
                                            <div className="c-card_details">
                                                <span className="c-card_title">
                                                    {'Helios Staking'}
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

                        {Boolean(collectionList.length) ? (
                        mapCollections()
                        ) : (
                        <div className="text-gray-500 text-center u-text-bold col-span-12 mr-8 mb-8">
                            no collections
                        </div>
                        )}

                    </div>



                    <br/><br/>


                    <br/>

                    <Footer />




                </div>

            </div>

        </div>
    );
};

export default HomePage;
