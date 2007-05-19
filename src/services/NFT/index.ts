import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import buyNFTresponse from './buyNFTresponse';

const BASE_URL = 'https://www.something.com/';

export const NFTQueryAPI = createApi({
    reducerPath: 'compiler',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL
    }),

    endpoints: (builder) => ({

        buyNFT: builder.query<any, any>({

            query: ({
                price,
                tokenId,
                tokenNonce,
                userAddress,
            }) => {

                const buyNFTpath = `template/buy-nft/${userAddress}/${tokenId}/${tokenNonce}/${price}`;
  
                return buyNFTpath;
                
            },

            transformResponse: () => buyNFTresponse,
        }),

    }),

})

export const { useBuyNFTQuery } = NFTQueryAPI;