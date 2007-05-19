import { useState } from 'react';
import Popup from 'reactjs-popup';
import { Link } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { routePaths } from 'constants/router';
import { WalletSidebar } from 'components/index';

export const Navbar = () => {


    const [shouldDisplayWalletSidebar, setShouldDisplayWalletSidebar] = useState<boolean>(false);

    const toggleShouldDisplayWalletSidebar = () => {

        setShouldDisplayWalletSidebar(!shouldDisplayWalletSidebar);

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

                {/* <ul className="c-navbar_list">

                    <li className="c-navbar_list-item">
                        <Link to={routePaths.marketplace} className="c-navbar_list-link">
                            Marketplace
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

                    <li className="c-navbar_list-item" onClick={toggleShouldDisplayWalletSidebar}>
                        <span className="c-navbar_list-link">
                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faUserCircle} />
                        </span>
                    </li>


                </ul> */}

            </div>

            {
                shouldDisplayWalletSidebar &&

                <WalletSidebar
                    overlayClickCallback={toggleShouldDisplayWalletSidebar}
                />
            }

        </>

    );

};

export default Navbar;
