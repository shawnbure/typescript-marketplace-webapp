/* eslint-disable */ 
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
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



export const DaoPage = () => {



    // CONSTANT: #1
    const [count] = useState(100);   //initial with 100


    //AGE VARIABLE: #2
    //const [stateValue, updaterFn] = useState(initialStateValue);
    const [age, setAge] = useState(19);  //initial with 19
    const handleClick = () => { setAge(age + 1); } //modified



    useEffect(() => {
        
        console.log("useeffect will only run once")
        
      },[]);   //if we put the [], it call useEffect only once


      useEffect(() => {
        
        console.log("======= Age changed ======== " + age)

      },[age]);





    return (
        <div className="text-gray-500 text-center u-text-bold col-span-12 mr-8 mb-8">

            DAO Page
          
           {/* CONSTANT: #1 */}
            <div> 
                State variable is {count}
            </div>

            <br/><br/>


            {/* AGE VARIABLE: #2 */}
            <div>                
                Today I am {age} Years of Age <br/>
                <button onClick={handleClick}>Get older! </button>
            </div>



        </div>
      
    );
};

export default DaoPage;