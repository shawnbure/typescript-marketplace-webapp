import * as faIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { routePaths } from "constants/router";
import { Link } from "react-router-dom";

export const Navbar = () => {

    return (

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
                    <Link to={routePaths.marketplace} className="c-navbar_list-link">
                        <FontAwesomeIcon className="c-navbar_icon-link" icon={faIcons.faWallet} />
                    </Link>
                </li>


                
            </ul>
        </div>
    );

};

export default Navbar;
