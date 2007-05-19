import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'search';

export const searchApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getCollectionByName: builder.query<any, any>({

            query: ({ collectionName }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    url: `/${mainPath}/collections/${collectionName}`

                }

                return customRequestArg;
            },
        }),

    }),
})

export const { useGetCollectionByNameQuery, useLazyGetCollectionByNameQuery } = searchApi;