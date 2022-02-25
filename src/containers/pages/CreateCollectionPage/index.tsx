
import ReactDOM from "react-dom";

import { Redirect, Link, Router, useLocation, useHistory } from 'react-router-dom';
import Select from 'react-select'
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { prepareTransaction } from "utils/transactions";

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { hexToAscii, asciiToHex, GetTransactionRequestHttpURL, GetTransactionActionName, GetJSONResultData, GetTransactionTokenID, GetTransactionContractAddress} from "utils";
import { toast } from 'react-toastify';
import { useGetChangeOwnerCollectionTemplateMutation, useGetDeployCollectionTemplateMutation, useGetIssueNftTemplateMutation, useGetSetRolesCollectionTemplateMutation } from 'services/tx-template';

import { useCreateCollectionMutation } from "services/collections";

import { Address} from '@elrondnetwork/erdjs/out';

import { routePaths } from "constants/router";
import { useRefreshCreateOrUpdateSessionStatesMutation, useRetrieveSessionStatesMutation, useDeleteSessionStatesByAccountIdByStateTypeMutation } from "services/session-states";
import { useGetWhitelistBuyCountLimitTemplateMutation,  } from "services/tokens";
import store from "redux/store";




export const CreateCollectionPage: (props: any) => any = ({ }) => {

    const {
        address: userWalletAddress,
    } = Dapp.useContext();
    
    
    //check for initial retrieval of the SessionData from DB and setting it to StepTracker - don't want it to treat it as an user action event vs system set of value event
    const [initialFetch, setInitialFetch] = useState(true)
    

    //json of the step (use for SessionData)
    const [stepTracker, setStepTracker] = useState('{ "step": 1, "tokenID": "TokenIDEmpty", "scAddress": "SCAddressEmpty", "price": 0, "tokenBaseURI": "Empty", "metaDataBaseURI": "Empty", "maxSupply": 0}');  
    //const [stepTracker, setStepTracker] = useState('{ "step": 5, "tokenID": "TESTTOKE-22", "scAddress": "00000000000000000500d8aa0fbd26b0df250c3dd7fdb9fa200e6b373419255d", "price": 8, "tokenBaseURI": "TestTokenBaseURI", "metaDataBaseURI": "TestMetadataBaseURI", "maxSupply": 88}');  

    const [urlTxtHashHandler, setUrlTxtHashHandler] = useState(false)


    const [inputPrice, setInputPrice] = useState(0)


    
    useEffect(() => {  //Invoked when "stepTracker" is SET (setStepTracker)
        
        if( urlTxtHashHandler )
        {

            //get the query param 'txHash'
            const txtHash = getTxHash();
            

            if( txtHash != null )
            {
                var successfulResponseHandler = false

                do 
                {
                    console.log("BEFORE XMLHttpRequest")
    
                    const httpRequest = new XMLHttpRequest();
                    const url= GetTransactionRequestHttpURL(txtHash); 
                    httpRequest.open("GET", url);
                    httpRequest.send();
                    
                    httpRequest.onreadystatechange = (e) => 
                    {
                        //check read state (4: done) and status
                        if (httpRequest.readyState == 4 && httpRequest.status == 200)
                        {
                            console.log("(httpRequest.readyState == 4 && httpRequest.status == 200)")
        
                            if( httpRequest.responseText  )
                            {                
                                const data = httpRequest.responseText;
        
                                try {
        
                                    const jsonResponse = JSON.parse(data);
    
                                    const actionName = GetTransactionActionName(jsonResponse)
            
                                    const resultData = GetJSONResultData(jsonResponse);
                                
                                    console.log("actionName: " + actionName)
                                    console.log("resultData: " + resultData)
    
                                    initializeSessionStateJSON(false, resultData, actionName);
    
                                    successfulResponseHandler = true
        
                                } catch(e) 
                                {
                                    console.log(e)
                                    //there's a parse error - handle it here 
                                    successfulResponseHandler = false
                                }
                            }
                        }                
                    }
                }
                while (successfulResponseHandler);
            }  
        }


      },[urlTxtHashHandler]);



    useEffect(() => {  //Invoked when "stepTracker" is SET (setStepTracker)
        
        //Convert the step tracker to JSObject
        const sessionStateJSONData = GetSessionStateJSONDataFromString(stepTracker)


        if( !initialFetch )                             //if initialFetch, don't save
        {
            console.log( "before refreshCreateOrUpdateSessionStateTransaction");

            //Refresh / Create it to SessionState DB
            refreshCreateOrUpdateSessionStateTransaction(sessionStateJSONData.step,            
                                                         sessionStateJSONData.tokenID,       
                                                         sessionStateJSONData.scAddress,
                                                         sessionStateJSONData.price,
                                                         sessionStateJSONData.tokenBaseURI,
                                                         sessionStateJSONData.metaDataBaseURI,
                                                         sessionStateJSONData.maxSupply);  
        }
    
        //once it pass all the logic above, initial fetch should be accounted for
        setInitialFetch(false);

      },[stepTracker]);  //this use effect gets called everytime 'stepTracker' is modified




    useEffect(() => {  //Called Once when page is load (note: web wallet redirect back calls this again)

       /*
        deleteSessionStateTransaction()
        return;
        */

        //getWhitelistCountLimitTemplateTransaction();

        //get the query param 'txHash'
        const txtHash = getTxHash();
        
        //only time we need to initialize SessionState JSON is when URL isn't from webwallet / maiar wallet 
        //it's coming from profile page (create collection)
        if(txtHash == null )  
        {
            initializeSessionStateJSON(true, "", "");
        } 
        else
        {
            setUrlTxtHashHandler(true);
        }


      },[]);  //only called once since it's the empty [] parameters






    //javascript class to hold JSON data
    interface SessionStateJSONData 
    {
        step: number;
        tokenID: string;
        scAddress: string;
        price: number;
        tokenBaseURI: string;
        metaDataBaseURI: string;
        maxSupply: number;
    }



    
    

    function CreateJSONDataStringForSessionState(stepParam: number, 
                                                 tokenIDParam: string, 
                                                 scAddressParam: string,
                                                 priceParam: number,
                                                 tokenBaseURIParam: string,
                                                 metaDataBaseURIParam: string,
                                                 maxSupplyParam: number) : string
    {
        let jsonObj = { step: stepParam, 
                        tokenID: tokenIDParam, 
                        scAddress: scAddressParam,
                        price: priceParam,
                        tokenBaseURI: tokenBaseURIParam,
                        metaDataBaseURI: metaDataBaseURIParam,
                        maxSupply: maxSupplyParam
                        }; 

        return JSON.stringify(jsonObj);
    }

    function GetSessionStateJSONDataFromString(jstrJSON: string) : SessionStateJSONData
    {
        console.log("GetSessionStateJSONDataFromString: " + jstrJSON);

        return JSON.parse(jstrJSON);
    }



    //used in the initializeSessionStateJSON func
    const [retrieveSessionStatesTrigger, {
        data: sessionStateData,
    }] = useRetrieveSessionStatesMutation();
    




    //This initialize the varSessionStateJSON
    const initializeSessionStateJSON = async (isInitialLoad: boolean, responseData: string, responseActionName: string) => {

        //set the request data to pass to triggers
        const formattedData = {
            address: userWalletAddress,
            stateType: 1,
        }

        //retrieve the session state
        const sessionStateData: any = await retrieveSessionStatesTrigger({ payload: formattedData });
        
        //check data and initialize it to variable
        if (sessionStateData?.data) {


            //set the DB Json string to sessionStateJSONData object
            const sessionStateJSONData = GetSessionStateJSONDataFromString(sessionStateData?.data?.data?.jsonData)


            console.log("sessionStateJSONData: ===>")
            console.log(sessionStateJSONData);
            console.log("responseData: " + responseData);
            console.log("responseActionName: " + responseActionName);
            
            if( responseData != "" &&  responseActionName != "")
            {
                console.log("initializeSessionStateJSON - response data and actionName")
                
                switch(responseActionName) 
                {
                    case "issueNonFungible":  //step 1 completed
                    {
                        //get the tokenID from the resultData
                        const tokenID = GetTransactionTokenID(responseData);
                        sessionStateJSONData.tokenID = tokenID;

                        sessionStateJSONData.step = 2;

                        break;
                    } 
                    case "deployNFTTemplateContract":  //step 2 completed
                    {
                        const contractAddress = GetTransactionContractAddress(responseData);
                        sessionStateJSONData.scAddress = contractAddress;
    
                        //get the price here
                        //sessionStateJSONData.price = 0

                        sessionStateJSONData.step = 3;

                        break;
                    }
                    case "changeOwner": //step 3 completed
                    {
                        sessionStateJSONData.step = 4;

                        break;
                    }
                    case "setSpecialRole": //step 4 completed
                    {
                        sessionStateJSONData.step = 5;
                        break;
                    }
                    default:
                    {

                    } 
                }

                //set this so it saves to DB
                setStepTracker('{ "step": ' + sessionStateJSONData.step + ', ' + 
                               '"tokenID": "' + sessionStateJSONData.tokenID + '", ' +
                               '"scAddress": "' + sessionStateJSONData.scAddress + '", ' +
                               '"price": ' + sessionStateJSONData.price + ', ' +
                               '"tokenBaseURI": "' + sessionStateJSONData.tokenBaseURI + '", ' +
                               '"metaDataBaseURI": "' + sessionStateJSONData.metaDataBaseURI + '", ' +
                               '"maxSupply":' + sessionStateJSONData.maxSupply + '}')     
                               

                               
            } 
            else if( sessionStateJSONData.step == 1 )
            {                
                //set this so it saves to DB
                setStepTracker('{ "step": ' + sessionStateJSONData.step + ', ' + 
                               '"tokenID": "' + sessionStateJSONData.tokenID + '", ' +
                               '"scAddress": "' + sessionStateJSONData.scAddress + '", ' +
                               '"price": ' + sessionStateJSONData.price + ', ' +
                               '"tokenBaseURI": "' + sessionStateJSONData.tokenBaseURI + '", ' +
                               '"metaDataBaseURI": "' + sessionStateJSONData.metaDataBaseURI + '", ' +
                               '"maxSupply":' + sessionStateJSONData.maxSupply + '}')      
            }
            


            console.log("HandlePageStateBySessionState");
            console.log(sessionStateJSONData)

            //display page state
            HandlePageStateBySessionState(sessionStateJSONData.step, sessionStateJSONData.tokenID, sessionStateJSONData.scAddress, sessionStateJSONData.price); 

        }       
    }






  
    
    const [deleteSessionStatesByAccountIdByStateTypeTrigger] = useDeleteSessionStatesByAccountIdByStateTypeMutation();

    //when the collection is created, then delete the sessionState from DB 
    const deleteSessionStateTransaction = async () => {

        const formattedData = {
            address: userWalletAddress,
            stateType: 1,
        }

        const response: any = deleteSessionStatesByAccountIdByStateTypeTrigger({ payload: formattedData });

        if (response.error) {
             //handle any error here
            return;
        }

    };
        
    


    const [getWhitelistBuyCountLimitTemplateTrigger] = useGetWhitelistBuyCountLimitTemplateMutation();

    // this refresh OR create the sessionState in DB
    const getWhitelistCountLimitTemplateTransaction = async () => {
        
        console.log("userWalletAddress: " + userWalletAddress)

        const formattedData = {
            contractAddress: "erd1qqqqqqqqqqqqqpgqslkmvrkp82wjm69jpz7z24e2h0tju9axy4wsf2ewsq",  //collection contract address
            userAddress: userWalletAddress,
        }

        const response: any = await getWhitelistBuyCountLimitTemplateTrigger({ payload: formattedData });

        if (response.error) {
            //handle any error here
            return;
        }

        const { data: txData } = response.data;

        //csv: count,limit
        console.log(" ========================== response data: txtData")
        console.log(response.data)
        console.log(txData)

        //CSV split
        var dataArray = txData.split(',');

        console.log("BuyCount: " + dataArray[0]);
        console.log("BuyLimit: " + dataArray[1]);

        console.log(" ========================== response data: txtData")
    };
    
    
    const [refreshCreateOrUpdateSessionStatesTrigger] = useRefreshCreateOrUpdateSessionStatesMutation();

    // this refresh OR create the sessionState in DB
    const refreshCreateOrUpdateSessionStateTransaction = async (step: any, tokenId: any, scAddress: any, price: any, tokenBaseURI: any, metaDataBaseURI: any, maxSupply: any) => {
        
        const formattedData = {
            address: userWalletAddress,
            stateType: 1,
            jsonData: CreateJSONDataStringForSessionState(step, tokenId, scAddress, price, tokenBaseURI, metaDataBaseURI, maxSupply),
        }

        const response: any = await refreshCreateOrUpdateSessionStatesTrigger({ payload: formattedData });

        if (response.error) {
            //handle any error here
            return;
        }

    };




    function getTxHash()
    {
        const queryString = window.location.search;

        const params = new URLSearchParams(window.location.search)

        //get the query param 'txHash'
        return params.get("txHash")
    }


    function UpdatePriceInStepTracker(price: string)
    {
        const sessionStateJSONData = GetSessionStateJSONDataFromString(stepTracker)

        setStepTracker('{ "step": ' + sessionStateJSONData.step + ', ' + 
        '"tokenID": "' + sessionStateJSONData.tokenID + '", ' +
        '"scAddress": "' + sessionStateJSONData.scAddress + '", ' +
        '"price":' + price + ', ' +
        '"tokenBaseURI": "' + sessionStateJSONData.tokenBaseURI + '", ' +
        '"metaDataBaseURI": "' + sessionStateJSONData.metaDataBaseURI + '", ' +
        '"maxSupply":' + sessionStateJSONData.maxSupply + '}')        


    }





    function HandlePageStateBySessionState(step: number, tokenID: string, scAddress: string, price: number)
    {        
        //hide all div initially and the switch below will show appropriate ones
        HideElement("divStep1");
        HideElement("divStep2");
        HideElement("divStep3");
        HideElement("divStep4");                
        HideElement("divStep5");


        switch(step) 
        {
            case 1:  
            {
                ShowElement("divStep1");
                break;
            }
            case 2:  
            {
                //set the token id 
                var inputName = document.getElementById("tokenId") as HTMLInputElement;
                inputName.value = tokenID;
                inputName.readOnly = true;
                
                ShowElement("divStep2");

                break;
            } 
            case 3:
            {
                var step3SCAddress = document.getElementById("step3SCAddress") as HTMLInputElement;
                step3SCAddress.value = scAddress;
                step3SCAddress.readOnly = true;

                ShowElement("divStep3");
                OnFocusElement("submit_step3");

                break;
            } 
            case 4:
            {
                var setRoleAddress = document.getElementById("SetRole_Address") as HTMLInputElement;
                setRoleAddress.value = scAddress;
                setRoleAddress.readOnly = true;

                var setRoleTokenId = document.getElementById("SetRole_TokenId") as HTMLInputElement;
                setRoleTokenId.value = tokenID;
                setRoleTokenId.readOnly = true;
                
                ShowElement("divStep4");

                break;
            }     
            case 5:
            {
                var collectionTokenId = document.getElementById("collectionTokenId") as HTMLInputElement;
                collectionTokenId.value = tokenID;
                collectionTokenId.readOnly = true;

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


    function OnFocusElement(elementID: string)
    {
        var element = document.getElementById(elementID) as HTMLInputElement;
        element.focus();

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

        //Append on .json to the MetaDataBase (based on Hashlips standards)
        data.metadataBase = data.metadataBase + ".json"

        console.log( "============= data.metadataBase: " + data.metadataBase)

        const sessionStateJSONData = GetSessionStateJSONDataFromString(stepTracker)

        setStepTracker('{ "step": ' + sessionStateJSONData.step + ', ' + 
        '"tokenID": "' + sessionStateJSONData.tokenID + '", ' +
        '"scAddress": "' + sessionStateJSONData.scAddress + '", ' +
        '"price":' + data.price + ', ' +
        '"tokenBaseURI": "' + data.imageBase + '", ' +
        '"metaDataBaseURI": "' + data.metadataBase + '", ' +
        '"maxSupply":' + data.maxSupply + '}')  

        data.imageExt = mediaTypeSelect.value

        const formattedData = {
            ...data,
            imageExt: mediaTypeSelect.value,
            tokenId: sessionStateJSONData.tokenID, 
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


    const { register: registerStep5, handleSubmit: handleSubmitStep5, control: controlStep5, setError: setErrorStep5, clearErrors: clearErrorsStep5, formState: { errors: errorsStep5 } } = useForm({
        resolver: yupResolver(schemaStep5),
    });

    const onSubmitStep5 = async (data: any) => {

        const sessionStateJSONData = GetSessionStateJSONDataFromString(stepTracker)

        const tokenId = sessionStateJSONData.tokenID;   
        const contractAddress = sessionStateJSONData.scAddress;  

        data.ContractAddress = new Address(contractAddress).toString();

        const sPrice = "" + sessionStateJSONData.price; 

        data.mintPricePerTokenString = sPrice
        data.tokenBaseURI = sessionStateJSONData.tokenBaseURI
        data.MetaDataBaseURI = sessionStateJSONData.metaDataBaseURI
        data.MaxSupply = sessionStateJSONData.maxSupply

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
            //delete all the session state data from DB
            deleteSessionStateTransaction();


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
                                    Instruction: Enter the token name and token ticker for the smart contract. <br/><br/>
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

                                <button type="submit" id="submit_step1" className="c-button c-button--primary mb-5"  >
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
                                    Instruction: Enter the attributes and details of the smart contract. <br/><br/>
                                </p>                                

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

                                <p className="text-xl mb-2">
                                    Instruction: Sign the transaction to transfer ownership of the smart contract.<br/><br/>
                                </p> 
                                
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

                                <p className="text-xl mb-2">
                                    Instruction: Set roles for the smart contract.<br/><br/>
                                </p> 

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
                                    Instruction: Enter the name and details of the collection.<br/><br/>
                                </p> 

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

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.collectionName?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep5('collectionName')}  autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>
                                

                                <p className="text-xl mb-2">
                                    Description
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.description?.message}</p>

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