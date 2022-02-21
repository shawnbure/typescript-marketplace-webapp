// DEVNET

import * as Dapp from '@elrondnetwork/dapp';
import * as consts from '../constants/api'
export const dAppName = 'Youbei';
export const decimals = 2;
export const denomination = 18;
export const gasPrice = 1000000000;
export const version = 1;
export const gasLimit = 50000;
export const gasPerDataByte = 1500;

export const walletConnectBridge = 'https://bridge.walletconnect.org';
export const walletConnectDeepLink =
  'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet.dev&link=https://maiar.com/';

export const contractAddress = 'erd1qqqqqqqqqqqqqpgqhz4g5t6n7qkdupykngtp69ynw7ghcccry4wsx6423a';

export const network: Dapp.NetworkType = {
  id: consts.ELROND_ID,
  name: consts.ELROND_ID,
  egldLabel: consts.ELROND_ID,
  apiAddress: consts.ELROND_API,
  walletAddress: consts.ELROND_WALLET,
  gatewayAddress: consts.ELROND_GATEWAY_API,
  explorerAddress: consts.ELROND_EXPLORER,
};



//MAINNET
/*

import * as Dapp from '@elrondnetwork/dapp';

export const dAppName = 'Erdsea';
export const decimals = 2;
export const denomination = 18;
export const gasPrice = 1000000000;
export const version = 1;
export const gasLimit = 50000;
export const gasPerDataByte = 1500;


export const walletConnectBridge = 'https://bridge.walletconnect.org';
export const walletConnectDeepLink =
  'https://maiar.page.link/?apn=com.elrond.maiar.wallet&isi=1519405832&ibi=com.elrond.maiar.wallet.dev&link=https://maiar.com/';

export const contractAddress = 'erd1qqqqqqqqqqqqqpgquvt728n40ssd8n2qns9jrlqpwq2jc4rj4cysfuj3ad';

export const network: Dapp.NetworkType = {
  id: 'mainnet',
  name: 'Mainnet',
  egldLabel: 'EGLD',
  apiAddress: 'https://api.elrond.com',
  walletAddress: 'https://wallet.elrond.com',
  gatewayAddress: 'https://gateway.elrond.com',
  explorerAddress: 'http://explorer.elrond.com/',
};
*/