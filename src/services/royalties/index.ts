import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'royalties';

export const royaltiesApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getRoyaltiesAmountTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${userWalletAddress}/amount`
                }

                return customRequestArg;
            },
        }),

        getRoyaltiesLastTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${userWalletAddress}/last`
                }

                return customRequestArg;
            },
        }),


        getRoyaltiesRemainingTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${userWalletAddress}/remaining`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const {

    useGetRoyaltiesLastTemplateMutation,
    useGetRoyaltiesAmountTemplateMutation,
    useGetRoyaltiesRemainingTemplateMutation,

} = royaltiesApi;