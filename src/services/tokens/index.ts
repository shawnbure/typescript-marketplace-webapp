import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';
import { BASE_URL_API, GET, POST } from 'constants/api';
import { selectAccessToken } from 'redux/selectors/user';
import store from 'redux/store';

const mainPath = 'tokens';

export const tokensApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    //this is the endpoint call for the GOLANG API

    endpoints: (builder) => ({

        createToken: builder.mutation<any, any>({

            query: ({ payload }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                //console.log("TOKEN:" + store.getState())

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `${mainPath}/create/${payload.walletAddress}/${payload.tokenName}/${payload.tokenNonce}`

                }

                return customRequestArg;
            },

        }),


        getTokenData: builder.mutation<any, any>({

            query: ({ collectionId, tokenNonce }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `/${mainPath}/${collectionId}/${tokenNonce}`

                }

                return customRequestArg;

            },
        }),


        getTokenCollectionAvailablity: builder.mutation<any, any>({

            query: ({ indentifier }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${mainPath}/available`,
                    body: JSON.stringify({
                        tokens: [indentifier]
                    })

                }

                return customRequestArg;

            },
        }),


        getTokensCollectionsAvailablity: builder.mutation<any, any>({

            query: ({ indentifiers }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${mainPath}/available`,
                    body: JSON.stringify({
                        tokens: indentifiers
                    })

                }

                return customRequestArg;

            },
        }),

        getTokenOffers: builder.mutation<any, any>({

            query: ({ collectionId, tokenNonce, offset, limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `${mainPath}/${collectionId}/${tokenNonce}/offers/${offset}/${limit}`

                }

                return customRequestArg;

            },

        }),

        getTokenBids: builder.mutation<any, any>({

            query: ({ collectionId, tokenNonce, offset, limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `${mainPath}/${collectionId}/${tokenNonce}/bids/${offset}/${limit}`

                }

                return customRequestArg;

            },

        }),

        getTransactions: builder.mutation<any, any>({

            query: ({ collectionId, tokenNonce, offset, limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `transactions/token/${collectionId}/${tokenNonce}/${offset}/${limit}`

                }

                return customRequestArg;

            },

        }),

        // getTokenMetadata: builder.query<any, any>({

        //     query: ({ metadataLink }): FetchArgs => {

        //         const customRequestArg: FetchArgs = {

                    
        //             method: GET,
        //             url: metadataLink,
        //             headers: {
        //                 'Access-Control-Allow-Origin':'*',
        //                 'Access-Control-Allow-Methods':'GET',
        //                 'Access-Control-Allow-Headers':'application/json',
        //             }

        //         }

        //         return customRequestArg;

        //     },

        // }),



        getTokenMetadata: builder.mutation<any, any>({

            query: ({ metadataLink }): FetchArgs => {

                const metadataUrlEncode = encodeURIComponent(metadataLink.replace(/\s+/g, ''));
            
                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `${mainPath}/metadata/relay?url=${metadataUrlEncode}`,
                }

                return customRequestArg;
                
            },
        }),


        
        refreshTokenMetadata: builder.mutation<any, any>({

            query: ({ collectionId, tokenNonce }): FetchArgs => {


                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `${mainPath}/${collectionId}/${tokenNonce}/refresh`,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },

                }

                return customRequestArg;

            },

        }),



    }),
})


export const {
    useCreateTokenMutation,
    useRefreshTokenMetadataMutation,
    useGetTransactionsMutation,
    useGetTokenMetadataMutation,
    useGetTokenBidsMutation,
    useGetTokenOffersMutation,
    useGetTokenDataMutation,
    useGetTokenCollectionAvailablityMutation,
    useGetTokensCollectionsAvailablityMutation } = tokensApi;