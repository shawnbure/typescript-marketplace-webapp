//Modules
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//API Gateways

//Assets

export const ExplorerPage = () => {
    return (
        <>
            <div className="explorer-container">
                <div className="explorer-filterBox">
                    <span className="explorer-filterBox__title">Explorer</span>
                    <div className="explorer-filterBox__filters">
                        <div>
                            <button>
                                <FontAwesomeIcon style={{margin: '0 8px 0 0'}} icon={faIcons.faShoppingBag} /> Sale
                                type
                            </button>
                            <span style={{background: '#E2204E'}}>3</span>
                        </div>
                    </div>
                    <div className="explorer-filterBox__info">
                        <div>
                            <span>524</span>
                            <span>Item Found</span>
                            <span>for exploring</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faIcons.faAd} />
                        </div>
                    </div>
                </div>
                <div className="explorer-resultBox"></div>
            </div>
        </>
    );
};

export default ExplorerPage;
