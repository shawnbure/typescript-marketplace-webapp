export interface RawTransactionInterface {
    
    data: string;
    value: string;
    receiver: string;
    gasPrice: number;
    gasLimit: number;
    chainID: string;
    version: number;
    
}
