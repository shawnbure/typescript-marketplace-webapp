/* eslint-disable */ 
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import * as faIcons from '@fortawesome/free-solid-svg-icons';

import { ErrorMessage } from '@hookform/error-message';

import { prepareTransaction } from "utils/transactions";


import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleCopyToClipboard } from "utils";

import { toast } from 'react-toastify';

import { Footer } from 'components/index';


export const RewardsPage = () => {



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
                            Rewards

                            </h2>

                            <div className="row">

                                <div className="col-xs-12 col-md-10 col-lg-8">

                                    {/* <p className="u-text-lead u-text-theme-gray-mid">
                                        on the Elrond's first open NFT marketplace
                                    </p> */}

                                    <p className="u-text-lead u-text-theme-gray-mid u-margin-bottom-spacing-10">
                                        Hold-to-Earn with Onchain Warriors, EGLD Vault, or Regal Eagles and 
                                        share in the marketplace fees
                                    </p>


                                </div>

                            </div> 






                            <p className="u-margin-bottom-spacing-10">

                                <Link to={'/collection/ENFT-d40748'} className="c-button c-button--primary" >                        
                                    <div className="inline-flex">
                                        <span>
                                             Buy Vaults
                                        </span>
                                    </div>
                                </Link>
                            
                                &nbsp; &nbsp;

                                <Link to={'/collection/ENFT-c26061'} className="c-button c-button--primary" >                        
                                    <div className="inline-flex">
                                        <span>
                                             Buy OCW
                                        </span>
                                    </div>
                                </Link>

                                <br/><br/>

                                <Link to={'/collection/ENFT-e7b4b7'} className="c-button c-button--primary" >                        
                                    <div className="inline-flex">
                                        <span>
                                             Buy Regal Eagles
                                        </span>
                                    </div>
                                </Link>


                                


                                <br/><br/>
                                <a href={'https://discord.gg/xBh7dEEeBc'} className="c-button c-button--secondary u-margin-bottom-spacing-4 u-margin-right-spacing-4" target="_blank">Get latest</a>
                                <a href={'https://twitter.com/ElrondNFT'} className="c-button c-button--secondary u-margin-bottom-spacing-4 u-margin-right-spacing-4" target="_blank">Follow us</a>

                            </p>


                        </div>

                    </div>

                        <div className="col-xs-12 col-md-6">

                                <div className="u-margin-top-spacing-9">

                                    <div className={`c-card c-card--homepage-feature`}>

                                        <div className="c-card_img-container">
                                            <img src={'./img/rewards-hatching-soon.jpg'} className="c-card_img" alt="" />
                                        </div>

                                        <div className="c-card_info">
                                            <img src={'./img/reward-avatar.jpg'} className="c-card_creator-avatar" alt="" />
                                            <div className="c-card_details">
                                                <span className="c-card_title">
                                                    {'Rewards Coming Soon'}
                                                </span>

                                            </div>
                                        </div>


                                    </div>
                                </div>
                        </div>

                </div>

                    <h1 className="u-tac u-text-bold">Roadmap</h1>

                    <br/>

                    <div className="row row--standard-max u-tac">
                    
                        <div className="col-xs-12 col-md-4 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">
                                
                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessPawn} />  
                                
                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Alpha <br/>
                                    Reward Early Adopters
                                </h3>

                                <p>                    
                                    &nbsp;
                                </p>
                            </div>
                        </div>

                        <div className="col-xs-12 col-md-4 u-margin-bottom-spacing-10">


                            <div className="u-padding-lr-spacing-2">

                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessKnight} />

                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Beta <br/>
                                    Reward Our Users 
                                </h3>
                                <p>                    
                                    &nbsp;
                                </p>

                            </div>
                        </div>

                        <div className="col-xs-12 col-md-4 u-margin-bottom-spacing-10">

                            <div className="u-padding-lr-spacing-2">

                                <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessKing} />
                                
                                <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                                    Gamma <br/>
                                    Grow Sustainably 
                                </h3>

                                <p>                    
                                    &nbsp;
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

export default RewardsPage;