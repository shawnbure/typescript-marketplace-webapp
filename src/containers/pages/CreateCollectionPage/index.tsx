import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import * as faIcons from '@fortawesome/free-solid-svg-icons';

import { ErrorMessage } from '@hookform/error-message';

import { prepareTransaction } from "utils/transactions";


import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleCopyToClipboard } from "utils";
import { useGetAccountGatewayTokensMutation, useGetAccountTokensMutation, useSetAccountMutation, useSetProfileImageMutation } from "services/accounts";
import { toast } from 'react-toastify';
import { useGetChangeOwnerCollectionTemplateMutation, useGetDeployCollectionTemplateMutation, useGetIssueNftTemplateMutation, useGetSetRolesCollectionTemplateMutation } from 'services/tx-template';


export const CreateCollectionPage: (props: any) => any = ({ }) => {

    const {
        address: userWalletAddress,
    } = Dapp.useContext();

    
    const [getIssueNftTemplateTrigger] = useGetIssueNftTemplateMutation();
    const [getSetRolesCollectionTemplate] = useGetSetRolesCollectionTemplateMutation();
    const [getDeployCollectionTemplateTrigger] = useGetDeployCollectionTemplateMutation();
    const [getChangeOwnerCollectionTemplateTrigger ] = useGetChangeOwnerCollectionTemplateMutation();
    

    
    const { pathname } = useLocation();
    const sendTransaction = Dapp.useSendTransaction();

    const signTemplateTransaction = async (settings: any) => {

        const { getTemplateTrigger, getTemplateData, succesCallbackRoute } = settings;

        const response: any = await getTemplateTrigger({ ...getTemplateData });

        if (response.error) {

            const { status, data: { error } } = response.error;

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

        const { data: txData } = response.data;

        const unconsumedTransaction = prepareTransaction(txData);

        sendTransaction({
            transaction: unconsumedTransaction,
            callbackRoute: succesCallbackRoute
        });

    };

    const schemaStep1 = yup.object({
        name: yup.string().required(),
        ticker: yup.string().required(),
    }).required();

    const { register: registerStep1, handleSubmit: handleSubmitStep1, control: controlStep1, setError: setErrorStep1, clearErrors: clearErrorsStep1, formState: { errors: errorsStep1 } } = useForm({

        defaultValues: {
            name: "",
            ticker: ""
        },

        resolver: yupResolver(schemaStep1),

    });

    const onSubmitStep1 = (data: any) => {

        const { name, ticker } = data;

        const getTemplateData = { userWalletAddress, tokenName: name, tokenTicker: ticker };

        const getTemplateTrigger = getIssueNftTemplateTrigger;

        signTemplateTransaction({ getTemplateTrigger, getTemplateData, succesCallbackRoute: pathname });

    };



    // step 2

    const inputsStep2 = [
        {
            title: "user address",
            type: "text",
            name: "userAddress",
            isRequired: false,
        },
        {
            title: "tokenId",
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
            title: "Token name base",
            type: "text",
            name: "tokenNameBase",
            isRequired: false,
        },
        {
            title: "Token base URI",
            type: "text",
            name: "imageBase",
            isRequired: false,
        },
        {
            title: "Image extension type",
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
            title: "Max supply",
            type: "number",
            name: "maxSupply",
            isRequired: false,
        },
        {
            title: "Sale start timestamp",
            type: "number",
            name: "saleStart",
            isRequired: false,
        },
        {
            title: "Metadata base URI",
            type: "text",
            name: "metadataBase",
            isRequired: false,
        },
    ];

    const schemaObject = () => {

        const schema: any = {};

        inputsStep2.forEach((inputData: any) => {

            const { type, name, isRequired } = inputData;
            const typeRule = type === "number" ? yup.number() :  yup.string() ;

            if (isRequired) {

                schema[name] = typeRule.required();

            }

            schema[name] = typeRule;


        });

        return schema;

    }

    const schemaStep2 = yup.object(schemaObject()).required();

    const { register: registerStep2, handleSubmit: handleSubmitStep2, formState: { errors: errorsStep2 } } = useForm({
        resolver: yupResolver(schemaStep2),
    });

    const onSubmitStep2 = (data: any) => {

        signTemplateTransaction({ 
            getTemplateData: data,
            succesCallbackRoute: pathname,
            getTemplateTrigger: getDeployCollectionTemplateTrigger, 
        });

    };


    // {/* royalties: BigUint,
    // token_name_base: BoxedBytes,
    // image_base_uri: BoxedBytes,
    // image_extension: BoxedBytes,
    // price: BigUint,
    // max_supply: u64,
    // sale_start_timestamp: u64,
    // #[var_args] metadata_base_uri_opt: OptionalArg<BoxedBytes>, */}
    
    
    useEffect(() => {

        // getChangeOwnerCollectionTemplateTrigger(();

        // signTemplateTransaction({
        //     getTemplateData: { userWalletAddress, contractAddress: 'erd1qqqqqqqqqqqqqpgqfnpmvezt9rhatjsyew2ycwl7antfm0ult9uscqf6yy' },
        //     succesCallbackRoute: pathname,
        //     getTemplateTrigger: getChangeOwnerCollectionTemplateTrigger, 
        // });
       
       
        // signTemplateTransaction({
        //     getTemplateData: { userWalletAddress, contractAddress: 'erd1qqqqqqqqqqqqqpgqfnpmvezt9rhatjsyew2ycwl7antfm0ult9uscqf6yy', collectionId: 'ABCD-9d7a44' },
        //     succesCallbackRoute: pathname,
        //     getTemplateTrigger: getSetRolesCollectionTemplate, 
        // });
        

    },[])

    return (

        <div className="p-account-settings-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-20">

                    <div className="mb-10">
                        <Link to={`/account`}> {`< Back to account`}</Link>
                    </div>

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-20">
                        Create your collection
                    </h2>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">
                            <form onSubmit={handleSubmitStep1(onSubmitStep1)}>

                                <p className="text-2xl u-text-bold mb-4">
                                    Step 1 ┋ Initial NFT marker
                                </p>


                                <p className="text-xl mb-2">
                                    Token name
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep1.name?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep1('name')} type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>

                                <p>
                                    Token ticker
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep1.ticker?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep1('ticker')} type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>

                                <button type="submit" className="c-button c-button--primary mb-5" >
                                    Sign
                                </button>

                            </form>

                        </div>

                        <div className="col-span-12 ">
                            <hr className="text-white my-20" />
                        </div>

                        <div className="col-span-12 lg:col-span-5">

                            <p className="text-2xl u-text-bold mb-4">
                                Step 2 ┋ Deploy collection contract
                            </p>

                            <p>
                                Token ID
                            </p>


                            <form onSubmit={handleSubmitStep2(onSubmitStep2)} >

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">

                                        {inputsStep2.map((inputData: any) => {

                                            const { name, type } = inputData;

                                            return (
                                                <div className="my-6">

                                <p className="mb-2 text-lg text-red-500">{errorsStep2.name?.message}</p>
                                                    <label className="block w-full">
                                                        <span className="block mb-2">{name}</span>
                                                        <input  {...registerStep2(name)} type={type} className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                                    </label>
                                                </div>
                                            )

                                        })}


                                    </div>
                                </div>



                                <button className="c-button c-button--primary mb-5" >
                                    Sign
                                </button>

                            </form>

                        </div>


                        <div className="col-span-12 ">
                            <hr className="text-white my-20" />
                        </div>

                        <div className="col-span-12 lg:col-span-5">

                            <p className="text-2xl u-text-bold mb-4">
                                Step 3 ┋ Transfer collection ownership
                            </p>

                            <p className="text-xl mb-2">
                                Collection contract address
                            </p>

                            <div className="grid grid-cols-9 mb-4">
                                <div className="col-span-12">
                                    <input type="text" className="text-center text-4xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                </div>
                            </div>

                            <button className="c-button c-button--primary mb-5" >
                                Sign
                            </button>

                        </div>

                        <div className="col-span-12 ">
                            <hr className="text-white my-20" />
                        </div>


                        <div className="col-span-12 lg:col-span-5">

                            <p className="text-2xl u-text-bold mb-4">
                                Step 4 ┋ Set roles for collection
                            </p>

                            <p className="text-xl mb-2">
                                Collection contract address
                            </p>

                            <div className="grid grid-cols-9 mb-4">
                                <div className="col-span-12">
                                    <input type="text" className="text-center text-4xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                </div>
                            </div>

                            <button className="c-button c-button--primary mb-5" >
                                Sign
                            </button>

                        </div>

                    </div>


                </div>


            </div>

        </div>
    );
};

export default CreateCollectionPage;
