import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, POST } from 'constants/api';

const reducerPath = 'auth';

export const authApi = createApi({

    reducerPath: reducerPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getAccessToken: builder.query<any, void>({

            query: () => ({
                method: 'POST',
                url: `/${reducerPath}/access`,
            }),

        }),

        getRefreshToken: builder.query<any, any>({

            query: (): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${reducerPath}/refresh`,

                }

                return customRequestArg;

            },

        }),

    }),
})

export const { 
    useGetAccessTokenQuery,
    useGetRefreshTokenQuery,
    useLazyGetAccessTokenQuery,
    useLazyGetRefreshTokenQuery, } = authApi;