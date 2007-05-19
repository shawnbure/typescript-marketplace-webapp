import Select from 'react-select'
import { useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { handleCopyToClipboard, hexToAscii } from "utils";
import { useGetCollectionByIdMutation, useCreateCollectionMutation } from "services/collections";
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export const RegisterCollectionPage: (props: any) => any = ({ }) => {


    const {
        address: userWalletAddress,
    } = Dapp.useContext();


    const [flagSelect, setFlagSelect] = useState<any>({ value: 'art', label: 'Art' });

    const [createCollectionTrigger,] = useCreateCollectionMutation();

    const [getCollectionByIdTrigger] = useGetCollectionByIdMutation();

    const schemaStep1 = yup.object({

        collectionName: yup.string(),
        description: yup.string(),
        discordLink: yup.string(),
        instagramLink: yup.string(),
        telegramLink: yup.string(),
        twitterLink: yup.string(),
        website: yup.string(),
        tokenId: yup.string(),

    }).required();

    const { register: registerStep1, handleSubmit: handleSubmitStep1, formState: { errors: errorsStep1 } } = useForm({
        resolver: yupResolver(schemaStep1),
    });

    const onSubmitStep1 = async (data: any) => {

        const formattedData = {
            ...data,
            tokenId: hexToAscii(data.tokenId),
            userAddress: userWalletAddress,
            flags: [flagSelect.value],
        }


        const response: any = await createCollectionTrigger({ payload: formattedData });

        if (response?.error) {


            toast.error(`Error register`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;

        };

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

        <div className="p-collection-register-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-20">

                    <div className="mb-10">
                        <Link to={`/account`}> {`< Back to account`}</Link>
                    </div>

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-8">
                        Register collection
                    </h2>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">

                            <form className="mb-10" onSubmit={handleSubmitStep1(onSubmitStep1)}>


                                <label className="w-full">

                                    <div className="mb-2 text-lg">
                                        <span>Token ID</span>  <span className="text-red-600">*</span>
                                    </div>

                                    <input  {...registerStep1('tokenId')} autoComplete="off" placeholder="Collection name" type="text" className="bg-opacity-10 bg-white border-1 border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" />

                                </label>

                                <label className="w-full">

                                    <div className="mb-2 text-lg">
                                        <span>Collection name</span>
                                    </div>

                                    <input  {...registerStep1('collectionName')} autoComplete="off" placeholder="Collection name" type="text" className="bg-opacity-10 bg-white border-1 border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" />

                                </label>

                                <p className="mb-2">
                                    Description
                                </p>

                                <textarea  {...registerStep1('description')} autoComplete="off" placeholder="Tell us about your collection!" className="bg-opacity-10 bg-white border-1 border-gray-500 p-2 placeholder-opacity-10 rounded-2 text-white w-full mb-10" />


                                <div className="mb-10">

                                    <p className="mb-2">
                                        Category
                                    </p>

                                    <Select onChange={(value) => { setFlagSelect(value) }} options={options} isSearchable={false} defaultValue={flagSelect} styles={customStyles} />
                                </div>


                                <p className="mb-2">
                                    Links
                                </p>

                                <div className="border-1 border-gray-500  rounded-2 overflow-hidden  mb-8">

                                    <label className="flex align-items-center bg-opacity-10 hover:bg-opacity-20 bg-white p-3">
                                        <input {...registerStep1('website')} autoComplete="off" placeholder="yoursite.io" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
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


                                <button className="c-button c-button--primary" type="submit">Register</button>

                            </form>


                        </div>

                    </div>


                </div>


            </div>

        </div>
    );
};

export default RegisterCollectionPage;
