import { useState } from 'react';
import Popup from 'reactjs-popup';
import { Link } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { routePaths } from 'constants/router';
import { WalletSidebar } from 'components/index';
import { selectShouldDisplayWalletSidebar } from 'redux/selectors/ui';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { toggleShouldDisplayWalletSidebar } from 'redux/slices/ui';

export const Navbar = () => {


    const dispatch = useAppDispatch();
    const shouldDisplayWalletSidebar = useAppSelector(selectShouldDisplayWalletSidebar);

    const handleToggleSidebar = () => {

        dispatch(toggleShouldDisplayWalletSidebar());

    }

    return (

        <>
            <div className="c-navbar">

                <div className="grid grid-cols-12">

                    <div className="col-span-2">


                        <div className="c-navbar_brand">

                            <Link to={routePaths.home}>
                                <img src="/img/logos/erdsea/erdsea-logo-white.svg" image-rendering="optimizeQuality" className="c-navbar_brand-logo" />
                            </Link>

                            <Link to={routePaths.home} className="c-navbar_brand-name">
                                Erdsea
                            </Link>

                        </div>


                    </div>

                    <div className="col-start-4 col-span-4">
                       <div className="align-items-center flex h-full justify-content-center">
                       <input type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black  p-2 placeholder-opacity-10 rounded-2 text-white w-full"  />
                       </div>
                    </div>

                    <div className="col-start-9 col-span-4">

                        <ul className="c-navbar_list  float-right">

                            <li className="c-navbar_list-item">
                                <Link to={routePaths.marketplace} className="c-navbar_list-link">
                                    Explore
                                </Link>
                            </li>
                            {/* <li className="c-navbar_list-item">
                                <Link to={routePaths.home} className="c-navbar_list-link">
                                    Stats
                                </Link>
                            </li> */}
                            <li className="c-navbar_list-item">
                                <a href={'https://erdseanft.gitbook.io/docs/'} target="_blank" className="c-navbar_list-link">
                                    Resources
                                </a>
                            </li>

                            <li className="c-navbar_list-item" onClick={handleToggleSidebar}>
                                <span className="c-navbar_list-link">
                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                </span>
                            </li>


                        </ul>


                    </div>

                </div>


            </div>

            {

                <div className={`${!shouldDisplayWalletSidebar && 'visually-hidden'}`}>
                    <WalletSidebar
                        overlayClickCallback={handleToggleSidebar}
                    />
                </div>
            }

        </>

    );

};

export default Navbar;
