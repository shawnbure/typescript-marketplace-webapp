/* eslint-disable */

import transactionsUtils from "./transactions";
// import { Address, UserPublicKey, UserVerifier } from '@elrondnetwork/erdjs/out';
import { SignableMessage } from "@elrondnetwork/erdjs/out/signableMessage";
import { Signature } from "@elrondnetwork/erdjs/out/signature";
import { ENG_COPY_TO_CLIPBOARD_MESSAGE } from "constants/messages";
import { toast } from "react-toastify";
import { ELROND_API } from "constants/api";

export const createVerifiedPayload = (
  address: string,
  loginToken: any,
  signature: any,
  data: any
) => {
  const message = address + loginToken + JSON.stringify(data);

  const signedMessage = new SignableMessage({
    message: Buffer.from(message),
    signature: new Signature(Buffer.from(signature, "hex")),
  });

  const verfiedMessage = signedMessage.serializeForSigning().toString("hex");
  
  // Pendo Initializer
  window.pendo.initialize({ visitor: { id: address } })

  return {
    address,
    signature,
    verfiedMessage,
  };
};

export const handleCopyToClipboard = (value: string) => {
  navigator.clipboard.writeText(value);

  toast.success(
    ENG_COPY_TO_CLIPBOARD_MESSAGE,
    {
      autoClose: 5000,
      draggable: true,
      closeOnClick: true,
      pauseOnHover: true,
      hideProgressBar: false,
      position: "bottom-right",
    }
);

};

export const shorterAddress: (
  address: string,
  lenghtStart: number,
  lenghtEnd: number
) => string = (address, lenghtStart, lenghtEnd) => {
  const addressLenght: number = address.length;

  return `${address?.substring(0, lenghtStart)}....${address?.substring(
    addressLenght - lenghtEnd,
    addressLenght
  )}`;
};

export function dec2hex(dec: any) {
  return dec.toString(16).padStart(2, "0");
}

// generateId :: Integer -> String
export function generateId(len: number) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}

export function hexToAscii(str1: string) {
  var hex = str1.toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
}

export function asciiToHex(str1: string) {
  var arr1 = [];

  for (var n = 0, l = str1.length; n < l; n++) {
    var hex = Number(str1.charCodeAt(n)).toString(16);
    arr1.push(hex);
  }

  return arr1.join("");
}

export const formatImgLink = (url: string) => {
  if (url.includes("gateway.pinata.cloud")) {
    let newUrl = url.replace(/(https:|)(^|\/\/)(.*?\/)/g, "https://ipfs.io/");

    return newUrl;
  }

  return url;
};
export function formatHexMetaImage(str1: string) {
  let twoParts = str1.split("/");
  var hex = twoParts[0].toString();
  var str = "";
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  str += "/" + twoParts[1];
  return str;
}

export function GetTransactionRequestHttpURL(txHash: string) {
  return ELROND_API + "/transactions/" + txHash;
}

export function GetTokenRequestHttpURL(tokenIdentifier: string) {
  return ELROND_API + "/nfts/" + tokenIdentifier;
}

export function GetJSONResultData(jsonParse: any) {
  return jsonParse["results"][0]["data"];
}

export function GetTransactionActionName(jsonParse: any) {
  return jsonParse["action"]["name"];
}

export function GetTransactionTokenID(resultData: string) {
  const asciiOfBase64Result = atob(resultData);
  const arraySplit = asciiOfBase64Result.split("@");

  const tokenIDHexed = arraySplit[2];

  return hexToAscii(tokenIDHexed);
}

export function GetTransactionContractAddress(resultData: string) {
  const asciiOfBase64Result = atob(resultData);
  const arraySplit = asciiOfBase64Result.split("@");

  const contractAddress = arraySplit[2];

  return contractAddress;
}

export function GetTransactionErdContractAddress(jsonParse: any) {
  return jsonParse["logs"]["events"][0]["address"];
}

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts:any = value.split(`; ${name}=`);
  if (parts.length === 2)
  return parts.pop().split(';').shift()
}

export function setCookie(name: string, value: any, expires: string) {
  document.cookie = `${name}=${value}; expires=${expires}`
}

export function isMobile() {
  return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
}

export default {
  hexToAscii,
  asciiToHex,
  shorterAddress,
  transactionsUtils,
  handleCopyToClipboard,
  createVerifiedPayload,
  GetTransactionRequestHttpURL,
  GetTokenRequestHttpURL,
  GetJSONResultData,
  GetTransactionActionName,
  GetTransactionTokenID,
};