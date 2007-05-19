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
    
    return  {
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

export default {
    shorterAddress,
    transactionsUtils,
    handleCopyToClipboard,
    createVerifiedPayload,
}