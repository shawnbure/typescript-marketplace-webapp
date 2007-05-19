import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, POST } from 'constants/api';

const mainPath = 'auth';

export const authApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getAuthToken: builder.query<any, any>({

            query: (): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${mainPath}/access`,

                }

                return customRequestArg;
            },

        }),

        getRefreshToken: builder.query<any, any>({

            query: (): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${mainPath}/refresh`,

                }

                return customRequestArg;
            },

        }),

    }),
})

export const { useGetAuthTokenQuery, useLazyGetRefreshTokenQuery, useGetRefreshTokenQuery, useLazyGetAuthTokenQuery } = authApi;