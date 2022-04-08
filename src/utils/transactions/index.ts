/* eslint-disable */

import {
  Transaction,
  GasPrice,
  Address,
  TransactionPayload,
  Balance,
  ChainID,
  TransactionVersion,
  GasLimit,
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
    value: Balance.egld(value),
    chainID: new ChainID(chainID),
    receiver: new Address(receiver),
    gasLimit: new GasLimit(gasLimit),
    gasPrice: new GasPrice(gasPrice),
    data: new TransactionPayload(data),
    version: new TransactionVersion(version),
  });
};

export default {
  prepareTransaction,
};

export function getQuerystringValue(key: string) {
    const queryString = window.location.search;
    const params = new URLSearchParams(window.location.search)
    return params.get(key)
};