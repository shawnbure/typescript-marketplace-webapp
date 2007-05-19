import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import Collapsible from 'react-collapsible';
import { useLocation, Link, useParams, useHistory } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrands from '@fortawesome/free-brands-svg-icons';
import { ToastContainer, toast } from 'react-toastify';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGetBuyNftTemplateMutation, useGetListNftTemplateMutation } from 'services/tx-template';
import { useGetTokenDataQuery, useLazyGetTokenDataQuery } from "services/tokens";
import { prepareTransaction } from "utils/transactions";

import { useGetEgldPriceQuery } from "services/oracle";
import { handleCopyToClipboard, shorterAddress } from "utils";
import { BUY } from "constants/actions";
import { useGetAccountGatewayTokensMutation, useGetAccountTokensMutation } from "services/accounts";
import Popup from "reactjs-popup";


export const CollectionEditPage: (props: any) => any = ({ }) => {

    const [bio, setBio] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    const {
        address: userWalletAddress,
    } = Dapp.useContext();


    const handleCopyAddressToClipboard = () => {

        handleCopyToClipboard(userWalletAddress);

    }

    const handleUploadImage = (event: any) => {

        

    }

    return (

        <div className="p-account-settings-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-20">

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-8">
                        Edit your collection
                    </h2>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">

                            <form>

                                <div className="mb-10">
                                    <p className="mb-2">
                                        Logo Image
                                    </p>
                                    <p className="mb-2 text-gray-500 text-sm">
                                        This image will appear at the top of your collection page. Dimensions change on different devices. <br /> 350 x 350 recommended.
                                    </p>
                                    <label className="c-button c-button--secondary">
                                        <span className="mt-2 text-base leading-normal">Select a file</span>
                                        <input onChange={handleUploadImage} type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" className="hidden" />
                                    </label>
                                </div>


                                <div className="mb-10">
                                    <p className="mb-2">
                                        Banner Banner
                                    </p>
                                    <p className="mb-2 text-gray-500 text-sm">
                                        This image will appear at the top of your collection page. Dimensions change on different devices. <br /> 1400 x 400 recommended.
                                    </p>
                                    <label className="c-button c-button--secondary">
                                        <span className="mt-2 text-base leading-normal">Select a file</span>
                                        <input type="file" id="avatar" name="banner" accept="image/png, image/jpeg" className="hidden" />
                                    </label>
                                </div>


                                <p className="mb-2">
                                    Name <span className="text-red-600">*</span>
                                </p>

                                <input required placeholder="Enter username" type="text" className="bg-opacity-10 bg-white border-1 border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" />

                                {/* <p className="mb-2">
                                    Email Address <span className="text-red-600">*</span>
                                </p>

                                <input required placeholder="Enter username" type="email" className="bg-opacity-10 bg-white border-1  border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" /> */}

                                <p className="mb-2">
                                    Description
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
                                        <span  className="text-gray-400 ">https://discord.gg/</span>
                                        <input placeholder="YourDiscordHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span  className="text-gray-400 ">https://twitter.com/</span>
                                        <input placeholder="YourTwitterHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span  className="text-gray-400 ">https://instagram.com/</span>
                                        <input placeholder="YourInstagramHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span  className="text-gray-400 ">https://t.me/</span>
                                        <input placeholder="abcdef" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
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
