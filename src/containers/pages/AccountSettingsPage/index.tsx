import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import * as faIcons from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleCopyToClipboard } from "utils";
import { useGetAccountGatewayTokensMutation, useGetAccountTokensMutation, useSetAccountMutation, useSetProfileImageMutation } from "services/accounts";


import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";


export const AccountSettingsPage: (props: any) => any = ({ }) => {

    const [bio, setBio] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [profileImageB64, setProfileImageB64] = useState<string>('');

    const {
        address: userWalletAddress,
    } = Dapp.useContext();

    const [
        setAccountMutationTrigger,
    ] = useSetAccountMutation();

    const [
        setProfileMutationTrigger,
    ] = useSetProfileImageMutation();

    const handleCopyAddressToClipboard = () => {

        handleCopyToClipboard(userWalletAddress);

    }

    const handleUploadImage = (event: any) => {

        const hasImage: boolean = event.target.files && event.target.files[0];

        if (!hasImage) {

            return;

        }

        function formatBytes(bytes: number, decimals: number = 2) {

            if (bytes === 0) return '0 Bytes';

            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

            const i = Math.floor(Math.log(bytes) / Math.log(k));

            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        const image = event.target.files[0];
        const reader: any = new FileReader();

        reader.onload = function () {

            setProfileImageB64(reader.result);

        }
        
        reader.readAsDataURL(image);
        

    }

    const handleChangeUsername = (event: any) => {

        setUsername(event.target.value);

    }

    const handleSubmit = (event: any) => {

        event.preventDefault();

        setAccountMutationTrigger({
            payload: {
                name: username,
                description: 'desc',
                website: 'web',
                twitterLink: 'twi',
                instagramLink: 'insta',
            },
            userWalletAddress: userWalletAddress
        });


        setProfileMutationTrigger({

            imageB64: profileImageB64,
            userWalletAddress: userWalletAddress

        });

    };

    return (

        <div className="p-account-settings-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-20">

                    <div className="mb-10">
                        <Link to={`/account`}> {`< Back to account`}</Link>
                    </div>

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-8">
                        Profile Settings
                    </h2>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">

                            <form onSubmit={handleSubmit}>

                                <p className="mb-2">
                                    Wallet Address
                                </p>

                                <div className="flex">
                                    <input disabled placeholder="Wallet Address" type="text" value={userWalletAddress} className="bg-transparent border-1 overflow-ellipsis border-gray-500 mb-8 p-3 placeholder-opacity-10 rounded-2 text-gray-300 w-full" />
                                    <FontAwesomeIcon onClick={handleCopyAddressToClipboard} className="text-gray-400 my-3 cursor-pointer" style={{ width: 25, height: 25, margin: "10px 15px" }} icon={faIcons.faCopy} />
                                </div>

                                <p className="mb-2">
                                    Username
                                </p>

                                <input onChange={handleChangeUsername} value={username} placeholder="Enter username" type="text" className="bg-opacity-10 bg-white border-1 border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" />

                                <p className="mb-2">
                                    Bio
                                </p>

                                <textarea placeholder="Tell us about yourself!" className="bg-opacity-10 bg-white border-1 border-gray-500 p-2 placeholder-opacity-10 rounded-2 text-white w-full mb-10" />

                                <p className="mb-2">
                                    Links
                                </p>

                                <div className="border-1 border-gray-500  rounded-2 overflow-hidden  mb-8">


                                    <label className="flex align-items-center bg-opacity-10 bg-white p-3">
                                        <input placeholder="yoursite.io" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://twitter.com/</span>
                                        <input placeholder="YourTwitterHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://instagram.com/</span>
                                        <input placeholder="YourInstagramHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                </div>
                                <div className="mb-10">
                                    <p className="mb-2">
                                        Profile Image
                                    </p>
                                    <label className="c-button c-button--secondary">
                                        <span className="mt-2 text-base leading-normal">Select a file</span>
                                        <input onChange={handleUploadImage} type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" className="hidden" />
                                    </label>
                                </div>


                                <div className="mb-10">
                                    <p className="mb-2">
                                        Profile Banner
                                    </p>
                                    <label className="c-button c-button--secondary">
                                        <span className="mt-2 text-base leading-normal">Select a file</span>
                                        <input type="file" id="avatar" name="banner" accept="image/png, image/jpeg" className="hidden" />
                                    </label>
                                </div>



                                <button className="c-button c-button--primary" type="submit">Save</button>

                            </form>

                        </div>

                    </div>


                </div>


            </div>

        </div>
    );
};

export default AccountSettingsPage;
