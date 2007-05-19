import Select from 'react-select'
import { toast } from 'react-toastify';
import { useLocation, Link, useParams, } from "react-router-dom";
import { UrlParameters } from "./interfaces";

import * as Dapp from "@elrondnetwork/dapp";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrands from '@fortawesome/free-brands-svg-icons';


import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


import { prepareTransaction } from "utils/transactions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse } from "components";
import Collapsible from 'react-collapsible';
import { useEffect, useState } from 'react';
import { useGetChangeOwnerCollectionTemplateMutation, useGetMintTokensTemplateMutation } from 'services/tx-template';
import { useGetCollectionByIdMutation, useGetCollectionTokensMutation } from 'services/collections';
import { shorterAddress } from 'utils';


export const CollectionPage: (props: any) => any = ({ }) => {

    const {
        loggedIn,
        address: userWalletAddress, } = Dapp.useContext();


    const { pathname } = useLocation();
    const sendTransaction = Dapp.useSendTransaction();

    const { collectionId } = useParams<UrlParameters>();

    const [getMintTokensTemplateTrigger, {

    }] = useGetMintTokensTemplateMutation();

    const [getCollectionTokensTrigger, {
        data: collectionTokensData
    }] = useGetCollectionTokensMutation();


    const [getCollectionByIdTrigger, {
        data: collectionData,
        isError: isErrorGetCollectionData,
        isSuccess: isSuccessGetCollectionData,
    }] = useGetCollectionByIdMutation();



    const [requestedNumberOfTokens, setRequestedNumberOfTokens] = useState<number>(1);


    const mockedTokens = [
        {
            id: 40,
            tokenId: "CHIBI-81192c",
            nonce: 9,
            priceString: "0429d069189e0000",
            priceNominal: 0.3,
            royaltiesPercent: 7,
            metadataLink: "https://gateway.pinata.cloud/ipfs/QmPxQivTP7tncEkyrB7yLG7XmQXXsj8H9GfZ7vdH69eJ8k/9",
            createdAt: 1636849692,
            state: "List",
            attributes: {
                Fur: "Eyes",
                Back: "X",
                Ears: "Gold Studs",
                Head: "Biker Helmet",
                Hands: "Hook",
                Shoes: "Rapper",
                Outfit: "Rapper",
                Background: "Yellow"
            },
            tokenName: "Chibi Ape #9",
            imageLink: "https://gateway.pinata.cloud/ipfs/Qme8YxMe3w34r9iqU8QJ6L7Sa4ehnt8qU8VcrNHdZGAiSJ/9.png",
            hash: "",
            lastBuyPriceNominal: 0,
            auctionStartTime: 0,
            auctionDeadline: 0,
            ownerId: 11,
            collectionId: 5
        },
        {
            id: 32,
            tokenId: "CHIBI-81192c",
            nonce: 1,
            priceString: "016345785d8a0000",
            priceNominal: 0.1,
            royaltiesPercent: 7,
            metadataLink: "https://gateway.pinata.cloud/ipfs/QmPxQivTP7tncEkyrB7yLG7XmQXXsj8H9GfZ7vdH69eJ8k/1",
            createdAt: 1636849536,
            state: "List",
            attributes: {
                Fur: "Abstract",
                Back: "Wings",
                Ears: "Double Gold Hoops",
                Head: "Biker Helmet",
                Hands: "Punk Half Gloves",
                Shoes: "Rapper",
                Outfit: "Punk",
                Background: "Purple"
            },
            tokenName: "Chibi Ape #1",
            imageLink: "https://gateway.pinata.cloud/ipfs/Qme8YxMe3w34r9iqU8QJ6L7Sa4ehnt8qU8VcrNHdZGAiSJ/1.png",
            hash: "",
            lastBuyPriceNominal: 0,
            auctionStartTime: 0,
            auctionDeadline: 0,
            ownerId: 11,
            collectionId: 5
        },
        {
            id: 37,
            tokenId: "CHIBI-81192c",
            nonce: 6,
            priceString: "02c68af0bb140000",
            priceNominal: 0.2,
            royaltiesPercent: 7,
            metadataLink: "https://gateway.pinata.cloud/ipfs/QmPxQivTP7tncEkyrB7yLG7XmQXXsj8H9GfZ7vdH69eJ8k/6",
            createdAt: 1636849632,
            state: "List",
            attributes: null,
            tokenName: "Chibi Ape #6",
            imageLink: "https://gateway.pinata.cloud/ipfs/Qme8YxMe3w34r9iqU8QJ6L7Sa4ehnt8qU8VcrNHdZGAiSJ/6.png",
            hash: "",
            lastBuyPriceNominal: 0,
            auctionStartTime: 0,
            auctionDeadline: 0,
            ownerId: 11,
            collectionId: 5
        },
        {
            id: 33,
            tokenId: "CHIBI-81192c",
            nonce: 2,
            priceString: "016345785d8a0000",
            priceNominal: 0.1,
            royaltiesPercent: 7,
            metadataLink: "https://gateway.pinata.cloud/ipfs/QmPxQivTP7tncEkyrB7yLG7XmQXXsj8H9GfZ7vdH69eJ8k/2",
            createdAt: 1636849560,
            state: "List",
            attributes: {
                Fur: "Trippy",
                Back: "Swords",
                Ears: "Double Silver Hoops",
                Face: "VR",
                Head: "Mohawk Gold",
                Hands: "Punk Half Gloves",
                Shoes: "Gold Hipster",
                Outfit: "Hero",
                Background: "Punk Blue"
            },
            tokenName: "Chibi Ape #2",
            imageLink: "https://gateway.pinata.cloud/ipfs/Qme8YxMe3w34r9iqU8QJ6L7Sa4ehnt8qU8VcrNHdZGAiSJ/2.png",
            hash: "",
            lastBuyPriceNominal: 0,
            auctionStartTime: 0,
            auctionDeadline: 0,
            ownerId: 11,
            collectionId: 5
        },
        {
            id: 35,
            tokenId: "CHIBI-81192c",
            nonce: 4,
            priceString: "016345785d8a0000",
            priceNominal: 0.1,
            royaltiesPercent: 7,
            metadataLink: "https://gateway.pinata.cloud/ipfs/QmPxQivTP7tncEkyrB7yLG7XmQXXsj8H9GfZ7vdH69eJ8k/4",
            createdAt: 1636849596,
            state: "List",
            attributes: {
                Fur: "Brown",
                Back: "3RX",
                Face: "3D",
                Head: "Biker Helmet",
                Hands: "Medical Gloves",
                Shoes: "Cowboy",
                Outfit: "Cowboy",
                Background: "Punk Blue"
            },
            tokenName: "Chibi Ape #4",
            imageLink: "https://gateway.pinata.cloud/ipfs/Qme8YxMe3w34r9iqU8QJ6L7Sa4ehnt8qU8VcrNHdZGAiSJ/4.png",
            hash: "",
            lastBuyPriceNominal: 0,
            auctionStartTime: 0,
            auctionDeadline: 0,
            ownerId: 11,
            collectionId: 5
        },
        {
            id: 36,
            tokenId: "CHIBI-81192c",
            nonce: 5,
            priceString: "02c68af0bb140000",
            priceNominal: 0.2,
            royaltiesPercent: 7,
            metadataLink: "https://gateway.pinata.cloud/ipfs/QmPxQivTP7tncEkyrB7yLG7XmQXXsj8H9GfZ7vdH69eJ8k/5",
            createdAt: 1636849614,
            state: "List",
            attributes: {
                Fur: "Pink",
                Back: "Swords",
                Face: "Sleep Mask",
                Head: "Biker Helmet",
                Shoes: "Punk",
                Outfit: "Punk",
                Background: "White"
            },
            tokenName: "Chibi Ape #5",
            imageLink: "https://gateway.pinata.cloud/ipfs/Qme8YxMe3w34r9iqU8QJ6L7Sa4ehnt8qU8VcrNHdZGAiSJ/5.png",
            hash: "",
            lastBuyPriceNominal: 0,
            auctionStartTime: 0,
            auctionDeadline: 0,
            ownerId: 11,
            collectionId: 5
        },
        {
            id: 39,
            tokenId: "CHIBI-81192c",
            nonce: 8,
            priceString: "0429d069189e0000",
            priceNominal: 0.3,
            royaltiesPercent: 7,
            metadataLink: "https://gateway.pinata.cloud/ipfs/QmPxQivTP7tncEkyrB7yLG7XmQXXsj8H9GfZ7vdH69eJ8k/8",
            createdAt: 1636849674,
            state: "List",
            attributes: {
                Fur: "Yellow",
                Ears: "Gold Studs",
                Face: "3D",
                Shoes: "Astronaut",
                Outfit: "Dress",
                Background: "Blue"
            },
            tokenName: "Chibi Ape #8",
            imageLink: "https://gateway.pinata.cloud/ipfs/Qme8YxMe3w34r9iqU8QJ6L7Sa4ehnt8qU8VcrNHdZGAiSJ/8.png",
            hash: "",
            lastBuyPriceNominal: 0,
            auctionStartTime: 0,
            auctionDeadline: 0,
            ownerId: 11,
            collectionId: 5
        },
        {
            id: 34,
            tokenId: "CHIBI-81192c",
            nonce: 3,
            priceString: "016345785d8a0000",
            priceNominal: 0.1,
            royaltiesPercent: 7,
            metadataLink: "https://gateway.pinata.cloud/ipfs/QmPxQivTP7tncEkyrB7yLG7XmQXXsj8H9GfZ7vdH69eJ8k/3",
            createdAt: 1636849578,
            state: "List",
            attributes: {
                Fur: "Gold",
                Back: "Full Blaster 2RX",
                Ears: "Gold Hoops",
                Face: "Cyborg Eye",
                Head: "Blue Headband",
                Hands: "Biker Half Gloves",
                Shoes: "Purple",
                Outfit: "Astronaut",
                Background: "Blue"
            },
            tokenName: "Chibi Ape #3",
            imageLink: "https://gateway.pinata.cloud/ipfs/Qme8YxMe3w34r9iqU8QJ6L7Sa4ehnt8qU8VcrNHdZGAiSJ/3.png",
            hash: "",
            lastBuyPriceNominal: 0,
            auctionStartTime: 0,
            auctionDeadline: 0,
            ownerId: 11,
            collectionId: 5
        },
    ];



    const options = [
        {
            value: {
                criteria: "created_at",
                mode: "desc"
            }, 
            label: 'Oldest'
        },
        {
            value: {
                criteria: "created_at",
                mode: "asc"
            }, 
            label: 'Recently listed'
        },
        {
            value: {
                criteria: "price_nominal",
                mode: "asc"
            }, 
            label: 'Price: Low to High'
        },
        {
            value: {
                criteria: "price_nominal",
                mode: "desc"
            }, 
            label: 'Price: High to Low'
        },
    ];


    const [sort, setSort] = useState<any>(options[0]);

    const [tokens, setTokens] = useState<any>([]);

    const [filterQuery, setFilterQuery] = useState<string>('');

    const { trigger, register: registerFilters, handleSubmit: handleSubmitFilters, formState: { errors: errorsFilters } } = useForm({});


    const triggerFilterAndSort = async () => {

        const sortQuery = `sort[criteria]=${sort.value.criteria}&sort[mode]=${sort.value.mode}`;

        const collectionTokensResponse = await getCollectionTokensTrigger({ collectionId, offset: tokens.length, limit: 8, filterAndSortQuery: `${filterQuery}&${sortQuery}` });

        console.log({
            collectionTokensData
        });

        // if (collectionTokensData?.data) {
            // setTokens([...tokens, ...collectionTokensResponse.data]);
        // }

        setTokens(mockedTokens);

    }


    const onSubmitFilters = (data: any) => {


        let filterQuery = ``;

        const filtersCategories: Array<string> = Object.keys(data.filter);

        console.log({
            filtersCategories
        });

        filtersCategories.forEach((filterCategory: string) => {

            const categoryValues: Array<string> = Object.keys(data.filter[filterCategory]);

            categoryValues.forEach((value: string) => {


                if (data.filter[filterCategory][value] === true) {

                    filterQuery = filterQuery + `filters[${filterCategory}]=${value}&`;

                }

            })

        });

        setFilterQuery(filterQuery);

        setTokens([]);

        triggerFilterAndSort();

    };


    const description = collectionData?.data?.collection?.description;
    const discordLink = collectionData?.data?.collection?.discordLink;
    const twitterLink = collectionData?.data?.collection?.twitterLink;
    const telegramLink = collectionData?.data?.collection?.telegramLink;
    const instagramLink = collectionData?.data?.collection?.instagramLink;
    const websiteLink = collectionData?.data?.collection?.website;

    const attributes = collectionData?.data?.statistics?.attributes;

    const floorPrice = collectionData?.data?.statistics?.floorPrice;
    const itemsTotal = collectionData?.data?.statistics?.itemsTotal;
    const ownersTotal = collectionData?.data?.statistics?.ownersTotal;
    const volumeTraded = collectionData?.data?.statistics?.volumeTraded;

    const creatorName = collectionData?.data?.creatorName;
    const collectionName = collectionData?.data?.collection?.name;
    const collectionTokenId = collectionData?.data?.collection?.tokenId;
    const creatorWalletAddress = collectionData?.data?.creatorWalletAddress;

    const isCollectionOwner = userWalletAddress === creatorWalletAddress;


    const mapFilters = () => {

        const mappedAttributes: any = {}

        attributes?.forEach((attribute: any) => {


            const { trait_type, value, total, } = attribute;


            if (!mappedAttributes[trait_type]) {

                mappedAttributes[trait_type] = {};

            }

            if (mappedAttributes[trait_type][value] === undefined) {

                mappedAttributes[trait_type][value] = 0;

            }

            if (mappedAttributes[trait_type][value] === 0) {

                mappedAttributes[trait_type][value] = total;

            } else {

                mappedAttributes[trait_type][value] = mappedAttributes[trait_type][value] + total;

            }

        });

        const attributesKeys = Object.keys(mappedAttributes);




        const mappedFilters = attributesKeys.map((attributeKey) => {

            let totalKeyValues = 0;

            const traitsValuesKeys = Object.keys(mappedAttributes[attributeKey]);

            traitsValuesKeys.forEach((traitValue: any) => {

                totalKeyValues = totalKeyValues + mappedAttributes[attributeKey][traitValue];

            });



            return (
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
                                    {attributeKey}
                                </span>
                            </div>
                            <div className="text-sm text-gray-400">
                                {totalKeyValues}
                            </div>
                        </div>

                    }>

                    <div className="c-accordion_content" >

                        {traitsValuesKeys.map((traitValue: string) => {

                            return (
                                <div className="flex justify-between u-text-small my-3">
                                    <label>
                                        <input {...registerFilters(`filter.${attributeKey}.${traitValue}`, {
                                            onChange: (e) => { handleSubmitFilters(onSubmitFilters)() }
                                        })}
                                            type="checkbox" className="mr-2" />
                                        <span className="u-text-theme-gray-light">
                                            {traitValue}
                                        </span>
                                    </label>

                                    <span className="">
                                        {mappedAttributes[attributeKey][traitValue]}
                                    </span>

                                </div>
                            )
                        })}

                    </div>


                </Collapsible>
            )
        });



        return (
            <form onSubmit={handleSubmitFilters(onSubmitFilters)}>
                {mappedFilters}
            </form>
        )

    };

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            // color: state.isSelected ? 'red' : 'blue',
            backgroundColor: '#353840',
            color: 'white',
            padding: 20,
            onOptionHover: {
                backgroundColor: 'red',
            },
            width: "100%"
        }),
        control: (provided: any) => ({
            // none of react-select's styles are passed to <Control />
            // width: 200,
            ...provided,
            backgroundColor: '#353840',
            borderColor: "#353840",
            onOptionHover: {
                borderColor: "red",
            },
            width: "100%",
            color: "white"
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
        },
        input: (provided: any, state: any) => {


            return {
                ...provided,
                color: "white",
            }
        },
        menuList: (provided: any, state: any) => {


            return {
                ...provided,
                padding: 0,
                margin: 0,
            }
        },
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

    };


    const handleChangeSelectValue = (value: any) => {
        
        setTokens([]);

        setSort(value);

        triggerFilterAndSort();

    }


    const getInitialTokens = async () => {

        const response: any = await getCollectionTokensTrigger({ collectionId, offset: 0, limit: 25 });

        // if (response?.error) {

        //     toast.error(`Error getting initial tokens`, {
        //         autoClose: 5000,
        //         draggable: true,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         hideProgressBar: false,
        //         position: "bottom-right",
        //     });
        //     return;

        // }

        setTokens(mockedTokens);

    }


    useEffect(() => {

        getCollectionByIdTrigger({ collectionId: collectionId });

        getInitialTokens();


    }, []);


    if (isErrorGetCollectionData) {

        return (<p className="my-10 text-2xl text-center">Collection ({collectionId}) not found</p>);


    }

    if (!isSuccessGetCollectionData && !collectionData) {
        return (<p className="my-10 text-2xl text-center">Loading...</p>);
    }


    return (

        <div className="p-profile-page">

            <div className="grid grid-cols-12">



                <div className="col-span-12">
                    <div style={{ backgroundImage: `url(${collectionData?.data?.collection?.coverImageLink})` }} className="bg-gray-800 w-full h-60 bg-cover">

                    </div>
                </div>


                <div className="col-span-12 flex justify-center mb-10 pb-16 relative">
                    <div style={{ backgroundImage: `url(${collectionData?.data?.collection?.profileImageLink})` }} className="-bottom-1/4 absolute bg-yellow-700 border border-black h-40 rounded-circle w-40 bg-cover">

                    </div>
                </div>


                <div className="col-span-12 text-center mb-10">

                    {isCollectionOwner &&
                        <div className="c-icon-band mb-6">

                            <div className="c-icon-band_item">

                                <Link className="inline-block" to={`/collection/${collectionId}/edit`}>
                                    <FontAwesomeIcon className="text-white" style={{ width: 25, height: 25, margin: "10px 15px" }} icon={faIcons.faPen} />
                                </Link>

                            </div>
                        </div>
                    }

                    <h2 className="flex justify-content-center mb-2 text-5xl u-text-bold">
                        {collectionName || collectionTokenId}  <FontAwesomeIcon width={'20px'} className="text-lg u-text-theme-blue-place" icon={faIcons.faCheckCircle} />
                    </h2>

                    <p className="text-gray-500 text-xl2 mb-6">
                        Created by   <Link to={`/profile/${creatorWalletAddress}`}> {creatorName || shorterAddress(creatorWalletAddress || '', 4, 4)}</Link>
                    </p>


                    <ul className="c-icon-band c-icon-band--collection mb-10">

                        <li className="c-icon-band_item">

                            <div className="text-3xl u-text-bold">
                                {itemsTotal}
                            </div>

                            <div className="">
                                items
                            </div>

                        </li>

                        <li className="c-icon-band_item">

                            <div className="text-3xl u-text-bold">
                                {ownersTotal}
                            </div>

                            <div className="">
                                owner
                            </div>

                        </li>

                        <li className="c-icon-band_item">

                            <div className="text-3xl u-text-bold">
                                {floorPrice || '---'}
                            </div>
                            <div className="">
                                floor price
                            </div>

                        </li>

                        <li className="c-icon-band_item" style={{ width: 144, height: 88 }}>

                            <div className="text-3xl u-text-bold">
                                {volumeTraded || '---'}
                            </div>
                            <div className="text-sm">
                                volume traded
                            </div>

                        </li>

                    </ul>

                    {/* <div className="grid grid-cols-9 mb-4">
                        <div className="col-start-5 col-span-1">
                            <input min={1} onChange={(e: any) => { setRequestedNumberOfTokens(e.target.value); }} value={requestedNumberOfTokens} type="number" className="text-center text-4xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                        </div>
                    </div>

                    <button onClick={handleMintTokens} className="c-button c-button--primary mb-5" >
                        Mint now
                    </button> */}


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
                                                    <a href={`https://twitter.com/${twitterLink}`} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faTwitter} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                discordLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={`https://discord.gg/${discordLink}`} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faDiscord} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                telegramLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={`https://t.me/${telegramLink}`} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faTelegram} />
                                                    </a>
                                                </li>
                                            }

                                            {
                                                instagramLink &&
                                                <li className="c-icon-band_item">
                                                    <a href={`https://instagram.com/${instagramLink}`} target="_blank" className="c-icon-band_link">
                                                        <FontAwesomeIcon width={'20px'} className="c-icon-band_icon" icon={faBrands.faInstagram} />
                                                    </a>
                                                </li>
                                            }

                                        </ul>

                                    </div>
                                    <div className="text-gray-400">{description}</div>
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
                            Filters
                        </span>
                    </div>

                    {
                        Boolean(attributes?.length) && mapFilters()
                    }
                </div>

                <div className="col-span-9">
                    <div className="grid grid-cols-12">
                        <div className="col-start-10 col-span-3 mx-4">

                            <Select onChange={handleChangeSelectValue} options={options} isSearchable={false} defaultValue={options[0]} styles={customStyles} />

                        </div>

                        <div className="col-span-12 mx-4">
                            <p className="text-gray-300 text-sm mb-8">
                                {tokens?.length} results
                            </p>
                        </div>

                        <div className="col-span-12 mx-3">

                            <div className="grid grid-cols-12">


                                {
                                    !Boolean(tokens.length) && <div className="col-span-12 my-3 mx-2"> <p className="my-10 text-2xl text-center">Loading...</p> </div>
                                }

                                {
                                    tokens.map((token: any) => {

                                        console.log(token);

                                        return (
                                            (
                                                <div className="col-span-3 my-3 mx-2">

                                                    <Link to={`/token/${collectionId}/${token.nonce}`}>

                                                        <div className={`c-card c-card--colection`}>

                                                            <div className="c-card_img-container">
                                                                <img src={token.imageLink} className="c-card_img" alt="" />
                                                            </div>

                                                            <div className="c-card_info">

                                                                <div className="c-card_token-details">
                                                                    <p className="text-gray-700 text-xs">
                                                                        <Link className="text-gray-500 hover:text-gray-200" to={`/collection/${collectionId}`}>
                                                                            {collectionName || collectionId}
                                                                        </Link>
                                                                    </p>
                                                                    <p className="text-sm u-text-bold">
                                                                        {token.tokenName}
                                                                    </p>
                                                                </div>

                                                                <div className="c-card_price">
                                                                    <p className="text-sm">
                                                                        {token?.priceNominal}
                                                                    </p>
                                                                    <p className="text-xs">
                                                                        <span className="text-gray-500">Last</span> {token?.lastBuyPriceNominal} EGLD
                                                                    </p>
                                                                </div>


                                                            </div>

                                                        </div>

                                                    </Link>

                                                </div>
                                            )
                                        )
                                    })
                                }

                            </div>

                            <div className="text-center my-10">

                                <button onClick={triggerFilterAndSort} className="c-button c-button--secondary" >
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
