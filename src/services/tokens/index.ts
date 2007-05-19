import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET, POST } from 'constants/api';

const mainPath = 'tokens';

export const tokensApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

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

        getTokenMetadata: builder.mutation<any, any>({

            query: ({ metadataLink }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: metadataLink

                }

                return customRequestArg;

            },

        }),



    }),
})


export const {
    useGetTransactionsMutation,
    useGetTokenMetadataMutation,
    useGetTokenBidsMutation,
    useGetTokenOffersMutation,
    useGetTokenDataMutation,
    useGetTokenCollectionAvailablityMutation,
    useGetTokensCollectionsAvailablityMutation } = tokensApi;