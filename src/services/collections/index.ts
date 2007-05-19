import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'collections';

export const collectionsApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getCollectionByName: builder.query<any, any>({

            query: ({collectionName}): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/${collectionName}`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const { useGetCollectionByNameQuery, useLazyGetCollectionByNameQuery } = collectionsApi;