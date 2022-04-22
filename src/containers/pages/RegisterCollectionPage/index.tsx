
import Select from 'react-select'
import { useState } from "react";
import * as DappCore from "@elrondnetwork/dapp-core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as faIcons from '@fortawesome/free-solid-svg-icons';

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { handleCopyToClipboard, hexToAscii, asciiToHex } from "utils";
import { useGetCollectionByIdMutation, useCreateCollectionMutation } from "services/collections";
import { toast } from 'react-toastify';
import { BrowserRouter, Link } from 'react-router-dom';

import { Footer } from 'components/index';

export const RegisterCollectionPage: (props: any) => any = ({ }) => {

    /*
    const {
        address: userWalletAddress,
    } = Dapp.useContext();
    */

    const [userWalletAddress, setUserWalletAddress] = useState<string>('');
    DappCore.getAddress().then(address => setUserWalletAddress(address));

    const [flagSelect, setFlagSelect] = useState<any>({ value: 'art', label: 'Art' });

    const [createCollectionTrigger,] = useCreateCollectionMutation
    ();

    const [getCollectionByIdTrigger] = useGetCollectionByIdMutation();

    const [isButtonClicked, setIsButtonClicked] = useState(false)
    const [routeTokenID, setRouteTokenID] = useState("")    

    const schemaStep1 = yup.object({
        tokenId: yup.string().max(17, "Must be between 17 or less AlphaNumeric Characters").required("Required Field"),
        collectionName: yup.string().min(3, "Min of 3 and Max of 20 Characters").max(20,"Min of 3 and Max of 20 Characters").required("Required Field"),
        description: yup.string().max(1000, "Max of 1000 Characters"),
        discordLink: yup.string(),
        instagramLink: yup.string(),
        telegramLink: yup.string(),
        twitterLink: yup.string(),
        website: yup.string(),
    }).required();

    const { register: registerStep1, handleSubmit: handleSubmitStep1, formState: { errors: errorsStep1 } } = useForm({
        resolver: yupResolver(schemaStep1),
    });

    const onSubmitStep1 = async (data: any) => {

        if( ! isButtonClicked )
        {
            //setIsButtonClicked(true)

            setRouteTokenID(data.tokenId);


            //contract address - doesn't exist?
            data.ContractAddress = ""

            data.mintPricePerTokenString = "0"
            data.tokenBaseURI = ""
            data.MetaDataBaseURI = ""
            data.MaxSupply = 0


            setRouteTokenID(data.tokenId);
            
            console.log(data.tokenId)

            //data.tokenId = asciiToHex(data.tokenId);



            const formattedData = {
                ...data,
                tokenId:data.tokenId,
                userAddress: userWalletAddress,
                flags: [flagSelect.value],
            }
    
    
        
    
            const response: any = await createCollectionTrigger({ payload: formattedData });
    
            if (response.error) {
    
                toast.error(`${response.error.data.error}`, {
                    autoClose: 5000,
                    draggable: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    hideProgressBar: false,
                    position: "bottom-right",
                });
    
                return;
            }
            else
            {
                HideElement("btnSubmit");
                ShowElement("linkContinueToDetails");
                ShowElement("linkLearnVerifyCollection");
            }
            

            

            toast.success(`Succesful register`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });



        }
        

    };


    const options = [

        { value: 'art', label: 'Art' },
        { value: 'metaverse', label: 'Metaverse' },
        { value: 'trading-cards', label: 'Trading Cards' },
        { value: 'collectibles', label: 'Collectibles' },
        { value: 'sports', label: 'Sports' },
        { value: 'Utility', label: 'Utility' },

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

    function HideElement(elementID: string)
    {
        var element = document.getElementById(elementID) as HTMLInputElement;
        element.hidden = true;
    }
    
    function ShowElement(elementID: string)
    {
        var element = document.getElementById(elementID) as HTMLInputElement;
        element.hidden = false;
    }


    function ShowLearnToVerifyAlert()
    {
        alert('Want to Verify this Collection? Simply click on the "Learn How to Verify Collections" button')
    }

    return (

        <div className="p-collection-register-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-4 md:m-20">

                    <div className="mb-10">
                        <Link to={`/account`}> {`< Back to account`}</Link>
                    </div>

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-8">
                        Register Collection
                    </h2>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">

                            <form className="mb-10" onSubmit={handleSubmitStep1(onSubmitStep1)}>

                                <hr className="text-white my-10" />
                                
                                <p className="text-lg mb-2 text-gray-400">
                                    <b>Instruction:</b> Register the collection with Youbei - enabling users to search, mint, list, buy, and sell your NFTs.
                                </p> 

                                <hr className="text-white my-10" />


                                <p className="text-xl u-text-bold mb-2">
                                    Token ID: &nbsp;
                                    <a href="javascript:alert('Token ID is an identifier used on the blockchain and identifies your collection.  It is the TickerName (all caps) follow with dash (-) and a unique id.  Must be 17 characters or less.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>                                    

                                <p className="mb-2 text-lg text-red-500">{errorsStep1.tokenId?.message}</p>

                                <input  {...registerStep1('tokenId')} autoComplete="off" placeholder="Token ID" maxLength={17} type="text" className="bg-opacity-10 bg-white border-1 border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" />

        

                                <p className="text-xl u-text-bold mb-2">
                                    Collection Name: &nbsp;
                                    <a href="javascript:alert('The Collection Name to be displayed on the Youbei NFT Marketplace.  Must be unique, allowed to have spaces, and must be not longer than 20 characters.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>


                                <p className="mb-2 text-lg text-red-500">{errorsStep1.collectionName?.message}</p>

                                <input  {...registerStep1('collectionName')} autoComplete="off" placeholder="Collection name" maxLength={20} type="text" className="bg-opacity-10 bg-white border-1 border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" />



                                <p className="text-xl u-text-bold mb-2">
                                    Description: &nbsp;
                                    <a href="javascript:alert('The desription for the collection to be inform users of the details.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>                                    
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep1.description?.message}</p>
                                
                                <textarea {...registerStep1('description')} autoComplete="off" maxLength={1000}   placeholder="Tell us about your collection!" className="bg-opacity-10 bg-white border-1 border-gray-500 p-2 placeholder-opacity-10 rounded-2 text-white w-full mb-10" />


                                <p className="text-xl u-text-bold mb-2">
                                    Category: &nbsp;
                                     <a href="javascript:alert('The Category that this NFT collection would fit in.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>
                                
                                    <div className="mb-10">


                                    <Select onChange={(value) => { setFlagSelect(value) }} options={options} isSearchable={false} defaultValue={flagSelect} styles={customStyles} />
                               
                                    </div> 

                                <p className="text-xl u-text-bold mb-2">
                                    Links: &nbsp;
                                    <a href="javascript:alert('Links to more web and social media outlets.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>

                                <div className="border-1 border-gray-500  rounded-2 overflow-hidden  mb-8">

                                    <label className="flex align-items-center bg-opacity-10 hover:bg-opacity-20 bg-white p-3">
                                        <input {...registerStep1('website')} autoComplete="off" placeholder="http://www.yoursite.io" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://discord.gg/</span>
                                        <input {...registerStep1('discordLink')} autoComplete="off" placeholder="YourDiscordHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://twitter.com/</span>
                                        <input {...registerStep1('twitterLink')} autoComplete="off" placeholder="YourTwitterHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://instagram.com/</span>
                                        <input {...registerStep1('instagramLink')} autoComplete="off" placeholder="YourInstagramHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://t.me/</span>
                                        <input {...registerStep1('telegramLink')} autoComplete="off" placeholder="abcdef" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                </div>

                                <br/>


                                <button className="c-button c-button--primary" type="submit" id="btnSubmit">Register</button>


                                <Link to={`/collection/${routeTokenID}`} id="linkContinueToDetails" hidden={true} className="c-button c-button--primary" >                        
                                    <div className="inline-flex">
                                        <span>
                                            Continue to Details
                                        </span>
                                    </div>
                                </Link>

                                <br/> <br/>
                                <a href={'https://www.notion.so/enftdao/Verification-e874591432eb4e0388df94470a3854a9'} hidden={true} className="c-button c-button--secondary u-margin-bottom-spacing-4 u-margin-right-spacing-4" target="_blank" id="linkLearnVerifyCollection">Learn How to Verify Collections</a>                                 


                            </form>


                        </div>

                    </div>


                    <br/>

           
                </div>


            </div>

        </div>
    );
};

export default RegisterCollectionPage;


