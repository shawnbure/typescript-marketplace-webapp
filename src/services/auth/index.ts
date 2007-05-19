import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, POST } from 'constants/api';

const reducerPath = 'auth';

export const authApi = createApi({

    reducerPath: reducerPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getAccessToken: builder.mutation<any, void>({
            
            query: ({
                address,
                signature,
                verfiedMessage,
            }: any): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${reducerPath}/access`,
                    body: {
                        address,
                        signature,
                        message: verfiedMessage,
                    }

                }

                return customRequestArg;

            },


        }),

        getRefreshToken: builder.mutation<any, any>({

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
    useGetAccessTokenMutation,
    useGetRefreshTokenMutation } = authApi;