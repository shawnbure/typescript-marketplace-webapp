import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'deposits';

export const depositApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getDepositTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${userWalletAddress}`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const {
    useGetDepositTemplateMutation,
} = depositApi;