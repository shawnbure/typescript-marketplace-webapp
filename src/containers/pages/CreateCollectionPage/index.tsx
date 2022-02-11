
import ReactDOM from "react-dom";

import { Redirect, Link, Router, useLocation, useHistory } from 'react-router-dom';
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

import { routePaths } from "constants/router";
import { date } from 'yup/lib/locale';

import { useRefreshCreateOrUpdateSessionStatesMutation, useRetrieveSessionStatesMutation, useDeleteSessionStatesByAccountIdByStateTypeMutation } from "services/session-states";




export const CreateCollectionPage: (props: any) => any = ({ }) => {

    const {
        address: userWalletAddress,
    } = Dapp.useContext();


    interface SessionStateJSONData 
    {
        step: number;
        tokenID: string;
        scAddress: string;
    }


    function CreateJSONDataStringForSessionState(stepParam: number, 
                                                 tokenIDParam: string, 
                                                 scAddressParam: string) : string
    {
        let jsonObj = { step: stepParam, 
                        tokenID: tokenIDParam, 
                        scAddress: scAddressParam };

        return JSON.stringify(jsonObj);
    }

    function GetSessionStateJSONDataFromString(jstrJSON: string) : SessionStateJSONData
    {
        return JSON.parse(jstrJSON);
    }


    

    //var [count] = useState(1) //class variable


    //const[ step, setStep] = useState("")

    /*
    useEffect(() => {
        
        setValuesSessionState()
        
        //count++
         count = 5

        console.log(" %%%%%%%%%%%%%%%%% count: " + count)


        console.log("this component was also mounted", []);
    
   });

   useEffect(() => {
    console.log("the step changed.! Just like componentDidUpdate", step);
    });
    */



    //const handleStepEvent = (step: any) => {
    //    setStep(step)
    // }






    const [retrieveSessionStatesTrigger, {
        data: sessionStateData,
    }] = useRetrieveSessionStatesMutation();
    

    const setValuesSessionState = async () => {

        const formattedData = {
            address: "TestAddress",
            stateType: 1,
        }

        console.log("formattedData.address: " + formattedData.address)
        console.log("formattedData.stateType: " + formattedData.stateType)


        const sessionStateData: any = await retrieveSessionStatesTrigger({ payload: formattedData });
        


        if (sessionStateData?.data) {
            console.log("sessionStateData.address: " + sessionStateData?.data?.data?.address)
            console.log("sessionStateData.jsonData: " + sessionStateData?.data?.data?.jsonData)
            console.log("sessionStateData.stateType: " + sessionStateData?.data?.data?.stateType)

        }

        //

        /*
        var json = '{ "Step": 1, "TokenID": "ABC-01", "SCAddress": "0001234w454" }';

        var obj = JSON.parse(json);

        // Accessing individual value from JS object
        console.log("obj.Step: " + obj.Step); // Outputs: Peter
        console.log("obj.TokenID: " + obj.TokenID); // Outputs: 22
        console.log("obj.SCAddress: " + obj.SCAddress); // Outputs: United States


        let myObj = { Step1: 2, TokenID1: "TokenID1", SCAddress: "randomAddress2" };

        var jsonMyObj = JSON.stringify(myObj); 

        console.log("jsonMyObj: " + jsonMyObj);

        var obj2 = JSON.parse(jsonMyObj);

        // Accessing individual value from JS object
        console.log("obj2.Step: " + obj2.Step1); // Outputs: Peter
        console.log("obj2.TokenID: " + obj2.TokenID1); // Outputs: 22
        console.log("obj2.SCAddress: " + obj2.SCAddress); // Outputs: United States


        let strJSON2 = CreateJSONDataStringForSessionState(88, "Token88", "SCAddress88") 

        var obj2 = JSON.parse(strJSON2);

        console.log("Step: " + obj2.step)
        console.log("TokenID: " + obj2.tokenID)
        console.log("SCAddress: " + obj2.scAddress)


        let ss: SessionStateJSONData = { step: 10, tokenID: "Token10", scAddress: "scAddress10" };

        console.log("ss: " + ss)

        console.log("ss.step: " + ss.step)
        console.log("ss.tokenID: " + ss.tokenID)
        console.log("ss.scAddress: " + ss.scAddress)

        let ssjsonObj = GetSessionStateJSONDataFromString(JSON.stringify(ss));

        console.log("ss2.step: " + ss.step)
        console.log("ss2.tokenID: " + ss.tokenID)
        console.log("ss2.scAddress: " + ss.scAddress)

        //deleteSessionStateTransaction();
        */
    }

    
    useEffect(() => {

        //setValuesSessionState();

    }, []);
    



    


    const [deleteSessionStatesByAccountIdByStateTypeTrigger] = useDeleteSessionStatesByAccountIdByStateTypeMutation();

    const deleteSessionStateTransaction = async () => {

        const formattedData = {
            address: userWalletAddress,
            stateType: 1,
        }

        console.log("formattedData.address: " + formattedData.address)
        console.log("formattedData.stateType: " + formattedData.stateType)

        const response: any = deleteSessionStatesByAccountIdByStateTypeTrigger({ payload: formattedData });

        if (response.error) {
             //handle any error here
            //return;
        }

    };
        
    


    const [refreshCreateOrUpdateSessionStatesTrigger] = useRefreshCreateOrUpdateSessionStatesMutation();

    const refreshCreateOrUpdateSessionStateTransaction = async (step: any, tokenId: any, scAddress: any) => {

        console.log("step: " + step)
        console.log("tokenId: " + tokenId)
        console.log("scAddress: " + scAddress)
        
        const formattedData = {
            address: userWalletAddress,
            stateType: 1,
            jsonData: CreateJSONDataStringForSessionState(step, tokenId, scAddress),
        }

        console.log("formattedData.address: " + formattedData.address)
        console.log("formattedData.stateType: " + formattedData.stateType)
        console.log("formattedData.jsonData: " + formattedData.jsonData)


        const response: any = refreshCreateOrUpdateSessionStatesTrigger({ payload: formattedData });


        if (response.error) {
            //handle any error here
            //return;
        }

    };
    
    

    
    
    /*
    const retrieveSessionStateTransaction = async (step: any, tokenId: any) => {

        console.log("step: " + step)
        console.log("tokenId: " + tokenId)

        const formattedData = {
            address: "someWallets",
            stateType: 1,
            jsonData: "{testData}",
        }

        console.log("formattedData.address: " + formattedData.address)
        console.log("formattedData.stateType: " + formattedData.stateType)
        console.log("formattedData.jsonData: " + formattedData.jsonData)


        const response: any = await retrieveSessionStatesTrigger({ payload: formattedData });

        
        

        if (response.error) {

            console.log("retrieveSessionStatesTrigger error");

            const { error, status, } = response.error;

            toast.error(`${error + ' ' + status}`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            //return;
        }

    };
    */


    
    {    



        /*
        useEffect(()=>
        {
            console.log("useEffect 1");

            console.log("userWalletAddress: " + userWalletAddress)

            retrieveSessionStatesTrigger({ Address: userWalletAddress, StateType: 1 })

            //console.log(sessionStateData.address)

            console.log("useEffect 2");


        }, [])
        */


        const queryString = window.location.search;

        const params = new URLSearchParams(window.location.search)

        const txtHash = params.get("txHash")
        
        console.log("after txHash");

        if(txtHash != null )
        {
            console.log("after txHash != null");

            const httpRequest = new XMLHttpRequest();
            const url= GetTransactionRequestHttpURL(txtHash); 
            httpRequest.open("GET", url);
            httpRequest.send();
            
            httpRequest.onreadystatechange = (e) => 
            {
                
                if (httpRequest.readyState == 4 && httpRequest.status == 200)
                {
                    console.log("after httpRequest.readyState == 4");

                    if( httpRequest.responseText )
                    {                
                        const data = httpRequest.responseText;

                        try {
                            const jsonResponse2 = JSON.parse(data);
                          } catch (error) {
                            console.error(" =================== PARSE ERRROR:" + error);
                            return;
                          }

                          
                        const jsonResponse = JSON.parse(data);
                        const actionName = GetTransactionActionName(jsonResponse)

                        const resultData = GetJSONResultData(jsonResponse);
                        
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
    
    }




    function HandleIssueNonFungibleAction(resultData: string)
    {
        //get the tokenID from the resultData
        const tokenID = GetTransactionTokenID(resultData);

        //set the tokenId
        var inputName = document.getElementById("tokenId") as HTMLInputElement;
        inputName.value = tokenID;
        inputName.readOnly = true;
     
        sessionStorage.setItem("tokenId", tokenID);
    }


    function HandledeployNFTTemplateContractAction(resultData: string)
    {
        //get the contractAddress from the resultData
        const contractAddress = GetTransactionContractAddress(resultData);

        var inputName = document.getElementById("step3SCAddress") as HTMLInputElement;
        inputName.value = contractAddress;
        
        sessionStorage.setItem("contractAddress", contractAddress);

    }


    function HandleChangeOwnerAction(resultData: string)
    {
        const contractAddress = sessionStorage.getItem("contractAddress") as string;
        const tokenId = sessionStorage.getItem("tokenId") as string;

        var inputSetRoleAddress = document.getElementById("SetRole_Address") as HTMLInputElement;
        inputSetRoleAddress.value = contractAddress;

        var inputSetRoleTokenId = document.getElementById("SetRole_TokenId") as HTMLInputElement;
        inputSetRoleTokenId.value = tokenId;
    }

    function HandleSetSpecialRoleAction(resultData: string)
    {
        const tokenId = sessionStorage.getItem("tokenId") as string;
        
        var inputCollectionTokenId = document.getElementById("collectionTokenId") as HTMLInputElement;

        inputCollectionTokenId.value = tokenId;   
    }

    function HandlePageStateByActionName(actionName: string)
    {
        //hide all divs
        HideElement("divStep1");
        HideElement("divStep2");
        HideElement("divStep3");
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
                ShowElement("divStep2");
                break;
            } 
            case "deployNFTTemplateContract":
            {
                ShowElement("divStep3");
                break;
            }
            case "changeOwner":
            {
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
        name: yup.string().min(3, "Must be between 3-10 AlphaNumeric Characters").max(10, "Must be between 3-10 AlphaNumeric Characters").matches(/^[a-zA-Z0-9]+$/, "Must be AlphaNumeric ONLY").required(),
        ticker: yup.string().min(3, "Must be between 3-10 AlphaNumeric Uppercase Characters").max(10, "Must be between 3-10 AlphaNumeric Uppercase Characters").matches(/^[A-Z0-9]+$/, "Must be Uppercase AlphaNumeric ONLY").required(),

    }).required();

    const { register: registerStep1, handleSubmit: handleSubmitStep1, control: controlStep1, setError: setErrorStep1, clearErrors: clearErrorsStep1, formState: { errors: errorsStep1 } } = useForm({

        // defaultValues: {
        //     name: "",
        //     ticker: ""
        // },

        resolver: yupResolver(schemaStep1),

    });

    const onSubmitStep1 = (data: any) => {



        //createSessionStateTransaction(5, "ABC-01");

        const { name, ticker } = data;

        //ticker is force to be upper
        const getTemplateData = { userWalletAddress, tokenName: name, tokenTicker: ticker };


        const getTemplateTrigger = getIssueNftTemplateTrigger;

        signTemplateTransaction({ getTemplateTrigger, getTemplateData, succesCallbackRoute: pathname });

    };



    // ================================== STEP 2 ==================================
    
    const [mediaTypeSelect, setMediaTypeSelect] = useState<any>({ value: '.png', label: 'PNG' });

    const optionsMediaType = [

        { value: '.png', label: 'PNG' },
        { value: '.jpeg', label: 'JPEG' },
        { value: '.jpg', label: 'JPG' },
        { value: '.gif', label: 'GIF' },
        { value: '.mp3', label: 'MP3' },
        { value: '.mp4', label: 'MP4' },

    ]; 


    const schemaStep2 = yup.object({
        royalties: yup.string().matches(/^((10)(\.[0-0]{0,2})?$|([0-9])(\.[0-9]{1,2})?$)/, "Numbers must be between 0-10").required(),
        tokenNameBase: yup.string().required("Required Field"),
        imageBase: yup.string().required("Required Field"),
        price: yup.string().matches(/^\d{0,10}(\.\d{1,2})?$/, "Only positive numbers with 2 decimals allowed.").required(),
        maxSupply: yup.string().matches(/^([1-9][0-9]{0,3}|10000)$/, "Numbers must be between 1-10000").required(),
        metadataBase: yup.string().required("Required Field"),
    }).required();

    const { register: registerStep2, handleSubmit: handleSubmitStep2, control: controlStep2, setError: setErrorStep2, clearErrors: clearErrorsStep2, formState: { errors: errorsStep2 } } = useForm({

        // defaultValues: {
        //     name: "",
        //     ticker: ""
        // },

        resolver: yupResolver(schemaStep2),

    });
    
    
    const onSubmitStep2 = (data: any) => {

        //sale start date is now current date with time of 12am 
        var d = new Date();     //current date
        d.setHours(0,0,0,0);    //set to 12am

        //set to to saleStart
        data.saleStart = d.getTime() / 1000;

        //price is set to zero(0) to the request
        //data.price = 0 


        sessionStorage.setItem("price", data.price);



        data.imageExt = mediaTypeSelect.value

        const formattedData = {
            ...data,
            imageExt: mediaTypeSelect.value,
            tokenId: sessionStorage.getItem("tokenId") as string,
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

        collectionName: yup.string().min(3, "Min of 3 and Max of 20 Characters").max(20,"Min of 3 and Max of 20 Characters").required("Required Field"),
        description: yup.string().max(1000, "Max of 1000 Characters"),
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

        const tokenId = sessionStorage.getItem("tokenId") as string;
        const contractAddress = sessionStorage.getItem("contractAddress") as string;

        data.ContractAddress = new Address(contractAddress).toString();

        const sPrice = sessionStorage.getItem("price") as string;

        console.log("sPrice: " + sPrice);

        data.mintPricePerTokenString = sPrice

        const formattedData = {
            ...data,
            tokenId:tokenId,
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
        else
        {
            //submit_step5, linkBackToProfile

            HideElement("submit_step5");

            ShowElement("linkBackToProfile");
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

                    <div className="grid grid-cols-12 p-create-collection">

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
                                        <input {...registerStep1('ticker')} id="token_ticker" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full p-create-collection_token-ticker" />
                                    </div>
                                </div>

                                <button type="submit" id="submit_step1" className="c-button c-button--primary mb-5" >
                                    Sign
                                </button>




                            </form>





                        </div>


                        <div className="col-span-12 lg:col-span-5" id="divStep2" hidden={true}>

                            <p className="text-2xl u-text-bold mb-4">
                                Step 2 of 5 ┋ Deploy Collection Contract
                            </p>




                            <form onSubmit={handleSubmitStep2(onSubmitStep2)} >


                                <p className="text-xl mb-2">
                                    Token Id
                                </p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input id="tokenId" readOnly={true} autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>

                                <p>
                                    Royalties
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.royalties?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep2('royalties')} id="royalties" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full p-create-collection_token-ticker" />
                                    </div>
                                </div>



                                <p>
                                    Token Name Base
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.tokenNameBase?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep2('tokenNameBase')} id="tokenNameBase" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full p-create-collection_token-ticker" />
                                    </div>
                                </div>


                                <p>
                                    Token Base URI
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.imageBase?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep2('imageBase')} id="imageBase" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full p-create-collection_token-ticker" />
                                    </div>
                                </div>

                                <p>
                                    Media Type
                                </p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <Select onChange={(value) => { setMediaTypeSelect(value) }} options={optionsMediaType} isSearchable={false} defaultValue={mediaTypeSelect} styles={customStyles} />

                                    </div>
                                </div>


                                <p>
                                    Price
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.price?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep2('price')} id="price" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full p-create-collection_token-ticker" />
                                    </div>
                                </div>


                                <p>
                                    Max Supply
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.maxSupply?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep2('maxSupply')} id="maxSupply" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full p-create-collection_token-ticker" />
                                    </div>
                                </div>


                                <p>
                                    Metadata Base URI
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.metadataBase?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep2('metadataBase')} id="metadataBase" autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full p-create-collection_token-ticker" />
                                    </div>
                                </div>



                                <button type="submit" id="submit_step2" className="c-button c-button--primary mb-5" >
                                    Sign
                                </button>

                            </form>

                            
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
                                        <textarea {...registerStep5('description')} autoComplete="off"   placeholder="Tell us about your collection!" className="bg-opacity-10 bg-white border-1 border-gray-500 p-2 placeholder-opacity-10 rounded-2 text-white w-full mb-10" />
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


                                <Link to={routePaths.account} id="linkBackToProfile" hidden={true} className="c-button c-button--primary" >                        
                                    <div className="inline-flex">
                                        <span>
                                            Back to Profile
                                        </span>
                                    </div>
                                </Link>


                            </form>

                        </div>





                    </div>


                </div>


            </div>

        </div>

        
    );
};

export default CreateCollectionPage;
