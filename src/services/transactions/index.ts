import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET, POST } from 'constants/api';
import { selectAccessToken } from 'redux/selectors/user';
import store from 'redux/store';

const mainPath = 'transactions';

export const tokensApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getTxHash: builder.mutation<any, any>({

            query: ({ txHash }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `/${mainPath}/${txHash}`

                }

                return customRequestArg;

            },
        }),




    }),
})

export const {
    useGetTxHashMutation } = tokensApi;