/* eslint-disable */ 
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



export const DaoPage = () => {

    useEffect(() => {
        
        console.log("useeffect")
      }); 

    return (
        <div className="p-account-settings-page">
            dao page
        </div>
    );
};

export default DaoPage;