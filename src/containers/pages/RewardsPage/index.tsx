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

        <div className="text-gray-500 text-center u-text-bold col-span-12 mr-8 mb-8">

            <br />
            
            <h1 className="u-tac u-text-bold">Rewards</h1>
            
          
            <p className="u-text-lead u-text-theme-gray-mid u-margin-bottom-spacing-10">
                Hold-to-Earn with Onchain Warriors, EGLD Vault or Regal Eagles and share in the marketplace fees.

             </p>


             <br/>

             <div className="row row--standard-max u-tac">
                    <img src={'./img/rewards/Youbei-rewards.jpg'}  alt="" />
                
                </div>
            



            <br/>

            <p className="u-margin-bottom-spacing-10">

                <a href={'https://deadrare.io/collection/ENFT-d40748'} className="c-button c-button--primary u-margin-bottom-spacing-4 u-margin-right-spacing-4" target="_blank">Buy Vaults</a>
                <a href={'https://discord.gg/xBh7dEEeBc'} className="c-button c-button--secondary u-margin-bottom-spacing-4 u-margin-right-spacing-4" target="_blank">Get latest</a>
                <a href={'https://twitter.com/ElrondNFT'} className="c-button c-button--secondary u-margin-bottom-spacing-4 u-margin-right-spacing-4" target="_blank">Follow us</a>
                
                

            </p>

            


            <h2 className="u-tac u-text-bold">Roadmap</h2>

            <br/><br/>



            <div className="row row--standard-max u-tac">

                <div className="col-xs-12 col-md-4 u-margin-bottom-spacing-10">

                    <div className="u-padding-lr-spacing-2">
                        
                        <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessPawn} />  
                        
                        <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                            Alpha - <br/>
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

                        <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessKnight} />

                        <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                            Beta - <br/>
                            Reward Our Users 
                        </h3>

                        <p>                    
                            2% fee to daily active users in User Basic Income (UBI). <br/>
                            .5% fee to DAO Development.
                        </p>

                    </div>


                </div>








                <div className="col-xs-12 col-md-4 u-margin-bottom-spacing-10">

                    <div className="u-padding-lr-spacing-2">

                        <FontAwesomeIcon className="u-text-theme-blue-anchor c-navbar_icon-link" icon={faIcons.faChessKing} />
                        
                        <h3 className="u-text-lead u-text-bold u-tac u-margin-bottom-spacing-6">
                            Gamma - <br/>
                            Grow Sustainably 
                        </h3>

                        <p>
                            2% fee to daily active users in User Basic Income (UBI). <br/>
                            .5% fee to $ENFT Treasury.
                        </p>

                    </div>

                </div>

            </div>



            <br/>

            <Footer />

        </div>
      
    );
};

export default RewardsPage;