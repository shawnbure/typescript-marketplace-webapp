import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'tx-template';

export const txTemplateApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getBuyNftTemplate: builder.query<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNone, price }): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/buy-nft/${userWalletAddress}/${collectionId}/${tokenNone}/${price}`
                }

                return customRequestArg;
            },
        }),


        getListNftTemplate: builder.query<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNone, price }): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/list-nft/${userWalletAddress}/${collectionId}/${tokenNone}/${price}`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const { useGetBuyNftTemplateQuery, useLazyGetBuyNftTemplateQuery, useGetListNftTemplateQuery, useLazyGetListNftTemplateQuery } = txTemplateApi;