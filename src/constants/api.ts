export const BASE_URL_API: string = process.env.REACT_APP_NODE_ENV == 'development' ? 'https://dev-api.youbei.io' : process.env.REACT_APP_NODE_ENV == 'production' ? 'https://api.youbei.io' : 'http://localhost:5000';
export const ELROND_API: string = process.env.REACT_APP_NODE_ENV == 'development' ? 'https://testnet-api.elrond.com' : process.env.REACT_APP_NODE_ENV == 'production' ? 'https://api.elrond.com' : 'https://devnet-api.elrond.com'; 
export const ELROND_GATEWAY_API: string =  process.env.REACT_APP_NODE_ENV == 'development' ? 'https://testnet-gateway.elrond.com' : process.env.REACT_APP_NODE_ENV == 'production' ? 'https://gateway.elrond.com' : 'https://devnet-gateway.elrond.com'; 
export const ELROND_WALLET: string = process.env.REACT_APP_NODE_ENV == 'development' ? 'https://testnet-wallet.elrond.com' : process.env.REACT_APP_NODE_ENV == 'production' ? 'https://wallet.elrond.com': 'https://devnet-wallet.elrond.com'; 
export const ELROND_EXPLORER: string = process.env.REACT_APP_NODE_ENV == 'development' ? 'http://testnet-explorer.elrond.com/': process.env.REACT_APP_NODE_ENV == 'production' ?'http://explorer.elrond.com/':'http://devnet-explorer.elrond.com/'; 
export const ELROND_ID: string = process.env.REACT_APP_NODE_ENV == 'development' ? 'testnet': process.env.REACT_APP_NODE_ENV == 'production' ? 'mainnet':'devnet'; 
export const ELROND_EGLD_LABEL: string = process.env.REACT_APP_NODE_ENV == 'development' ? 'xEGLD': process.env.REACT_APP_NODE_ENV == 'production' ? 'EGLD':'xEGLD'; 


console.log(process.env.REACT_APP_NODE_ENV)
console.log(BASE_URL_API)
export const GET = 'GET';
export const PUT: string = 'PUT';
export const POST = 'POST';
export const PATCH = 'PATCH';
