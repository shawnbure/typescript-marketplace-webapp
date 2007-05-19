import { routePaths } from "constants/router";
import { Link, useHistory } from "react-router-dom";
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

    const shortWalletAddress: string = `${(walletAddress)?.substring(0, 7)}....${(walletAddress)?.substring(walletAddress.length - 4, walletAddress.length)}`;

    const handleOverlayClick = () => {

        overlayClickCallback?.();

    }

    const handleLogOut = (e: React.MouseEvent) => {

        e.preventDefault();

        overlayClickCallback?.();

        dappLogout({ callbackUrl: `${window.location.origin}/` });

        history.push("/");

    };

    const handleLogin = (e: React.MouseEvent) => {

        e.preventDefault();

        overlayClickCallback?.();

        history.push("/unlock");

    };



    const testTransaction = async () => {


        const testData = {
            "version": 1,
            "data": "pong",
            "chainID": "D",
            "value": "0",
            "gasPrice": 1000000000,
            "gasLimit": 15000000,
            "receiver": "erd1qqqqqqqqqqqqqpgquvt728n40ssd8n2qns9jrlqpwq2jc4rj4cysfuj3ad",
        }


       
        const unconsumedTransaction = prepareTransaction(testData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: ''
        });

       

    }

    if (!loggedIn) {
        return (

            <aside className="c-wallet-sidebar">
                <div onClick={handleOverlayClick} className="c-wallet-sidebar_overlay"></div>
                <div className="c-wallet-sidebar_container">
                    <p>
                        <span>icon </span>
                        My wallet
                    </p>
                    <p>
                        Connect with one of our available wallet info providers
                    </p>

                    <button className="c-button c-button--secondary" onClick={handleLogin}>Login</button>

                 </div>
            </aside>
        );
    }

    return (

        <aside className="c-wallet-sidebar">

            <div onClick={handleOverlayClick} className="c-wallet-sidebar_overlay"></div>

            <div className="c-wallet-sidebar_container">

                <p>
                    Loggedn
                </p>

                <p>
                    {shortWalletAddress}
                </p>

                <button className="c-button c-button--secondary" onClick={testTransaction}>test</button>

                <button className="c-button c-button--secondary" onClick={handleLogOut}>Logout</button>

            </div>
        </aside>
    );
};

export default WalletSidebar;
