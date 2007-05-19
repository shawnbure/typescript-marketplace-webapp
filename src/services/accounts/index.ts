import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API } from 'constants/api';

const mainPath = 'accounts';

export const accountsApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getAccount: builder.query<any, any>({

            query: ({ userAddress }): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/${userAddress}`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const { useGetAccountQuery, useLazyGetAccountQuery } = accountsApi;