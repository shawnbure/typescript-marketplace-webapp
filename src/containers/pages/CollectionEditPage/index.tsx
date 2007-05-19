import { useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";


import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useLocation, Link, useParams, } from "react-router-dom";


import { handleCopyToClipboard, shorterAddress } from "utils";
import { useSaveCollectionCoverImageMutation, useSaveCollectionProfileImageMutation, useUpdateCollectionMutation } from "services/collections";
import { toast } from "react-toastify";

import { UrlParameters } from './interfaces';

export const CollectionEditPage: (props: any) => any = ({ }) => {

    const { collectionId } = useParams<UrlParameters>();

    const [updateCollectionMutationTrigger,] = useUpdateCollectionMutation();

    const [saveCollectionProfileImageTrigger] = useSaveCollectionProfileImageMutation();
    const [saveCollectionCoverImageTrigger] = useSaveCollectionCoverImageMutation();

    const schemaEdit = yup.object({

        // name: yup.string(),
        description: yup.string().max(350, "Must be 300 max"),
        discordLink: yup.string(),
        instagramLink: yup.string(),
        telegramLink: yup.string(),
        twitterLink: yup.string(),
        website: yup.string(),

    }).required();


    const [coverImageB64, setCoverImageB64] = useState<string>('');
    const [profileImageB64, setProfileImageB64] = useState<string>('');

    const [coverName, setCoverName] = useState<string>('');
    const [profileName, setProfileName] = useState<string>('');

    const {
        address: userWalletAddress,
    } = Dapp.useContext();

    const handleUploadProfileImage = (event: any) => {

        const hasImage: boolean = event.target.files && event.target.files[0];


        if (!hasImage) {

            return;

        }

        const image = event.target.files[0];
        const reader: any = new FileReader();

        setProfileName(image.name);
        

        reader.onload = function () {

            setProfileImageB64(reader.result);

        }

        reader.readAsDataURL(image);


    };


    const handleSaveProfileImage = async () => {

         const response: any = await saveCollectionProfileImageTrigger({

            imageB64: profileImageB64,
            collectionId: collectionId

        });

        if(response.error) {
            

            toast.error(`Error upload logo image`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;
    
        };


        toast.success(`Succesful upload logo image`, {
            autoClose: 5000,
            draggable: true,
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: false,
            position: "bottom-right",
        });


    };


    const handleUploadSaveCoverImage = (event: any) => {

        const hasImage: boolean = event.target.files && event.target.files[0];

        if (!hasImage) {

            return;

        }

        const image = event.target.files[0];
        const reader: any = new FileReader();

        setCoverName(image.name);        

        reader.onload = function () {

            setCoverImageB64(reader.result);

        }

        reader.readAsDataURL(image);


    };


    const handleSaveCoverImage =  async () => {

        const response: any = await saveCollectionCoverImageTrigger({

            imageB64: coverImageB64,
            collectionId: collectionId

        });

        if(response.error) {
            

            toast.error(`Error upload cover image`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;
    
        };


        toast.success(`Succesful upload cover image`, {
            autoClose: 5000,
            draggable: true,
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: false,
            position: "bottom-right",
        });


    };


    const { trigger, register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit } } = useForm({
        resolver: yupResolver(schemaEdit)
    });

    const onSubmitFilters = (data: any) => {


        console.log({

        });


    };

    const onSubmit = async (data: any) => {

        const response: any = await updateCollectionMutationTrigger({ collectionId, payload: data });

        if (response?.error) {


            toast.error(`Error update collection`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;

        };

        toast.success(`Succesful update collection`, {
            autoClose: 5000,
            draggable: true,
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: false,
            position: "bottom-right",
        });

    }

    return (

        <div className="p-account-settings-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-4 md:m-20">

                    <div className="mb-10">
                        <Link to={`/collection/${collectionId}`}> {`< Back to collection`}</Link>
                    </div>

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-8">
                        Edit your collection
                    </h2>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">


                            <div className="mb-10">

                                <p className="mb-2">
                                    Logo Image
                                </p>
                                <p className="mb-2 text-gray-500 text-sm">
                                    This image will appear as your collection logo. <br /> 350 x 350 recommended. Max 500KB
                                </p>

                                <p className="mb-2">
                                    {profileName}
                                </p>
                                
                                <div className="flex ">
                                    <div className="mr-4">
                                        <label className="c-button c-button--secondary ">
                                            <span className="mt-2 text-base leading-normal">Select a file</span>
                                            <input onChange={handleUploadProfileImage} type="file" accept="image/png, image/jpeg" className="hidden" />
                                        </label>
                                    </div>
                                    <button onClick={handleSaveProfileImage} className="c-button c-button--primary">upload</button>
                                </div>

                            </div>


                            <div className="mb-10">

                                <p className="mb-2">
                                    Banner Banner
                                </p>
                                <p className="mb-2 text-gray-500 text-sm">
                                    This image will appear at the top of your collection page. Dimensions change on different devices. <br /> 1400 x 400 recommended. Max 1MB
                                </p>

                                <p className="mb-2">
                                    {coverName}
                                </p>
                                
                                <div className="flex">
                                    <div className="mr-4">
                                        <label className="c-button c-button--secondary ">
                                            <span className="mt-2 text-base leading-normal">Select a file</span>
                                            <input onChange={handleUploadSaveCoverImage} type="file" accept="image/png, image/jpeg" className="hidden" />
                                        </label>
                                    </div>
                                    <button onClick={handleSaveCoverImage} className="c-button c-button--primary">upload</button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitEdit(onSubmit)}>


                                {/* 
                                <p className="mb-2">
                                    Name
                                </p>

                                <input {...registerEdit('name')} placeholder="Enter username" type="text" className="bg-opacity-10 bg-white border-1 border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" /> */}

                                <p className="mb-2">
                                    Description
                                </p>

                                <textarea  {...registerEdit('description')} placeholder="Tell us about yourself!" className="bg-opacity-10 bg-white border-1 border-gray-500 p-2 placeholder-opacity-10 rounded-2 text-white w-full mb-10" />

                                <p className="mb-2">
                                    Links
                                </p>

                                <div className="border-1 border-gray-500  rounded-2 overflow-hidden  mb-8">

                                    <label className="flex align-items-center bg-opacity-10 bg-white p-3">
                                        <input  {...registerEdit('website')} placeholder="yoursite.io" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://discord.gg/</span>
                                        <input  {...registerEdit('discordLink')} placeholder="YourDiscordHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://twitter.com/</span>
                                        <input  {...registerEdit('twitterLink')} placeholder="YourTwitterHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://instagram.com/</span>
                                        <input  {...registerEdit('instagramLink')} placeholder="YourInstagramHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://t.me/</span>
                                        <input  {...registerEdit('telegramLink')} placeholder="abcdef" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>

                                </div>



                                <button className="c-button c-button--primary" type="submit">Submit Changes</button>

                            </form>

                        </div>

                    </div>


                </div>


            </div>

        </div>
    );
};

export default CollectionEditPage;
