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
import { handleCopyToClipboard, hexToAscii } from "utils";
import { useGetAccountGatewayTokensMutation, useGetAccountTokensMutation, useSetAccountMutation, useSetProfileImageMutation } from "services/accounts";
import { toast } from 'react-toastify';
import { useGetChangeOwnerCollectionTemplateMutation, useGetDeployCollectionTemplateMutation, useGetIssueNftTemplateMutation, useGetSetRolesCollectionTemplateMutation } from 'services/tx-template';


import { AddressValue, BytesValue, U32Value, ArgSerializer, Address, BytesType, AddressType, } from '@elrondnetwork/erdjs/out';


export const CreateCollectionPage: (props: any) => any = ({ }) => {

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



    // step 2

    const inputsStep2 = [
        // {
        //     title: "user address",
        //     type: "text",
        //     name: "userAddress",
        //     isRequired: false,
        // },
        {
            title: "Token ID (hex value)",
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


    // 3


    const schemaStep3 = yup.object({
        
        hexWalletAddress: yup.string().required(),

    }).required();

    const { register: registerStep3, handleSubmit: handleSubmitStep3, formState: { errors: errorsStep3 } } = useForm({

        resolver: yupResolver(schemaStep3),

    });

    const onSubmitStep3 = (data: any) => {

        const { hexWalletAddress } = data;

        const getTemplateData = { userWalletAddress, contractAddress: new Address(hexWalletAddress).toString() };

        console.log({
            getTemplateData
        });
        

        signTemplateTransaction({
            getTemplateData,
            succesCallbackRoute: pathname,
            getTemplateTrigger: getChangeOwnerCollectionTemplateTrigger,
        });

    };



    // 4

    const schemaStep4 = yup.object({
        collectionId: yup.string().required(),
        hexWalletAddress: yup.string().required(),
    }).required();

    const { register: registerStep4, handleSubmit: handleSubmitStep4, formState: { errors: errorsStep4 } } = useForm({

        resolver: yupResolver(schemaStep4),

    });

    const onSubmitStep4 = (data: any) => {

        const { hexWalletAddress, collectionId } = data;

        const getTemplateData = {
            userWalletAddress,
            collectionId: hexToAscii(collectionId),
            contractAddress: new Address(hexWalletAddress).toString()
        };

        signTemplateTransaction({
            getTemplateData,
            succesCallbackRoute: pathname,
            getTemplateTrigger: getSetRolesCollectionTemplateTrigger,
        });

    };

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
                                Step 3 ┋ Transfer ownership
                            </p>

                            <form onSubmit={handleSubmitStep3(onSubmitStep3)} >


                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">

                                        <label className="block w-full">
                                            <span className="block mb-2">  Minter contract address (hex encoded)</span>
                                            <input {...registerStep3('hexWalletAddress')} type="text" className="text-center text-xl bg-opacity-10 bg-white border-1 border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />

                                        </label>
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
                                Step 4 ┋ Set roles for collection
                            </p>

                            <form onSubmit={handleSubmitStep4(onSubmitStep4)} >

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">

                                        <div className="mb-4">
                                            <label className="block w-full">

                                                <span className="block mb-2">  Minter contract address (hex encoded)</span>
                                                <input {...registerStep4('hexWalletAddress')} type="text" className="text-center text-xl bg-opacity-10 bg-white border-1 border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />

                                            </label>
                                        </div>

                                        <div>
                                            <label className="block w-full">

                                                <span className="block mb-2">  Token ID (hex value) </span>
                                                <input {...registerStep4('collectionId')} type="text" className="text-center text-xl bg-opacity-10 bg-white border-1 border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />

                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="c-button c-button--primary mb-5" >
                                    Sign
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
