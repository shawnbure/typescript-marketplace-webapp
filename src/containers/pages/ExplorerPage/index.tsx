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
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faShoppingBag}
                                />{" "}
                                Sale type
                            </button>
                        </div>

                        <div>
                            <button>
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faWindowMaximize}
                                />{" "}
                                Collections
                            </button>
                            <span style={{ background: "#E2204E" }}>1</span>
                        </div>

                        <div>
                            <button>
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faFilter}
                                />{" "}
                                Options
                            </button>
                        </div>

                        <div>
                            <button>
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faLayerGroup}
                                />{" "}
                                Sort
                            </button>
                            <span style={{ background: "#2081E2" }}>2</span>
                        </div>

                        <div>
                            <button>
                                <FontAwesomeIcon
                                    style={{
                                        margin: "0 8px 0 0",
                                        opacity: "0.5",
                                    }}
                                    icon={faIcons.faMoneyBill}
                                />{" "}
                                Price range
                            </button>
                        </div>
                    </div>

                    <div className="explorer-filterBox__info">
                        <div>
                            <span>524</span>
                            <span>Item Found</span>
                            <span>for exploring</span>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faIcons.faChevronRight} />
                        </div>
                    </div>
                </div>
                <div className="explorer-contentBox">
                    <div className="explorer-contentBox__content" style={{height: '240px'}}>
                        <div className="explorer-contentBox__content--image" style={{background: 'url()'}}>
                            <div>
                                <span>
                                    0.02<span> EGLD</span>
                                </span>
                            </div>
                        </div>
                        <div className="explorer-contentBox__content--details">
                            <img src="#" />
                            <div>
                                <span>Performan #2716</span>
                                <span>Performan Collection</span>
                            </div>
                            <div>
                                <span>BUY</span>
                                <span>NOW</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExplorerPage;
