import { routePaths } from "constants/router";
import { Link, useHistory } from "react-router-dom";
import * as Dapp from "@elrondnetwork/dapp";
import { prepareTransaction } from "utils/transactions";
import buyNFTresponse from "services/NFT/buyNFTresponse";


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

        dappLogout({ callbackUrl: `${window.location.origin}/` });

        history.push("/");

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


        const rawData = buyNFTresponse.data;
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

                    <ul>
                        <li>
                            <Link to={routePaths.unlock}>
                                Maiar App
                            </Link>
                        </li>
                        <li>
                            <Link to={routePaths.walletconnect}>
                                Maiar Extension
                            </Link>
                        </li>
                        <li>
                            <Link to={routePaths.walletconnect}>
                                Maiar Web App
                            </Link>
                        </li>
                        <li>
                            <Link to={routePaths.ledger}>
                                Ledger
                            </Link>
                        </li>
                    </ul>
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

                <button onClick={testTransaction}>test</button>

                <button onClick={handleLogOut}>Logout</button>

            </div>
        </aside>
    );
};

export default WalletSidebar;
