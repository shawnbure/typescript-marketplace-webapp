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

                    <img src="" className="c-navbar_brand-logo" />
                    <Link to={routePaths.home} className="c-navbar_brand-name">
                        ErdSea
                    </Link>

                </div>

                <ul className="c-navbar_list">

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
                        <FontAwesomeIcon className="c-navbar_icon-link" icon={faIcons.faWallet} />
                    </li>


                </ul>

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
