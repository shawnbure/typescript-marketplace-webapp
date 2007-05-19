import transactionsUtils from './transactions';
import { Address, UserPublicKey, UserVerifier } from '@elrondnetwork/erdjs/out';
import { SignableMessage } from '@elrondnetwork/erdjs/out/signableMessage';
import { Signature } from '@elrondnetwork/erdjs/out/signature';


export const createVerifiedPayload = (address: string, loginToken: string, signature: string, data: any) => {

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



export default {
    shorterAddress,
    transactionsUtils,
    handleCopyToClipboard,
    createVerifiedPayload,
}