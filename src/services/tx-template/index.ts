import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'tx-template';

export const txTemplateApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getBuyNftTemplate: builder.mutation<any, { userWalletAddress: string, collectionId: string, tokenNonce: string, price: number }>({

            query: ({ userWalletAddress, collectionId, tokenNonce, price }): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    method: GET,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/buy-nft/${userWalletAddress}/${collectionId}/${tokenNonce}/${price}`
                }

                return customRequestArg;
            },
        }),


        getListNftTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce, price }): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    method: GET,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/list-nft/${userWalletAddress}/${collectionId}/${tokenNonce}/${price}`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const { useGetBuyNftTemplateMutation, useGetListNftTemplateMutation } = txTemplateApi;