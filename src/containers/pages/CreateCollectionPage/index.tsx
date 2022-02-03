import { Link, useLocation } from 'react-router-dom';
import Select from 'react-select'
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import * as faIcons from '@fortawesome/free-solid-svg-icons';

import { ErrorMessage } from '@hookform/error-message';


import { prepareTransaction } from "utils/transactions";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleCopyToClipboard, hexToAscii, asciiToHex, GetTransactionRequestHttpURL, GetTransactionActionName, GetJSONResultData, GetTransactionTokenID, GetTransactionContractAddress} from "utils";
import { useGetAccountGatewayTokensMutation, useGetAccountTokensMutation, useSetAccountMutation, useSetProfileImageMutation } from "services/accounts";
import { toast } from 'react-toastify';
import { useGetChangeOwnerCollectionTemplateMutation, useGetDeployCollectionTemplateMutation, useGetIssueNftTemplateMutation, useGetSetRolesCollectionTemplateMutation } from 'services/tx-template';

import { useCreateCollectionMutation } from "services/collections";

import { AddressValue, BytesValue, U32Value, ArgSerializer, Address, BytesType, AddressType, } from '@elrondnetwork/erdjs/out';




export const CreateCollectionPage: (props: any) => any = ({ }) => {


    {
    
        const queryString = window.location.search;
        console.log("queryString" + queryString);

        const params = new URLSearchParams(window.location.search)

        const txtHash = params.get("txHash")
        

        if(txtHash != null )
        {
            const httpRequest = new XMLHttpRequest();
            const url= GetTransactionRequestHttpURL(txtHash); 
            httpRequest.open("GET", url);
            httpRequest.send();
            
            
            httpRequest.onreadystatechange = (e) => 
            {
                if (httpRequest.readyState == 4 && httpRequest.status == 200)
                {
                    if( httpRequest.responseText )
                    {                
                        const data = httpRequest.responseText;
                        console.log("data:" + data)

                        const jsonResponse = JSON.parse(data);
                        const actionName = GetTransactionActionName(jsonResponse)

                        console.log("action-name: " + actionName )
                        
                        const resultData = GetJSONResultData(jsonResponse);
                        console.log("result-data: " + resultData)
                        
                        switch(actionName) 
                        {
                            case "issueNonFungible":
                            {
                                HandleIssueNonFungibleAction(resultData);
                                
                                break;
                            } 
                            case "deployNFTTemplateContract":
                            {
                                HandledeployNFTTemplateContractAction(resultData);

                                break;
                            }
                            case "changeOwner":
                            {
                                HandleChangeOwnerAction(resultData);
                                
                                break;
                            }
                            case "setSpecialRole":
                            {
                                HandleSetSpecialRoleAction(resultData);

                                break;
                            }
                            default:
                            {

                            } 
                        }

                        HandlePageStateByActionName(actionName)
                    }
                }                
            }
        }  
        else
        {
            
        }      
    }




    function HandleIssueNonFungibleAction(resultData: string)
    {
        //get the tokenID from the resultData
        const tokenID = GetTransactionTokenID(resultData);

        //set the tokenId
        var inputName = document.getElementById("tokenId") as HTMLInputElement;
        inputName.value = tokenID;
        inputName.readOnly = true;

        //disable the token name 
        //var tokenName = document.getElementById("token_name") as HTMLInputElement;
        //tokenName.disabled = true;

        //disable token ticker
        //var tokenTicker = document.getElementById("token_ticker") as HTMLInputElement;
        //tokenTicker.disabled = true;  
     
        sessionStorage.setItem("tokenId", tokenID);

    }


    function HandledeployNFTTemplateContractAction(resultData: string)
    {
        //get the contractAddress from the resultData
        const contractAddress = GetTransactionContractAddress(resultData);

        //set the contract address
        
        console.log("ERD Address: " + new Address(contractAddress).toString() );


        var inputName = document.getElementById("step3SCAddress") as HTMLInputElement;
        inputName.value = contractAddress;
        //inputName.readOnly = true;
        
        sessionStorage.setItem("contractAddress", contractAddress);

    }


    function HandleChangeOwnerAction(resultData: string)
    {
        
        const contractAddress = sessionStorage.getItem("contractAddress") as string;
        const tokenId = sessionStorage.getItem("tokenId") as string;

         
        console.log("===== contractAddress: " + contractAddress);
        console.log("===== tokenId: " + tokenId);

        var inputSetRoleAddress = document.getElementById("SetRole_Address") as HTMLInputElement;
        inputSetRoleAddress.value = contractAddress;
        //inputSetRoleAddress.readOnly = true;

        var inputSetRoleTokenId = document.getElementById("SetRole_TokenId") as HTMLInputElement;
        inputSetRoleTokenId.value = tokenId;
        //inputSetRoleTokenId.readOnly = true;        
        

    }

    function HandleSetSpecialRoleAction(resultData: string)
    {
        
        const tokenId = sessionStorage.getItem("tokenId") as string;
        
        var inputCollectionTokenId = document.getElementById("collectionTokenId") as HTMLInputElement;

        console.log("tokenId : " + tokenId)
        console.log("inputCollectionTokenId : " + inputCollectionTokenId)

        inputCollectionTokenId.value = tokenId;   
           
    }

    function HandlePageStateByActionName(actionName: string)
    {
        HideElement("divStep1");

        HideElement("divStep2_HRLine");
        HideElement("divStep2");

        HideElement("divStep3_HRLine");
        HideElement("divStep3");

        HideElement("divStep4_HRLine");
        HideElement("divStep4");
        
        
        HideElement("divStep5");

        switch(actionName) 
        {
            case "Init":
            {
                ShowElement("divStep1");

                break;
            } 
            case "issueNonFungible":
            {
                //DisableButton("submit_step1", "Done");

                //ShowElement("divStep2_HRLine");
                ShowElement("divStep2");

                break;
            } 
            case "deployNFTTemplateContract":
            {
                //("submit_step1", "Done");
                //DisableButton("submit_step2", "Done");

                //ShowElement("divStep2_HRLine");
                //ShowElement("divStep2");

                //ShowElement("divStep3_HRLine");
                ShowElement("divStep3");

                break;
            }
            case "changeOwner":
            {
                //DisableButton("submit_step1", "Done");
                //DisableButton("submit_step2", "Done");
                //DisableButton("submit_step3", "Done");

                //ShowElement("divStep2_HRLine");
                //ShowElement("divStep2");

                //ShowElement("divStep3_HRLine");
                //ShowElement("divStep3");

                //ShowElement("divStep4_HRLine");
                ShowElement("divStep4");                

                break;
            }
            case "setSpecialRole":
            {
                ShowElement("divStep5");

                break;
            }

            default:
            {

            } 
        }        
    }




    function DisableButton(buttonName: string, buttonText:string)
    {
        var btn = document.getElementById(buttonName) as HTMLInputElement;

        btn.innerHTML = buttonText;
        btn.className = "c-button c-button--secondary mb-5";
        btn.disabled = true;
        btn.hidden = false;
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
    
    



    const {
        address: userWalletAddress,
    } = Dapp.useContext();


    const [getIssueNftTemplateTrigger] = useGetIssueNftTemplateMutation();
    const [getSetRolesCollectionTemplateTrigger] = useGetSetRolesCollectionTemplateMutation();
    const [getDeployCollectionTemplateTrigger] = useGetDeployCollectionTemplateMutation();
    const [getChangeOwnerCollectionTemplateTrigger] = useGetChangeOwnerCollectionTemplateMutation();



    const { pathname } = useLocation();
    const sendTransaction = Dapp.useSendTransaction();

    const signTemplateTransaction = async (settings: any) => {

        const { getTemplateTrigger, getTemplateData, succesCallbackRoute } = settings;

        const response: any = await getTemplateTrigger({ ...getTemplateData });

        if (response.error) {

            const { error, status, } = response.error;

            toast.error(`${error + ' ' + status}`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;

        }

        const { data: txData } = response.data;

        const unconsumedTransaction = prepareTransaction(txData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: succesCallbackRoute
        });

    };

    // ================================== STEP 1 ==================================

    const schemaStep1 = yup.object({
        name: yup.string().required(),
        ticker: yup.string().required(),
    }).required();

    const { register: registerStep1, handleSubmit: handleSubmitStep1, control: controlStep1, setError: setErrorStep1, clearErrors: clearErrorsStep1, formState: { errors: errorsStep1 } } = useForm({

        // defaultValues: {
        //     name: "",
        //     ticker: ""
        // },

        resolver: yupResolver(schemaStep1),

    });

    const onSubmitStep1 = (data: any) => {

        const { name, ticker } = data;

        const getTemplateData = { userWalletAddress, tokenName: name, tokenTicker: ticker };

        const getTemplateTrigger = getIssueNftTemplateTrigger;

        signTemplateTransaction({ getTemplateTrigger, getTemplateData, succesCallbackRoute: pathname });

    };



       // ================================== STEP 2 ==================================

    const inputsStep2 = [
        // {
        //     title: "user address",
        //     type: "text",
        //     name: "userAddress",
        //     isRequired: false,
        // },
        {
            title: "Token ID (Assigned from Step 1)",
            type: "text",
            name: "tokenId",
            isRequired: false,
        },
        {
            title: "Royalties",
            type: "number",
            name: "royalties",
            isRequired: false,
        },
        {
            title: "Token Name Base",
            type: "text",
            name: "tokenNameBase",
            isRequired: false,
        },
        {
            title: "Token Base URI",
            type: "text",
            name: "imageBase",
            isRequired: false,
        },
        {
            title: "Image Extension Type",
            type: "text",
            name: "imageExt",
            isRequired: false,
        },
        {
            title: "Price",
            type: "number",
            name: "price",
            isRequired: false,
        },
        {
            title: "Max Supply",
            type: "number",
            name: "maxSupply",
            isRequired: false,
        },
        {
            title: "Sale Start Date",
            type: "date",
            name: "saleStart",
            isRequired: false,
        },
        {
            title: "Metadata Base URI",
            type: "text",
            name: "metadataBase",
            isRequired: false,
        },
    ];

    const schemaObjectStep2 = () => {

        const schema: any = {};

        inputsStep2.forEach((inputData: any) => {

            const { type, name, isRequired } = inputData;
            const typeRule = type === "number" ? yup.number() : yup.string();

            if (isRequired) {

                schema[name] = typeRule.required();

            }



            schema[name] = typeRule;


        });

        return schema;

    }

    const schemaStep2 = yup.object(schemaObjectStep2()).required();

    const { register: registerStep2, handleSubmit: handleSubmitStep2, formState: { errors: errorsStep2 } } = useForm({
        resolver: yupResolver(schemaStep2),
    });

    const onSubmitStep2 = (data: any) => {

        data.tokenId = asciiToHex(data.tokenId);
        data.saleStart = new Date(data.saleStart).getTime() / 1000;

        const formattedData = {
            ...data,
            imageExt: `.` + data.imageExt,
            tokenId: hexToAscii(data.tokenId),
        };

        signTemplateTransaction({
            getTemplateData: { ...formattedData, userWalletAddress },
            succesCallbackRoute: pathname,
            getTemplateTrigger: getDeployCollectionTemplateTrigger,
        });

    };


    // ================================== STEP 3 ==================================

    const schemaStep3 = yup.object({
        
        hexWalletAddress: yup.string().required(),

    }).required();

    const { register: registerStep3, handleSubmit: handleSubmitStep3, formState: { errors: errorsStep3 } } = useForm({

        resolver: yupResolver(schemaStep3),

    });

    const onSubmitStep3 = (data: any) => {

        console.log("======= onSubmitStep3 =========");

        const { hexWalletAddress } = data;

        const getTemplateData = { userWalletAddress, contractAddress: new Address(hexWalletAddress).toString() };

        signTemplateTransaction({
            getTemplateData,
            succesCallbackRoute: pathname,
            getTemplateTrigger: getChangeOwnerCollectionTemplateTrigger,
        });

    };



    // ================================== STEP 4 ==================================

    const schemaStep4 = yup.object({
        collectionId: yup.string().required(),
        hexWalletAddress: yup.string().required(),
    }).required();

    const { register: registerStep4, handleSubmit: handleSubmitStep4, formState: { errors: errorsStep4 } } = useForm({

        resolver: yupResolver(schemaStep4),

    });

    const onSubmitStep4 = (data: any) => {

        const { hexWalletAddress, collectionId } = data;


        data.collectionId = asciiToHex(data.collectionId)

        const getTemplateData = {
            userWalletAddress,
            collectionId: hexToAscii(data.collectionId),
            contractAddress: new Address(hexWalletAddress).toString()
        };

        signTemplateTransaction({
            getTemplateData,
            succesCallbackRoute: pathname,
            getTemplateTrigger: getSetRolesCollectionTemplateTrigger,
        });

    };


    // ================================== STEP 5 ==================================


    const [flagSelect, setFlagSelect] = useState<any>({ value: 'art', label: 'Art' });

    const [createCollectionTrigger,] = useCreateCollectionMutation
    ();

    const schemaStep5 = yup.object({

        collectionName: yup.string(),
        description: yup.string(),
        discordLink: yup.string(),
        instagramLink: yup.string(),
        telegramLink: yup.string(),
        twitterLink: yup.string(),
        website: yup.string(),
        collectionTokenId: yup.string(),

    }).required();

    const { register: registerStep5, handleSubmit: handleSubmitStep5, formState: { errors: errorsStep5 } } = useForm({
        resolver: yupResolver(schemaStep5),
    });

    const onSubmitStep5 = async (data: any) => {

        //data.collectionTokenId = asciiToHex(data.collectionTokenId);

        /*
        console.log("data.tokenId2: " + data.tokenId2)

        

        console.log("data.tokenId2: " + data.tokenId2)
        console.log("flag: " + [flagSelect.value])
        console.log("collectionName: " + data.collectionName)
        console.log("description: " + data.description)
        */

        const formattedData = {
            ...data,
            tokenId:hexToAscii(data.collectionTokenId),
            userAddress: userWalletAddress,
            flags: [flagSelect.value],
        }



        const response: any = await createCollectionTrigger({ payload: formattedData });

        if (response.error) {

            const { error, status, } = response.error;

            toast.error(`${error + ' ' + status}`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;
        }
        


        toast.success(`Succesful register`, {
            autoClose: 5000,
            draggable: true,
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: false,
            position: "bottom-right",
        });


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


    

    


    
    return (

        <div className="p-account-settings-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-4 md:m-20">

                    <div className="mb-10">
                        <Link to={`/account`}> {`< Back to account`}</Link>
                    </div>

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-20">
                        Create Your Collection
                    </h2>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5"  id="divStep1" >
                            <form onSubmit={handleSubmitStep1(onSubmitStep1)}>

                                <p className="text-2xl u-text-bold mb-4">
                                    Step 1 of 5 ┋ Initial NFT Marker
                                </p>


                                <p className="text-xl mb-2">
                                    Token Name
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep1.name?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep1('name')}  id="token_name" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>

                                <p>
                                    Token Ticker
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep1.ticker?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep1('ticker')} id="token_ticker" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>

                                
                                
                                <button type="submit" id="submit_step1" className="c-button c-button--primary mb-5" >
                                    Sign
                                </button>

                            </form>



                        </div>

                        <div className="col-span-12 "  id="divStep2_HRLine" hidden={true} >
                                <hr className="text-white my-20" />
                            </div>

                        <div className="col-span-12 lg:col-span-5" id="divStep2" hidden={true}>

                            <p className="text-2xl u-text-bold mb-4">
                                Step 2 of 5 ┋ Deploy Collection Contract
                            </p>

                            <p>
                                {/* Token ID */}
                            </p>


                            <form onSubmit={handleSubmitStep2(onSubmitStep2)} >

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">

                                        {inputsStep2.map((inputData: any) => {

                                            const { name, type, title } = inputData;

                                            return (
                                                <div className="my-6">

                                                    <p className="mb-2 text-lg text-red-500">{errorsStep2.name?.message}</p>
                                                    <label className="block w-full">
                                                        <span className="block mb-2">{title}</span>
                                                        <input  {...registerStep2(name)} id={name} autoComplete="off" step={ name === "price" || name ===  "royalties" ? "0.001" : "1" } type={type} min={0} className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                                    </label>
                                                </div>
                                            )

                                        })}


                                    </div>
                                </div>



                                <button type="submit" id="submit_step2" className="c-button c-button--primary mb-5" >
                                    Sign
                                </button>

                            </form>

                            
                        </div>


                        <div className="col-span-12 "  id="divStep3_HRLine" hidden={true} >
                            <hr className="text-white my-20" />
                        </div>

                        <div className="col-span-12 lg:col-span-5"  id="divStep3" hidden={true}>

                            <p className="text-2xl u-text-bold mb-4">
                                Step 3 of 5 ┋ Transfer Ownership
                            </p>

                            <form onSubmit={handleSubmitStep3(onSubmitStep3)} >


                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">

                                        <label className="block w-full">
                                            <span className="block mb-2">  Minter Contract Address (Hex Encoded)</span>
                                            <input {...registerStep3('hexWalletAddress')} id="step3SCAddress" autoComplete="off" readOnly={true} type="text" className="text-xl bg-opacity-10 bg-white border-1 border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />

                                        </label>
                                    </div>
                                </div>

                                <button type="submit" id="submit_step3" className="c-button c-button--primary mb-5" >
                                    Sign
                                </button>

                            </form>

                        </div>

                        <div className="col-span-12 "  id="divStep4_HRLine" hidden={true} >
                            <hr className="text-white my-20" />
                        </div>

                        <div className="col-span-12 lg:col-span-5"  id="divStep4" hidden={true} >

                            <p className="text-2xl u-text-bold mb-4">
                                Step 4 of 5 ┋ Set Roles for Collection
                            </p>

                            <form onSubmit={handleSubmitStep4(onSubmitStep4)} >

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">

                                        <div className="mb-4">
                                            <label className="block w-full">

                                                <span className="block mb-2">  Minter Contract Address (Hex Encoded)</span>
                                                <input {...registerStep4('hexWalletAddress')} id="SetRole_Address" autoComplete="off" readOnly={true} type="text" className="text-xl bg-opacity-10 bg-white border-1 border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />

                                            </label>
                                        </div>

                                        <div>
                                            <label className="block w-full">

                                                <span className="block mb-2">  Token ID </span>
                                                <input {...registerStep4('collectionId')} id="SetRole_TokenId" autoComplete="off" type="text" readOnly={true} className="text-xl bg-opacity-10 bg-white border-1 border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />

                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" id="submit_step4" className="c-button c-button--primary mb-5" >
                                    Sign
                                </button>

                            </form>

                        </div>


                        <div className="col-span-12 lg:col-span-5"  id="divStep5" hidden={true} >

                            <p className="text-2xl u-text-bold mb-4">
                                Step 5 of 5 ┋ Set Details
                            </p>

                            <form onSubmit={handleSubmitStep5(onSubmitStep5)} >

                                <p className="text-xl mb-2">
                                    Token ID
                                </p>
                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep5('collectionTokenId')}  id="collectionTokenId" readOnly={true} autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>


                                <p className="text-xl mb-2">
                                    Collection Name
                                </p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep5('collectionName')}  autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>
                                
                                <p className="text-xl mb-2">
                                    Description
                                </p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <textarea {...registerStep5('collectiondescription')} autoComplete="off"   placeholder="Tell us about your collection!" className="bg-opacity-10 bg-white border-1 border-gray-500 p-2 placeholder-opacity-10 rounded-2 text-white w-full mb-10" />
                                    </div>
                                </div>


                                <p className="text-xl mb-2">
                                    Category
                                </p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <Select onChange={(value) => { setFlagSelect(value) }} options={options} isSearchable={false} defaultValue={flagSelect} styles={customStyles} />

                                    </div>
                                </div>


                                <p className="text-xl mb-2">
                                    Links
                                </p>



                                <div className="border-1 border-gray-500  rounded-2 overflow-hidden  mb-8">

                                    <label className="flex align-items-center bg-opacity-10 hover:bg-opacity-20 bg-white p-3">
                                        <input {...registerStep5('website')} autoComplete="off" placeholder="http://www.yoursite.io" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://discord.gg/</span>
                                        <input {...registerStep5('discordLink')} autoComplete="off" placeholder="YourDiscordHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://twitter.com/</span>
                                        <input {...registerStep5('twitterLink')} autoComplete="off" placeholder="YourTwitterHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://instagram.com/</span>
                                        <input {...registerStep5('instagramLink')} autoComplete="off" placeholder="YourInstagramHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://t.me/</span>
                                        <input {...registerStep5('telegramLink')} autoComplete="off" placeholder="abcdef" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                </div>


                                <button type="submit" id="submit_step5" className="c-button c-button--primary mb-5" >
                                    Create
                                </button>




                            </form>

                        </div>


                    </div>


                </div>


            </div>

        </div>

        
    );
};

export default CreateCollectionPage;
