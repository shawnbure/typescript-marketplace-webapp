/* eslint-disable */

import {
  Transaction,
  Address,
  TransactionPayload,
  TransactionVersion,
  TokenPayment,
} from "@elrondnetwork/erdjs";

import { RawTransactionInterface } from "./interfaces";

export const prepareTransaction: (
  rawTransaction: RawTransactionInterface,
) => any = ({
  data,
  value,
  version,
  chainID,
  receiver,
  gasLimit,
  gasPrice
}) => {
  return new Transaction({
    value: TokenPayment.egldFromAmount(value),
    chainID: chainID,
    receiver: new Address(receiver),
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    data: new TransactionPayload(data),
    version: new TransactionVersion(version),
  });
};

export default {
  prepareTransaction,
};

export function getQuerystringValue(queryString: string, key: string) {
    const params = new URLSearchParams(queryString)
    return params.get(key)
};