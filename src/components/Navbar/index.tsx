import { useState } from 'react';
import Popup from 'reactjs-popup';
import { Link, useHistory } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { routePaths } from 'constants/router';
import { WalletSidebar } from 'components/index';
import { selectShouldDisplayWalletSidebar } from 'redux/selectors/ui';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { toggleShouldDisplayWalletSidebar } from 'redux/slices/ui';

import { SearchBar } from 'components/SearchBar'

import * as Dapp from "@elrondnetwork/dapp";



export const Navbar = () => {


    const dappLogout = Dapp.useLogout();


    const history = useHistory();

    const {
        loggedIn,
        address: userWalletAddress, } = Dapp.useContext();

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
                                <img src="/img/logos/logo_youbei.svg" className="c-navbar_brand-logo" />
                            </Link>

                            <Link to={routePaths.home} className="c-navbar_brand-name">
                                Youbei
                            </Link>

                        </div>


                    </div>

                    <div className="col-start-4  col-span-3 hidden lg:block">

                        <SearchBar wrapperClassNames={"align-items-center flex h-full justify-content-center"} />
                        
                    </div>

                    <div className="col-start-9 col-span-4 hidden lg:block">

                        <ul className="c-navbar_list  float-right">

                            {/* <li className="c-navbar_list-item">
                                <Link to={routePaths.marketplace} className="c-navbar_list-link">
                                    Explore
                                </Link>
                            </li> */}
                            <li className="c-navbar_list-item">
                                <Link to={routePaths.rankings} className="c-navbar_list-link">
                                    Rankings
                                </Link>
                            </li>
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


                    <div className="col-start-9 col-span-4 block lg:hidden">

                        <ul className="c-navbar_list  float-right">

                            <li className="c-navbar_list-item" onClick={handleToggleSidebar}>
                                <span className="c-navbar_list-link">
                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faBars} />
                                </span>
                            </li>


                        </ul>

                    </div>

                </div>


            </div>

            {

                <div className={`${!shouldDisplayWalletSidebar && 'hidden'}`}>
                    <WalletSidebar
                        overlayClickCallback={handleToggleSidebar}
                    />
                </div>
            }

        </>

    );

};

export default Navbar;
