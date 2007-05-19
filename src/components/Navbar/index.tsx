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

                <div className="c-navbar_brand">

                    <Link to={routePaths.home}>
                        <img src="/img/logos/erdsea/erdsea-logo-white.svg" image-rendering="optimizeQuality" className="c-navbar_brand-logo" />
                    </Link>

                    <Link to={routePaths.home} className="c-navbar_brand-name">
                        Erdsea
                    </Link>

                </div>

                <ul className="c-navbar_list">

                    <li className="c-navbar_list-item">
                        <Link to={routePaths.marketplace} className="c-navbar_list-link">
                            Explore
                        </Link>
                    </li>
                    <li className="c-navbar_list-item">
                        <Link to={routePaths.home} className="c-navbar_list-link">
                            Stats
                        </Link>
                    </li>
                    <li className="c-navbar_list-item">
                        <Link to={routePaths.home} className="c-navbar_list-link">
                            Resources
                        </Link>
                    </li>

                    <li className="c-navbar_list-item" onClick={handleToggleSidebar}>
                        <span className="c-navbar_list-link">
                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                        </span>
                    </li>


                </ul>

            </div>

            {
                shouldDisplayWalletSidebar &&

                <WalletSidebar
                    overlayClickCallback={handleToggleSidebar}
                />
            }

        </>

    );

};

export default Navbar;
