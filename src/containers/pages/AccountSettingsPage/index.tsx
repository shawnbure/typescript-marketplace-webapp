import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import * as DappCore from "@elrondnetwork/dapp-core";
import * as faIcons from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleCopyToClipboard } from "utils";
import { useGetAccountGatewayTokensMutation, useGetAccountMutation, useGetAccountTokensMutation, useSetAccountMutation, useSetCoverImageMutation, useSetProfileImageMutation } from "services/accounts";


import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from 'react-toastify';

import { Footer } from 'components/index';

export const AccountSettingsPage: (props: any) => any = ({ }) => {
/*
    const {
        loggedIn,
        address: userWalletAddress,
    } = Dapp.useContext();
*/

    const [userWalletAddress, setUserWalletAddress] = useState<string>('');
    DappCore.getAddress().then(address => setUserWalletAddress(address));

    const [coverImageB64, setCoverImageB64] = useState<string>('');
    const [profileImageB64, setProfileImageB64] = useState<string>('');

    const [coverName, setCoverName] = useState<string>('');
    const [profileName, setProfileName] = useState<string>('');

    const [setSaveCoverImageMutationTrigger] = useSetCoverImageMutation();
    const [setSaveProfileImageMutationTrigger] = useSetProfileImageMutation();


    const [getAccountRequestTrigger, {
        data: accountData,
        isLoading: isLoadingGetAccountRequest,
        isUninitialized: isUninitializedGetAccountRequest }] = useGetAccountMutation();


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

        const response: any = await setSaveProfileImageMutationTrigger({

            imageB64: profileImageB64,
            userWalletAddress: userWalletAddress

        });

        if (response.error) {


            toast.error(`Error upload profile image`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;

        };


        toast.success(`Succesful upload profile image`, {
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


    const handleSaveCoverImage = async () => {

        const response: any = await setSaveCoverImageMutationTrigger({

            imageB64: coverImageB64,
            userWalletAddress: userWalletAddress

        });

        if (response.error) {


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

    const [
        setAccountMutationTrigger,
    ] = useSetAccountMutation();


    const handleCopyAddressToClipboard = () => {

        handleCopyToClipboard(userWalletAddress);

    }

    const schemaEdit = yup.object({

        name: yup.string().min(3, "Min of 3 and Max of 20 Characters").max(20,"Min of 3 and Max of 20 Characters").required("Required Field"),
        description: yup.string().max(1000, "Max of 1000 Characters"),
        website: yup.string(),
        instagramLink: yup.string(),
        twitterLink: yup.string(),

    }).required();

    const { trigger, register: registerEdit, handleSubmit: handleSubmitEdit, setValue: setValueEdit, formState: { errors: errorsEdit } } = useForm({

        resolver: yupResolver(schemaEdit)

    });

    const onSubmitEdit = async (data: any) => {

        const response: any = await setAccountMutationTrigger({
            payload: data,
            userWalletAddress: userWalletAddress
        });

        //console.log(response.error);


        /*
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
        */
   
        if (response.error) {


            toast.error(`${response.error.data.error}`, {
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                pauseOnHover: true,
                hideProgressBar: false,
                position: "bottom-right",
            });

            return;

        };


        toast.success(`Succesful edit changes`, {
            autoClose: 5000,
            draggable: true,
            closeOnClick: true,
            pauseOnHover: true,
            hideProgressBar: false,
            position: "bottom-right",
        });

    };


    const setValuesAccount = async () => {

        const accountData: any = await getAccountRequestTrigger({ userWalletAddress: userWalletAddress });
        

        if (accountData?.data) {

            //console.log(accountData?.data?.data?.name);
            
            setValueEdit("name", accountData?.data?.data?.name);
            setValueEdit("description", accountData?.data?.data?.description);
            setValueEdit("website", accountData?.data?.data?.website);
            setValueEdit("instagramLink", accountData?.data?.data?.instagramLink);
            setValueEdit("twitterLink", accountData?.data?.data?.twitterLink);


        }


        // {
        //     || 'Unnamed',
        //     description: accountData?.data?.description || '',
        //     website: accountData?.data?.website,
        //     instagramLink: accountData?.data?.instagramLink,
        //     twitterLink: accountData?.data?.twitterLink,
        // }

    }

    useEffect(() => {


        setValuesAccount();

    }, []);

    return (

        <div className="p-account-settings-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-4 md:m-20">

                    <div className="mb-10">
                        <Link to={`/account`}> {`< Back to account`}</Link>
                    </div>

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-8">
                        Profile Settings
                    </h2>

                    <br/>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">



                            <div className="mb-10">

                                <p className="text-xl u-text-bold mb-2">
                                    Profile Image: &nbsp;
                                    <a href="javascript:alert('This image will appear as your c profile avatar image. Resolution: 350 x 350 recommended. Max Size of 5MB.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>

                                <p className="mb-2 text-gray-500 text-sm">
                                    Resolution: 350 x 350 recommended. Max Size of 5MB.
                                </p>


                                <p className="mb-2">
                                    {profileName}
                                </p>

                                <div className="flex">
                                    <div className="mr-4">
                                        <label className="c-button c-button--secondary ">
                                            <span className="mt-2 text-base leading-normal">Select a file</span>
                                            <input onChange={handleUploadProfileImage} type="file" accept="image/png, image/jpeg" className="hidden" />
                                        </label>
                                    </div>
                                    <button onClick={handleSaveProfileImage} className="c-button c-button--primary">upload</button>
                                </div>

                            </div>

                            <br/>

                            <div className="mb-10">

                                <p className="text-xl u-text-bold mb-2">
                                    Banner Banner: &nbsp;
                                    <a href="javascript:alert('This image will appear at the top of your profile page. Dimensions change on different devices. Resolution: 1400 x 400 recommended. Max Size of 5MB.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>

                                <p className="mb-2 text-gray-500 text-sm">
                                    Resolution: 1400 x 400 recommended. Max Size of 5MB.
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

                            <hr className="text-white my-10" />


                            <p className="text-xl u-text-bold mb-2">
                                Wallet Address: &nbsp;
                                    <a href="javascript:alert('This is the wallet address associated to this account.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>                                    
                                </p>



                                <div className="flex">
                                    <input disabled placeholder="Wallet Address" type="text" value={userWalletAddress} className="bg-transparent border-1 overflow-ellipsis border-gray-500  p-3 placeholder-opacity-10 rounded-2 text-gray-300 w-full" />
                                    <FontAwesomeIcon onClick={handleCopyAddressToClipboard} className="text-gray-400 my-3 cursor-pointer" style={{ width: 25, height: 25, margin: "10px 15px" }} icon={faIcons.faCopy} />
                                </div>

                                <br/>

                                <hr className="text-white my-10" />
                                

                            <form onSubmit={handleSubmitEdit(onSubmitEdit)}>



                            <p className="text-xl u-text-bold mb-2">
                                Account Name: &nbsp;
                                    <a href="javascript:alert('The Account Name to be displayed on the Youbei NFT Marketplace.  Allowed to have spaces and must be not longer than 20 characters.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsEdit.name?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                    <input  {...registerEdit('name')} placeholder="Enter username" type="text" className="bg-opacity-10 bg-white border-1 border-gray-500 p-3 placeholder-opacity-10 rounded-2 text-white w-full mb-8" />
                                    </div>
                                </div>



                                <p className="text-xl u-text-bold mb-2">
                                Bio: &nbsp;
                                    <a href="javascript:alert('The Bio is to inform users of the account details.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                    
                                </p>


                                <p className="mb-2 text-lg text-red-500">{errorsEdit.description?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                    <textarea  {...registerEdit('description')} placeholder="Tell us about yourself!" className="bg-opacity-10 bg-white border-1 border-gray-500 p-2 placeholder-opacity-10 rounded-2 text-white w-full mb-10" />
                                    </div>
                                </div>


                                

                                <p className="text-xl u-text-bold mb-2">
                                    Links: &nbsp;
                                    <a href="javascript:alert('Links to more web and social media outlets.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>

                                <div className="border-1 border-gray-500  rounded-2 overflow-hidden  mb-8">


                                    <label className="flex align-items-center bg-opacity-10 bg-white p-3">
                                        <input  {...registerEdit('website')} placeholder="yoursite.io" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://twitter.com/</span>
                                        <input   {...registerEdit('twitterLink')} placeholder="YourTwitterHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                    <label className="flex align-items-center bg-opacity-10 bg-white text-gray-400 p-3">
                                        <span className="text-gray-400 ">https://instagram.com/</span>
                                        <input  {...registerEdit('instagramLink')} placeholder="YourInstagramHandle" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
                                    </label>
                                </div>

                                <br/>

                                <button className="c-button c-button--primary" type="submit">Save</button>

                                <br/><br/>
                                
                            </form>

                        </div>

                    </div>

                    <br/>
  

                </div>


            </div>

        </div>
    );
};

export default AccountSettingsPage;
