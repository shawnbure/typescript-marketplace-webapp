/* eslint-disable */ 
import transactionsUtils from './transactions';
// import { Address, UserPublicKey, UserVerifier } from '@elrondnetwork/erdjs/out';
import { SignableMessage } from '@elrondnetwork/erdjs/out/signableMessage';
import { Signature } from '@elrondnetwork/erdjs/out/signature';
import { string } from 'yup';


export const createVerifiedPayload = (address: string, loginToken: any, signature: any, data: any) => {

    const message = address + loginToken + JSON.stringify(data);

    const signedMessage = new SignableMessage({
        message: Buffer.from(message),
        signature: new Signature(Buffer.from(signature, "hex")),
    });

    const verfiedMessage = signedMessage.serializeForSigning().toString("hex");

    return {
        address,
        signature,
        verfiedMessage,
    };

}


export const handleCopyToClipboard = (value: string) => {

    navigator.clipboard.writeText(value);

}

export const shorterAddress: (address: string, lenghtStart: number, lenghtEnd: number) => string = (address, lenghtStart, lenghtEnd) => {

    const addressLenght: number = address.length;

    return `${(address)?.substring(0, lenghtStart)}....${(address)?.substring(addressLenght - lenghtEnd, addressLenght)}`;

}


export function dec2hex(dec: any) {
    return dec.toString(16).padStart(2, "0")
}

// generateId :: Integer -> String
export function generateId(len: number) {
    var arr = new Uint8Array((len || 40) / 2)
    window.crypto.getRandomValues(arr)
    return Array.from(arr, dec2hex).join('')
}


export function hexToAscii(str1: string) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}


export function asciiToHex(str1: string)
{
    var arr1 = []

    for( var n=0, l=str1.length; n < l; n++)
    {
        var hex = Number(str1.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }

    return arr1.join('');
}

export const formatImgLink = (url: string) => {

    if (url.includes("gateway.pinata.cloud")) {
    
        let newUrl = url.replace(/(https:|)(^|\/\/)(.*?\/)/g, 'https://ipfs.io/');

        return newUrl;

    }

    return url;
}


export default {
    hexToAscii,
    asciiToHex,
    shorterAddress,
    transactionsUtils,
    handleCopyToClipboard,
    createVerifiedPayload,
}

