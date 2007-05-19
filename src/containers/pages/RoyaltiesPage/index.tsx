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
import { useGetChangeOwnerCollectionTemplateMutation, useGetDeployCollectionTemplateMutation, useGetIssueNftTemplateMutation, useGetRequestWithdrawTemplateMutation, useGetSetRolesCollectionTemplateMutation, useGetWithdrawCreatorRoyaltiesTemplateMutation, useGetWithdrawMinterTemplateMutation } from 'services/tx-template';
import { useGetRoyaltiesAmountTemplateMutation, useGetRoyaltiesRemainingTemplateMutation } from 'services/royalties';


export const RoyaltiesPage: (props: any) => any = ({ }) => {

    const {
        address: userWalletAddress,
    } = Dapp.useContext();


    const [getRoyaltiesRemainingTemplateTrigger, {
        data: getRoyaltiesRemainingData,
    }] = useGetRoyaltiesRemainingTemplateMutation();

    const [getRoyaltiesAmountTemplateTrigger, {
        data: getRoyaltiesAmountData,
    }] = useGetRoyaltiesAmountTemplateMutation();

    const [getRequestWithdrawTemplate, {
        data: getRequestWithdrawData,
    }] = useGetRequestWithdrawTemplateMutation();

    const [getWithdrawMinterTemplateTrigger, {
        data: getWithdrawMinterTemplateData,
    }] = useGetWithdrawMinterTemplateMutation();

    const [getWithdrawCreatorRoyaltiesTemplateTrigger, {
        data: getWithdrawCreatorRoyaltiesData,
    }] = useGetWithdrawCreatorRoyaltiesTemplateMutation();





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
        address: yup.string().required(),
    }).required();

    const { register: registerStep1, handleSubmit: handleSubmitStep1, control: controlStep1, setError: setErrorStep1, clearErrors: clearErrorsStep1, formState: { errors: errorsStep1 } } = useForm({

        resolver: yupResolver(schemaStep1),

    });

    const onSubmitStep1 = (data: any) => {

        const { address } = data;

        getRoyaltiesAmountTemplateTrigger({ userWalletAddress: address });
        getRoyaltiesRemainingTemplateTrigger({ userWalletAddress: address });

    };


    // 2

    const schemaStep2 = yup.object({
        // userAddress: yup.string().required(),
        contractAddress: yup.string().required(),
    }).required();

    const { register: registerStep2, handleSubmit: handleSubmitStep2, formState: { errors: errorsStep2 } } = useForm({

        resolver: yupResolver(schemaStep2),

    });

    const onSubmitStep2 = (data: any) => {


        const { contractAddress } = data;

        // getRequestWithdrawTemplate();

        signTemplateTransaction({
            getTemplateData: { userWalletAddress, contractAddress },
            succesCallbackRoute: pathname,
            getTemplateTrigger: getRequestWithdrawTemplate,
        });

    };



    // 2

    const schemaStep3 = yup.object({
        contractAddress: yup.string().required(),
    }).required();

    const { register: registerStep3, handleSubmit: handleSubmitStep3, formState: { errors: errorsStep3 } } = useForm({

        resolver: yupResolver(schemaStep3),

    });

    const onSubmitStep3 = (data: any) => {

        const { contractAddress } = data;

        signTemplateTransaction({
            getTemplateData: { userWalletAddress, contractAddress },
            succesCallbackRoute: pathname,
            getTemplateTrigger: getWithdrawMinterTemplateTrigger,
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
                        Royalties
                    </h2>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">
                            <form onSubmit={handleSubmitStep1(onSubmitStep1)}>

                                <p className="text-2xl u-text-bold mb-4">
                                    Check address royalties
                                </p>


                                <p className="text-xl mb-2">
                                    Address
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsStep1.name?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep1('address')} type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>

                                <div className="text-white mb-4">


                                    {
                                        getRoyaltiesAmountData?.data &&
                                        <p className="text-gray-400">
                                            You have  <span className="text-white"> {getRoyaltiesAmountData?.data} </span> EGLD
                                        </p>
                                    }

                                    {
                                        getRoyaltiesRemainingData?.data &&
                                        <p className="text-gray-400">
                                            You have <span className="text-white">{getRoyaltiesRemainingData?.data} </span> epochs to wait until the next withdraw
                                        </p>
                                    }
                                  
                                </div>

                                <button type="submit" className="c-button c-button--primary mb-5" >
                                    Check
                                </button>

                            </form>

                        </div>


                        <div className="col-span-12 ">
                            <hr className="text-white my-20" />
                        </div>

                        <div className="col-span-12 lg:col-span-5">
                            <form onSubmit={handleSubmitStep2(onSubmitStep2)}>

                                <p className="text-2xl u-text-bold mb-4">
                                    Withdraw from marketplace to minter contract
                                </p>
                                {/* 
                                <p className="text-xl mb-2">
                                   User Address
                                </p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep2('userAddress')} type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div> */}


                                <p className="text-xl mb-2">
                                    Contract Address
                                </p>


                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep2('contractAddress')} type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
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
                            <form onSubmit={handleSubmitStep3(onSubmitStep3)}>

                                <p className="text-2xl u-text-bold mb-4">
                                    Withdraw EGLD from minter contract to owner
                                </p>


                                <p className="text-xl mb-2">
                                    Contract Address
                                </p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerStep3('contractAddress')} type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
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
                                Withdraw creator royalties _owner TODO
                            </p>

                            <button onClick={() => {

                                signTemplateTransaction({
                                    succesCallbackRoute: pathname,
                                    getTemplateData: { userWalletAddress },
                                    getTemplateTrigger: getWithdrawCreatorRoyaltiesTemplateTrigger,
                                });

                            }} type="submit" className="c-button c-button--primary mb-5" >
                                Sign
                            </button>

                        </div>


                    </div>


                </div>


            </div>

        </div>
    );
};

export default RoyaltiesPage;
