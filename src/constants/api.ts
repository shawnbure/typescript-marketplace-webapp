export const BASE_URL_API: string = process.env.NODE_ENV == 'development' ? 'https://dev-api.youbei.io' : process.env.NODE_ENV == 'production' ? 'https://api.youbei.io' : 'http://localhost:5000';
export const ELROND_API: string = process.env.NODE_ENV == 'development' ? 'https://devnet-api.elrond.com' : process.env.NODE_ENV == 'production' ? 'https://api.elrond.com' : 'https://testnet-api.elrond.com'; 
export const ELROND_GATEWAY_API: string =  process.env.NODE_ENV == 'development' ? 'https://devnet-gateway.elrond.com' : process.env.NODE_ENV == 'production' ? 'https://gateway.elrond.com' : 'https://testnet-gateway.elrond.com'; 

export const GET = 'GET';
export const PUT: string = 'PUT';
export const POST = 'POST';
export const PATCH = 'PATCH';
