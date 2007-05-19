import transactionsUtils from './transactions';


export const shorterAddress: (address: string, lenghtStart: number, lenghtEnd: number) =>  string = (address, lenghtStart, lenghtEnd) => {

    const addressLenght: number = address.length;

    return `${(address)?.substring(0, lenghtStart)}....${(address)?.substring(addressLenght - lenghtEnd, addressLenght)}`;

}

export default {
    shorterAddress,
    transactionsUtils
}