//Modules
import * as faIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//API Gateways

//Assets
import egldIcon from "./../../../assets/img/egld-icon.png";

import dollarSign from "./../../../assets/img/labels/dollar-sign.svg";
import zapSign from "./../../../assets/img/labels/zap-sign.svg";
import tagSign from "./../../../assets/img/labels/tag-sign.svg";

export const ActivityPage = () => {
    let mockData = [
        {
            type: "Sell",
            title: "Beanz #15563",
            collection: "Beanz Official",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/agPcHLvqsDUtP3lAMPeHoEyvBmJ18IcvkfxE41_2jVq9l6_66vHn6n2FoZmkq9kJ_jt7Dx3dSCIJKBQKKH82cMCabs96nuem_l5bZjs=w600",
        },
        {
            type: "Offer",
            title: "Rambo - Chyng Dia...",
            collection: "Dogg on it: Death Row Mit...",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/tKTHcdju5yvGIlTv8v658QcJwi1nBwB-iEcYoOLBjkd_P9Iq4jwdYKLMEvr-CZQ7YA0SoDFbJXNM_6bX_eh-2EuPj_8MhVUd6OBIbg=w600",
        },
        {
            type: "Offer",
            title: "Boodle Bear #2563",
            collection: "BoodleBears",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/IY97_-zxk__vD6V29AJHTU92XoiceUwlM2XQ33hdxNCtUc5t7XCaNDQA22eWiFcHmkzyhR8i0tjeh9otTc1herD8NiA8hU7LEGBgmw=w600",
        },
        {
            type: "List",
            title: "SKIN VIAL 🧪 EVO HMN",
            collection: "RTFKT SKIN VIAL: EVO X",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/8HHBFgCuty57T8z0CS9haKn1XHIGsdU-IPGN22zgOqCklz4hpER_40k-nD3BcpCpyoa7xJeOy53EjG3jiWtC5JRqxgXsyMii3Z2pSg=w286",
        },
        {
            type: "Sell",
            title: "Yokai #1851",
            collection: "Akuma Origins",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/7LheK837QOCU2D1t21d1tWdhl4XqrCZl4YyoAeFIX58vxJ1Ae_3YRU_HAfRIeK4JQbRyrm9gmRuLPO6vqfBfzfOhH_LhZ5mFxZc8gbs=w600",
        },
        {
            type: "Offer",
            title: "JiraBibiz #110",
            collection: "JiraBibiz",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/t5RgQ-3WRuXE4FefTEA2YB1nkfQUQRUsbJfcP_Ul_nHTGughqJa9XSMRtPrBmr4jGj3zPzPuL3qo3HrTyqedYzE1SDgzfxk540toKA=w600",
        },
        {
            type: "Sell",
            title: "Golfickers The Du...",
            collection: "Golfickers",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/ITL3Q3mvH-uGd35FyDRahhnH8LrNVQ4GxpzMP2pyhkLokHfdywLeW4I4ONfAtn8OouSvW26nZoHJJu_YtpVh1ZI2vcbAaNlnES9f=w600",
        },
        {
            type: "List",
            title: "Dajo Cat #1319",
            collection: "Dajo Cat",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/YB4_7xMKxhEKtgNJoyvOLSdNWIr6rMEsW-qtJUSOmTPTiotpVMMY1yBCZ8bK9aFFEqo0c0k8TRAJ3OvHo2RhC_Qd2fbCfPHf5fl9nA=w600",
        },
        {
            type: "List",
            title: "mrammou 055",
            collection: "MRAMMOU: Akan Gold...",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/cQx0Z7PSDAHqQ_XsuOlvEwZsfKigp-3STxHMP7a5o5CGH9VHuGfYjUhSMgjKM8f4jEk-3TD9EGB_BWuoauKDD4V_TB54tjw8rV3OKg=w600",
        },
        {
            type: "Sell",
            title: "Beanz #15563",
            collection: "Beanz Official",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/agPcHLvqsDUtP3lAMPeHoEyvBmJ18IcvkfxE41_2jVq9l6_66vHn6n2FoZmkq9kJ_jt7Dx3dSCIJKBQKKH82cMCabs96nuem_l5bZjs=w600",
        },
        {
            type: "Offer",
            title: "Rambo - Chyng Dia...",
            collection: "Dogg on it: Death Row Mit...",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/tKTHcdju5yvGIlTv8v658QcJwi1nBwB-iEcYoOLBjkd_P9Iq4jwdYKLMEvr-CZQ7YA0SoDFbJXNM_6bX_eh-2EuPj_8MhVUd6OBIbg=w600",
        },
        {
            type: "Offer",
            title: "Boodle Bear #2563",
            collection: "BoodleBears",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/IY97_-zxk__vD6V29AJHTU92XoiceUwlM2XQ33hdxNCtUc5t7XCaNDQA22eWiFcHmkzyhR8i0tjeh9otTc1herD8NiA8hU7LEGBgmw=w600",
        },
        {
            type: "List",
            title: "SKIN VIAL 🧪 EVO HMN",
            collection: "RTFKT SKIN VIAL: EVO X",
            quantity: 1,
            price: { e: 0.025, d: 126.17 },
            time: "13 seconds",
            pic:
                "https://lh3.googleusercontent.com/8HHBFgCuty57T8z0CS9haKn1XHIGsdU-IPGN22zgOqCklz4hpER_40k-nD3BcpCpyoa7xJeOy53EjG3jiWtC5JRqxgXsyMii3Z2pSg=w286",
        },
    ];

    return (
        <div className="activity-container">
            <div className="activity-sidebar">
                <div className="activity-sidebar__dropbox">
                    <div className="activity-sidebar__dropbox--title">
                        <span>Collections</span>
                        <FontAwesomeIcon
                            style={{ fontSize: "16px", color: "#fff" }}
                            icon={faIcons.faChevronDown}
                        />
                    </div>
                    <div className="activity-sidebar__dropbox--content">
                        <input
                            type="text"
                            placeholder="Filter"
                            style={{
                                backgroundImage:
                                    "url(/img/search-field-icon.png)",
                            }}
                        />
                        <div className="activity-sidebar__dropbox--content_collectionsBox">
                            <div>
                                <img src="https://storage.googleapis.com/youbei.io/images/ENFT-e7b4b7.profile" />
                                <span>Regal Eagles</span>
                            </div>

                            <div>
                                <img src="https://www.artnews.com/wp-content/uploads/2022/01/unnamed-2.png?w=631" />
                                <span>Ape Club</span>
                            </div>

                            <div>
                                <img src="https://media.voguebusiness.com/photos/6234c69b0850500ee9a76f89/master/pass/colette-nft-voguebus-colette-x-dour-darcels-mar-22-story.jpg" />
                                <span>Downers</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="activity-sidebar__dropbox">
                    <div className="activity-sidebar__dropbox--title">
                        <span>Event Type</span>
                        <FontAwesomeIcon
                            style={{ fontSize: "16px", color: "#fff" }}
                            icon={faIcons.faChevronDown}
                        />
                    </div>
                    <div className="activity-sidebar__dropbox--content">
                        <div className="activity-sidebar__dropbox--content_selectionBox">
                            <button>Listings</button>
                            <button>Sales</button>
                            <button>Bids</button>
                            <button>Transfers</button>
                        </div>
                    </div>
                </div>

                <span className="activity-sidebar__title">Filters</span>
            </div>
            <div className="activity-main">
                <table className="activity-main__table">
                    <div className="activity-main__table--head">
                        <span>&nbsp;</span>
                        <span>Item</span>
                        <span>Price</span>
                        <span>Quantity</span>
                        <span>From</span>
                        <span>To</span>
                        <span>Time</span>
                    </div>

                    <div className="activity-main__table--body">
                        {mockData.map((item) => (
                            <div className="activity-main__table--body-log">
                                <div className="activity-main__table--body-log_label">
                                    <img
                                        src={
                                            item.type == "Sell"
                                                ? dollarSign
                                                : item.type == "Offer"
                                                ? zapSign
                                                : tagSign
                                        }
                                    />
                                    <span>{item.type}</span>
                                </div>
                                <div className="activity-main__table--body-log_item">
                                    <img src={item.pic} />
                                    <div>
                                        <span>{item.title}</span>
                                        <span>{item.collection}</span>
                                    </div>
                                </div>
                                <div className="activity-main__table--body-log_price">
                                    <div>
                                        <img src={egldIcon} />
                                        {item.price.e}
                                    </div>
                                    {item.price.d}
                                </div>
                                <span className="activity-main__table--body-log_quantity">
                                    {item.quantity}
                                </span>
                                <span className="activity-main__table--body-log_from">
                                    erd1...0z2
                                </span>
                                <span className="activity-main__table--body-log_to">
                                    erd1...0z2
                                </span>
                                <span className="activity-main__table--body-log_time">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </table>
            </div>
        </div>
    );
};

export default ActivityPage;
