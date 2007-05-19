import Select from 'react-select'
import { toast } from 'react-toastify';
import { useLocation, Link, useParams, } from "react-router-dom";
import { UrlParameters } from "./interfaces";

import * as Dapp from "@elrondnetwork/dapp";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrands from '@fortawesome/free-brands-svg-icons';

import { prepareTransaction } from "utils/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse } from "components";
import Collapsible from 'react-collapsible';
import { useEffect, useState } from 'react';
import { useGetChangeOwnerCollectionTemplateMutation, useGetMintTokensTemplateMutation } from 'services/tx-template';

export const CollectionPage: (props: any) => any = ({ }) => {

    const {
        loggedIn,
        address: userWalletAddress, } = Dapp.useContext();


    const { pathname } = useLocation();
    const sendTransaction = Dapp.useSendTransaction();

    const { collectionId } = useParams<UrlParameters>();
    const [getMintTokensTemplateTrigger] = useGetMintTokensTemplateMutation();
    const [requestedNumberOfTokens, setRequestedNumberOfTokens] = useState<number>(1);

    const handleChangeRequestedAmount = (e: any) => {

        setRequestedNumberOfTokens(e.target.value);

    };

    const { websiteLink,
        twitterLink,
        discordLink,
        telegramLink,
        instagramLink, } = {
        websiteLink: "1",
        twitterLink: "1",
        discordLink: "1",
        telegramLink: "1",
        instagramLink: "1",
    }

    const options = [
        { value: 'oldest', label: 'Oldest' },
        { value: 'recentlyListed', label: 'Recently listed' },
        { value: 'hightToLow', label: 'Price: Low to High' },
        { value: 'lowToHight', label: 'Price: High to Low' },
    ];


    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            // color: state.isSelected ? 'red' : 'blue',
            backgroundColor: '#353840',
            color: 'white',
            padding: 20,
            onOptionHover: {
                backgroundColor: 'red',
            }
        }),
        control: (provided: any) => ({
            // none of react-select's styles are passed to <Control />
            // width: 200,
            ...provided,
            backgroundColor: '#353840',
            borderColor: "#353840",
            onOptionHover: {
                borderColor: "red",
            }
        }),
        indicatorSeparator: (provided: any, state: any) => {
            //hide
            return {}
        },
        singleValue: (provided: any, state: any) => {
            // const opacity = state.isDisabled ? 0.5 : 1;
            // const transition = 'opacity 300ms';

            // return { ...provided, opacity, transition };

            // return provided;
            return {
                ...provided,
                color: "white",
                padding: 10,
                backgroundColor: '#353840',
            }
        }
    }


    const handleMintTokens = async () => {

        const getBuyNFTResponse: any = await getMintTokensTemplateTrigger({ userWalletAddress, collectionId, numberOfTokens: requestedNumberOfTokens });

        if (getBuyNFTResponse.error) {

            const { status, data: { error } } = getBuyNFTResponse.error;

            toast.error(`${status} | ${error}`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;

        }

        const { data: txData } = getBuyNFTResponse.data;

        const unconsumedTransaction = prepareTransaction(txData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: pathname
        });

    }

    return (

        <div className="p-profile-page">

            <div className="grid grid-cols-12">



                <div className="col-span-12">
                    <div className="bg-gray-800 w-full h-60">

                    </div>
                </div>


                <div className="col-span-12 flex justify-center mb-10 pb-16 relative">
                    <div className="-bottom-1/4 absolute bg-gray-900  h-40 rounded-circle w-40">

                    </div>
                </div>


                <div className="col-span-12 text-center mb-10">

                    <div className="c-icon-band mb-6">

                        <div className="c-icon-band_item">

                            <Link className="inline-block" to={`/collection/${collectionId}/edit`}>
                                <FontAwesomeIcon className="text-white" style={{ width: 25, height: 25, margin: "10px 15px" }} icon={faIcons.faPen} />
                            </Link>

                        </div>
                    </div>

                    <h2 className="text-5xl u-text-bold mb-2">
                        Unnamed collection
                    </h2>

                    <p className="text-gray-500 text-xl2 mb-6">
                        Created by   <Link to={`./`}>MekaVerse</Link>
                    </p>


                    <ul className="c-icon-band c-icon-band--collection mb-10">

                        <li className="c-icon-band_item">

                            <div className="text-3xl u-text-bold">
                                42
                            </div>

                            <div className="">
                                items
                            </div>

                        </li>

                        <li className="c-icon-band_item">

                            <div className="text-3xl u-text-bold">
                                1
                            </div>

                            <div className="">
                                owner
                            </div>

                        </li>

                        <li className="c-icon-band_item">

                            <div className="text-3xl u-text-bold">
                                ---
                            </div>
                            <div className="">
                                floor price
                            </div>

                        </li>

                        <li className="c-icon-band_item" style={{ width: 144, height: 88 }}>

                            <div className="text-3xl u-text-bold">
                                0.00
                            </div>
                            <div className="text-sm">
                                volume traded
                            </div>

                        </li>

                    </ul>

                    <div className="grid grid-cols-9 mb-4">
                        <div className="col-start-5 col-span-1">
                            <input min={1} onChange={handleChangeRequestedAmount} value={requestedNumberOfTokens} type="number" className="text-center text-4xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                        </div>
                    </div>

                    <button onClick={handleMintTokens} className="c-button c-button--primary mb-5" >
                        Mint now
                    </button>


                    <div className="grid grid-cols-3">
                        <div className="col-start-2 col-span-1">
                            <Collapse>

                                <div>
                                    <div className="mb-6">

                                        <ul className="c-icon-band text-gray-500">
                                            {
                                                websiteLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={websiteLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faIcons.faGlobe} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                twitterLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={twitterLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faTwitter} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                discordLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={discordLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faDiscord} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                telegramLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={telegramLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faTelegram} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                instagramLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={telegramLink} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faInstagram} />
                                                    </a>
                                                </li>
                                            }

                                        </ul>

                                    </div>
                                    <div className="text-gray-400">
                                        Pigselated is a collection of 10101 unique NFT collectibles stored on the Elrond blockchain. Pixels have been part of our lives since the last century and they're not going away. Everybody loves a good pixel and, you can be sure, pigsels.
                                        Pigselated is a collection of 10101 unique NFT collectibles stored on the Elrond blockchain. Pixels have been part of our lives since the last century and they're not going away. Everybody loves a good pixel and, you can be sure, pigsels.
                                        Pigselated is a collection of 10101 unique NFT collectibles stored on the Elrond blockchain. Pixels have been part of our lives since the last century and they're not going away. Everybody loves a good pixel and, you can be sure, pigsels.
                                        Pigselated is a collection of 10101 unique NFT collectibles stored on the Elrond blockchain. Pixels have been part of our lives since the last century and they're not going away. Everybody loves a good pixel and, you can be sure, pigsels.
                                        Pigselated is a collection of 10101 unique NFT collectibles stored on the Elrond blockchain. Pixels have been part of our lives since the last century and they're not going away. Everybody loves a good pixel and, you can be sure, pigsels.
                                    </div>
                                </div>
                            </Collapse>
                        </div>
                    </div>



                </div>


                <div className="col-span-3">

                    <div onClick={() => { }} className="c-accordion_trigger cursor-pointer">
                        <span className="c-accordion_trigger_icon">
                            <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faFilter} />
                        </span>
                        <span className="c-accordion_trigger_title">
                            Filter
                        </span>
                    </div>

                    <Collapsible
                        open={false}
                        disabled={true}
                        transitionTime={50}
                        className="c-accordion"
                        trigger={

                            <div className="c-accordion_trigger justify-between">
                                <div>
                                    <span className="c-accordion_trigger_icon">
                                        <FontAwesomeIcon width={'10px'} icon={faIcons.faList} />
                                    </span>
                                    <span className="c-accordion_trigger_title">
                                        Body
                                    </span>
                                </div>
                                <div className="text-sm text-gray-400">
                                    {40}
                                </div>
                            </div>

                        }>

                        <div className="c-accordion_content" >

                            <div className="flex justify-between u-text-small my-3">

                                <label>
                                    <input type="checkbox" className="mr-2" />
                                    <span className="u-text-theme-gray-light">
                                        {'Green suit'}
                                    </span>
                                </label>

                                <span className="">
                                    {4}
                                </span>

                            </div>

                            <div className="flex justify-between u-text-small my-3">

                                <label>
                                    <input type="checkbox" className="mr-2" />
                                    <span className="u-text-theme-gray-light">
                                        {'Green suit'}
                                    </span>
                                </label>

                                <span className="">
                                    {4}
                                </span>

                            </div>

                            <div className="flex justify-between u-text-small my-3">

                                <label>
                                    <input type="checkbox" className="mr-2" />
                                    <span className="u-text-theme-gray-light">
                                        {'Green suit'}
                                    </span>
                                </label>

                                <span className="">
                                    {4}
                                </span>

                            </div>


                        </div>


                    </Collapsible>

                </div>

                <div className="col-span-9">
                    <div className="grid grid-cols-12">
                        <div className="col-start-10 col-span-3 mx-4">

                            <Select options={options} isSearchable={false} defaultValue={options[0]} styles={customStyles} />

                        </div>

                        <div className="col-span-12 mx-4">
                            <p className="text-gray-300 text-sm mb-8">
                                {42} results
                            </p>
                        </div>

                        <div className="col-span-12 mx-3">

                            <div className="grid grid-cols-12">

                                {
                                    [1, 1, 1, 11, 1, 1, 1, 1, 11, 1, 1, 1, 11, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 11, 1, 1, , 1, 1, 11, 1, 1,].map(() => (
                                        <div className="col-span-3 my-3 mx-2">

                                            <Link to={`/token/`}>

                                                <div className={`c-card c-card--colection`}>

                                                    <div className="c-card_img-container">
                                                        <img src={'http://localhost:3000/img/collections/ergo-esse-natura/the-bird-catchers.jpg'} className="c-card_img" alt="" />
                                                    </div>

                                                    <div className="c-card_info">

                                                        <div className="c-card_token-details">
                                                            <p className="text-gray-700 text-xs">
                                                                <Link className="text-gray-500 hover:text-gray-200" to={`/collection`}>
                                                                    {'MekaVerse'}
                                                                </Link>
                                                            </p>
                                                            <p className="text-sm u-text-bold">
                                                                {'Meka #321'}
                                                            </p>
                                                        </div>

                                                        <div className="c-card_price">
                                                            <p className="text-sm">
                                                                {0.01}
                                                            </p>
                                                            <p className="text-xs">
                                                                <span className="text-gray-500">Last</span> {4}
                                                            </p>
                                                        </div>


                                                    </div>
                                                </div>

                                            </Link>

                                        </div>
                                    ))
                                }

                            </div>

                            <div className="text-center my-10">

                                <button className="c-button c-button--secondary" >
                                    Load more
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default CollectionPage;
