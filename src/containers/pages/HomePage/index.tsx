
import { Link } from 'react-router-dom';


import { Card, Footer } from 'components/index';

export const HomePage = () => {


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

                                <p className="u-margin-bottom-spacing-10">

                                    <Link className="c-button c-button--primary u-margin-right-spacing-4" to="#">Stay in touch</Link>
                                    <Link className="c-button  c-button--secondary" to="#">Launch details</Link>

                                </p>

                                <p>
                                    <Link to="#">Get listed for the launch</Link>
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


                    <div className="row row--standard-max">


                        <div className="col-xs-12">
                            <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                Collections launching exclusive on Erdsea
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
                                            <span className="c-card_title">
                                                {'ErdPunk'}
                                            </span>
                                            <span className="c-card_collection-name u-text-theme-blue-place">
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
                                        <img src={'./img/collections/erdpunks/erdpunks-promo-1.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/collections/erdpunks/erdpunks-promo-3.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            <span className="c-card_title">
                                                {'ErdPunk'}
                                            </span>
                                            <span className="c-card_collection-name u-text-theme-blue-place">
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
                                        <img src={'./img/collections/mini-robos/mini-robos-promo-1.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            <span className="c-card_title">
                                                {'ErdPunk'}
                                            </span>
                                            <span className="c-card_collection-name u-text-theme-blue-place">
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
                                        <img src={'./img/collections/duckerds/duckerds-promo-2.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/collections/duckerds/duckerds-promo-2.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            <span className="c-card_title">
                                                {'ErdPunk'}
                                            </span>
                                            <span className="c-card_collection-name u-text-theme-blue-place">
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
                                        <img src={'./img/collections/pixel-ladies/pixel-ladies-promo-1.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/collections/pixel-ladies/pixel-ladies-promo-1.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            <span className="c-card_title">
                                                {'ErdPunk'}
                                            </span>
                                            <span className="c-card_collection-name u-text-theme-blue-place">
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
                                        <img src={'./img/collections/moonkeyz/moonkeyz-promo-1.png'} className="c-card_img" alt="" />
                                    </div>

                                    <div className="c-card_info">
                                        <img src={'./img/collections/moonkeyz/moonkeyz-promo-1.png'} className="c-card_creator-avatar" alt="" />
                                        <div className="c-card_details">
                                            <span className="c-card_title">
                                                {'ErdPunk'}
                                            </span>
                                            <span className="c-card_collection-name u-text-theme-blue-place">
                                                {'ErdPunks'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-xs-12">
                            <h3 className="u-margin-bottom-spacing-6 u-tac u-text-bold u-text-small">
                                More collections will be announcened until the Erdsea launch date
                            </h3>
                        </div>

                    </div>


                    <Footer />



                </div>

            </div>

        </div>
    );
};

export default HomePage;
