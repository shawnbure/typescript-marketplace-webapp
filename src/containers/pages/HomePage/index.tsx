
import { Link } from 'react-router-dom';


import { Card, Footer} from 'components/index';

export const HomePage = () => {


    return (

        <div className="p-homepage">


            <div className="row center-xs u-relative">

                <div className="p-homepage_lead-background"></div>

                <div className="p-homepage_lead-container col-xs-11 col-md-10">


                    <div className="row row--standard-max">

                        <div className="col-xs-12 col-md-6">

                            <div className="u-margin-top-spacing-13 u-padding-right-spacing-3">
                                <h1 className="u-visually-hidden">Erdsea</h1>

                                <h2 className="u-heading-lead u-text-bold u-margin-bottom-spacing-6 u-text-theme-white">
                                    Discover, collect, and sell extraordinary NFTs
                                </h2>

                                <div className="row">

                                    <div className="col-xs-12 col-md-10 col-lg-8">

                                        <p className="u-text-lead u-text-theme-gray-mid">
                                            on the Elrond's first & largest open NFT marketplace
                                        </p>

                                    </div>

                                </div>

                                <p className="u-margin-bottom-spacing-10">
                                    
                                    <Link className="c-button c-button--primary u-margin-right-spacing-4" to="#">Explore</Link>
                                    <Link className="c-button  c-button--secondary" to="#">Create</Link>

                                </p>

                                <p>
                                    <Link to="#">Get featured on the homepage</Link>
                                </p>

                            </div>

                        </div>

                        <div className="col-xs-12 col-md-6">
                            <div className="u-margin-top-spacing-9">
                                <Card
                                    classNames={'c-card--homepage-feature'}
                                    title={'Titan Speciak'}
                                    mediaSrcPath={'./img/mock/token-img.png'}
                                    creatorAvatarSrcPath={'./img/mock/creator-avatar.png'}
                                    collectionName={'Giant Titans'}
                                    collectionLink={'/gigants'}
                                    cardLinkTarget={'/token/WAMEN-083b50/1'}
                                />
                            </div>
                        </div>

                    </div>


                    <Footer />



                </div>

            </div>

        </div>
    );
};

export default HomePage;
