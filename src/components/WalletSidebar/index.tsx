import { routePaths } from "constants/router";
import { Link, useHistory, useLocation} from "react-router-dom";
import * as Dapp from "@elrondnetwork/dapp";

import { prepareTransaction } from "utils/transactions";


export const WalletSidebar: (Props: { overlayClickCallback?: Function }) => any = ({
    overlayClickCallback
}) => {

    const history = useHistory();
    const dappLogout = Dapp.useLogout();
    const sendTransaction = Dapp.useSendTransaction();
    const { loggedIn, address: walletAddress, account } = Dapp.useContext();
    const { balance } = account;
    const location = useLocation();
    const { pathname } = location;
    

    const shortWalletAddress: string = `${(walletAddress)?.substring(0, 7)}....${(walletAddress)?.substring(walletAddress.length - 4, walletAddress.length)}`;

    const handleOverlayClick = () => {

        overlayClickCallback?.();

    }

    const handleLogOut = (e: React.MouseEvent) => {
        

        
        e.preventDefault();

        overlayClickCallback?.();

        dappLogout({ callbackUrl: `${window.location.origin}/` });

        history.push(pathname);

    };

    if (!loggedIn) {
        return (

            <aside className="c-wallet-sidebar">
                <div onClick={handleOverlayClick} className="c-wallet-sidebar_overlay"></div>
                <div className="c-wallet-sidebar_container">

                    <Link to={routePaths.login} onClick={(e: any) => {  overlayClickCallback?.() }} className="c-button c-button--secondary" >
                        Login
                    </Link>

                </div>
            </aside>
        );
    }

    return (

        <aside className="c-wallet-sidebar">

            <div onClick={handleOverlayClick} className="c-wallet-sidebar_overlay"></div>

            <div className="c-wallet-sidebar_container">

                <p>
                    {(parseFloat(balance) / 1000000000000000000).toFixed(3)} EGLD
                </p>

                <p>
                    {shortWalletAddress}
                </p>

                <button className="c-button c-button--secondary" onClick={handleLogOut}>Logout</button>

            </div>
        </aside>
    );
};

export default WalletSidebar;
