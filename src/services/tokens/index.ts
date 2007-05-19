import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'tokens';

export const tokensApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getTokenData: builder.query<any, any>({

            query: ({collectionId, tokenNonce}): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/${collectionId}/${tokenNonce}`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const { 
    useGetTokenDataQuery,
    useLazyGetTokenDataQuery } = tokensApi;