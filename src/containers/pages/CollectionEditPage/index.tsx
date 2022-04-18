
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";


import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useLocation, Link, useParams, } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as faIcons from '@fortawesome/free-solid-svg-icons';

import { handleCopyToClipboard, shorterAddress } from "utils";
import { useSaveCollectionCoverImageMutation, useSaveCollectionProfileImageMutation, useUpdateCollectionMutation, useUpdateCollectionMintStartDateMutation, useGetCollectionByIdMutation } from "services/collections";
import { toast } from "react-toastify";

import { UrlParameters } from './interfaces';

import { Footer } from 'components/index';

import { prepareTransaction } from "utils/transactions";

import {
    useUpdateSaleStartTemplateMutation,
  } from "services/tx-template";

export const CollectionEditPage: (props: any) => any = ({ }) => {

    const [
        updateSaleStartTemplate,
        { data: UpdateSaleStartData },
      ] = useUpdateSaleStartTemplateMutation();

    const { pathname } = useLocation();
    const sendTransaction = Dapp.useSendTransaction();

    const signTemplateTransaction = async (settings: any) => {
        const {
          getTemplateTrigger,
          getTemplateData,
          succesCallbackRoute,
        } = settings;
    
        const response: any = await getTemplateTrigger({ ...getTemplateData });
    
        if (response.error) {
          const {
            status,
            data: { error },
          } = response.error;
    
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
          callbackRoute: succesCallbackRoute,
        });
      };
      
      
    const { collectionId } = useParams<UrlParameters>();

    const [updateCollectionMutationTrigger] = useUpdateCollectionMutation();

    const [updateCollectionMintStartDateTrigger] = useUpdateCollectionMintStartDateMutation();

    

    const [saveCollectionProfileImageTrigger] = useSaveCollectionProfileImageMutation();
    const [saveCollectionCoverImageTrigger] = useSaveCollectionCoverImageMutation();

    const [getCollectionByIdTrigger] = useGetCollectionByIdMutation();



    const [coverImageB64, setCoverImageB64] = useState<string>('');
    const [profileImageB64, setProfileImageB64] = useState<string>('');

    const [coverName, setCoverName] = useState<string>('');
    const [profileName, setProfileName] = useState<string>('');

    const [contractAddress, setContractAddress] = useState<string>('');

    const [isFinishLoading, setIsFinishLoading] = useState(false)



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

    const schemaMintingStartDate= yup.object({

        mintStartDate: yup.string(),

    }).required();


    const { register: registerMintingStartDate, handleSubmit: handleSubmitMintingStartDate, setValue: setValueMintingStartDate, control: controlMintingStartDate, setError: setErrorMintingStartDate, clearErrors: clearErrorsMintingStartDate, formState: { errors: errorsMintingStartDate } } = useForm({
        resolver: yupResolver(schemaMintingStartDate),
    });


    function confirmMintingStartDate()
    {
        var element = document.getElementById("mintStartDate") as HTMLInputElement;

        if( element != null )
        {
            if( element.value != "" )
            {
                // eslint-disable-next-line no-restricted-globals
                if( ! confirm("Minting Start Date will only allow Minting to start on the set date at 12:00 AM (UTC). Would you like confirm it?") )
                { 
                    element.value = "";  
                           
                }
            }
        }
    }



    const schemaEdit = yup.object({

        collectionName: yup.string().min(3, "Min of 3 and Max of 20 Characters").max(20,"Min of 3 and Max of 20 Characters").required("Required Field"),
        description: yup.string().max(1000, "Max of 1000 Characters"),
        discordLink: yup.string(),
        instagramLink: yup.string(),
        telegramLink: yup.string(),
        twitterLink: yup.string(),
        website: yup.string(),


    }).required();

    const { register: registerEdit, handleSubmit: handleSubmitEdit, setValue: setValueEdit, control: controlEdit, setError: setErrorEdit, clearErrors: clearErrorsEdit, formState: { errors: errorsEdit } } = useForm({
        resolver: yupResolver(schemaEdit),
    });


    
    const onSubmitMintingStartDate = async (data: any) => {



        if(data.mintStartDate == "" )
        {
            //empty
            data.mintStartDate = 0
        }
        else
        {            
            //got date

            var dateInput = new Date(data.mintStartDate);
 
            data.mintStartDate = dateInput.getTime()
        }


        //sessionStorage save
        sessionStorage.setItem("Edit_Collection_Mint_Start_Date",  data.mintStartDate)

        const saleStart =  data.mintStartDate  / 1000;

        signTemplateTransaction({
            getTemplateData: { userWalletAddress, contractAddress, saleStart },
            succesCallbackRoute: pathname,
            getTemplateTrigger: updateSaleStartTemplate,
          });


        

          /*
        const response: any = await updateCollectionMintStartDateTrigger({ collectionId, payload: data });

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
       */
    };






    const onSubmit = async (data: any) => {


        /*
        if(data.mintStartDate == "" )
        {
            //empty
            data.mintStartDate = 0
        }
        else
        {            
            //got date

            var dateInput = new Date(data.mintStartDate);
 
            data.mintStartDate = dateInput.getTime()
        }
        */

      
        
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

    };



    const setValuesCollection = async () => {

        const collectionData: any = await getCollectionByIdTrigger({ collectionId: collectionId });
        
        if (collectionData?.data) 
        {
            setContractAddress(collectionData?.data?.data?.collection.contractAddress)
            setValueEdit("collectionName", collectionData?.data?.data?.collection.name);
            setValueEdit("description", collectionData?.data?.data?.collection.description);
            setValueEdit("website", collectionData?.data?.data?.collection.website);
            setValueEdit("discordLink", collectionData?.data?.data?.collection.discordLink);
            setValueEdit("instagramLink", collectionData?.data?.data?.collection.instagramLink);
            setValueEdit("twitterLink", collectionData?.data?.data?.collection.twitterLink);
            setValueEdit("telegramLink", collectionData?.data?.data?.collection.telegramLink);


            const txHashCurrent = getTxHash();
            let sessionMintStartDate = sessionStorage.getItem("Edit_Collection_Mint_Start_Date");

            //if there is transaction hash and MintStartDate in sessiokn 
            if( txHashCurrent != null && sessionMintStartDate != null )
            {
                let sessionMintStartDateInt = parseInt(sessionMintStartDate, 10);

                if( sessionMintStartDateInt > 0 )
                {
                    setValueMintingStartDate("mintStartDate", new Date(sessionMintStartDateInt).toISOString().split('T')[0])
                }                
            }
            else  
            {
                //populated it from DB
                const mintStartDate = collectionData?.data?.data?.collection.mintStartDate

                if( mintStartDate > 0 )
                {
                    setValueMintingStartDate("mintStartDate", new Date(mintStartDate).toISOString().split('T')[0])
                }
            }


            
        }
    };


    useEffect(() => {

        setIsFinishLoading(true);

        //loads once and set the values
        setValuesCollection();

    }, []);


    function getTxHash()
    {
        const queryString = window.location.search;

        const params = new URLSearchParams(window.location.search)

        //get the query param 'txHash'
        return params.get("txHash")
    }

    function getQueryStatus()
    {
        const queryString = window.location.search;

        const params = new URLSearchParams(window.location.search)

        //get the query param 'txHash'
        return params.get("status")
    }

    const SaveToMintStartDateToDB = async () => {

        let sessionMintStartDate = sessionStorage.getItem("Edit_Collection_Mint_Start_Date");
                    
        if( sessionMintStartDate != null )
        {
            let sessionMintStartDateInt = parseInt(sessionMintStartDate, 10);


            const formattedData = {
                mintStartDate: sessionMintStartDateInt
            }

            const response: any = await updateCollectionMintStartDateTrigger({ collectionId, payload: formattedData });

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

    }

    {
        if( isFinishLoading )  //this is so that the JWT Authorization token is available
        {
            const queryStatus = getQueryStatus()  //check the status

            if( queryStatus != null && queryStatus == "fail")
            {
                toast.error(`Blockchain Update Failed`, {
                    autoClose: 5000,
                    draggable: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    hideProgressBar: false,
                    position: "bottom-right",
                });
            }
            else
            {
                const txHashCurrent = getTxHash();
    
                if( txHashCurrent != null )  
                {
                    let txHashSession = sessionStorage.getItem("Edit_Collection_TxHash");
                    
                    if( txHashCurrent != txHashSession ) //txHash is different
                    { 
                        //update session txHash
                        sessionStorage.setItem("Edit_Collection_TxHash", txHashCurrent)
    
                        SaveToMintStartDateToDB();             
                    }
                    else
                    {
                        //txHash is same is do nothing
                    }
                }
            }
        }


    }


    return (

        <div className="p-account-settings-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-4 md:m-20">

                    <div className="mb-10">
                        <Link to={`/collection/${collectionId}`}> {`< Back to collection`}</Link>
                    </div>

                    <h2 className="text-2xl md:text-5xl u-text-bold mb-8">
                        Edit Collection Details
                    </h2>

                    <br/>

                    <div className="grid grid-cols-12">

                        <div className="col-span-12 lg:col-span-5">


                            <div className="mb-10">

                            <p className="text-xl u-text-bold mb-2">
                                    Logo Image: &nbsp;
                                    <a href="javascript:alert('This image will appear as your collection logo. Resolution: 350 x 350 recommended. Max Size of 5MB.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>

                                <p className="mb-2 text-gray-500 text-sm">
                                    Resolution: 350 x 350 recommended. Max Size of 5MB.
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

                            <br/>

                            <div className="mb-10">

                                 <p className="text-xl u-text-bold mb-2">
                                    Banner Banner: &nbsp;
                                    <a href="javascript:alert('This image will appear at the top of your collection page. Dimensions change on different devices. Resolution: 1400 x 400 recommended. Max Size of 5MB.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
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

                            <br/>

                            <hr className="text-white my-10" />

                            <br/>


                            <form onSubmit={handleSubmitEdit(onSubmit)}>



                            <p className="text-xl u-text-bold mb-2">
                                    Collection Name: &nbsp;
                                    <a href="javascript:alert('The Collection Name to be displayed on the Youbei NFT Marketplace.  Allowed to have spaces and must be not longer than 20 characters.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsEdit.collectionName?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerEdit('collectionName')}  autoComplete="off" type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full" />
                                    </div>
                                </div>


                                <br/>

                                <p className="text-xl u-text-bold mb-2">
                                    Description: &nbsp;
                                    <a href="javascript:alert('The description for the collection to inform users of the details.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                    
                                </p>

                                <p className="mb-2 text-lg text-red-500">{errorsEdit.description?.message}</p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <textarea {...registerEdit('description')} autoComplete="off" placeholder="Tell us about your collection!" className="bg-opacity-10 bg-white border-1 border-gray-500 p-2 placeholder-opacity-10 rounded-2 text-white w-full mb-10" />
                                    </div>
                                </div>




                                <p className="text-xl u-text-bold mb-2">
                                    Links: &nbsp;
                                    <a href="javascript:alert('Links to more web and social media outlets.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>


                                <div className="border-1 border-gray-500  rounded-2 overflow-hidden  mb-8">

                                    <label className="flex align-items-center bg-opacity-10 bg-white p-3">
                                        <input  {...registerEdit('website')} placeholder="http://www.yoursite.io" type="text" className="border-1 bg-transparent placeholder-opacity-10  border-none outline-none  text-white w-full" />
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

                                <br/>


                                <button className="c-button c-button--primary" type="submit">Save</button>

                                <br/><br/>

                            </form>

                            <br/>

                            <hr className="text-white my-10" />

                            <br/>

                            <form onSubmit={handleSubmitMintingStartDate(onSubmitMintingStartDate)}>

                                 <p className="text-xl u-text-bold mb-2">
                                    Minting Start Date (UTC): &nbsp;
                                    <a href="javascript:alert('Minting start date is optional and ony applies to collections that are created on the Youbei Marketplace. It will allow minting to start on the set date at 12:00am UTC and can be applied retroactively. There is a gas fee associated with this feature since it is stored on the blockchain.')"><FontAwesomeIcon className="u-text-theme-blue-anchor " icon={faIcons.faQuestionCircle} /></a>
                                </p>

                                <div className="grid grid-cols-9 mb-4">
                                    <div className="col-span-12">
                                        <input {...registerMintingStartDate('mintStartDate')} id="mintStartDate" onChange={(e) => confirmMintingStartDate()}  autoComplete="off" type="date" className="text-xl bg-opacity-10 bg-white border-1 border-black border-gray-400 p-2 placeholder-opacity-10 rounded-2 text-white w-full p-create-collection_token-ticker" />
                                    </div>
                                </div>


                                <br/>


                                <button className="c-button c-button--primary" type="submit">Sign</button>

                                <br/><br/>



                            </form>

                        </div>

                    </div>

                    <br/>

                    <Footer />  
                    

                </div>


            </div>

        </div>
    );
};

export default CollectionEditPage;

