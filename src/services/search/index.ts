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

        searchByString: builder.mutation<any, any>({

            query: ({ searchString }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `/${mainPath}/${searchString}`

                }

                return customRequestArg;
                
            },
        }),

    }),
})

export const { useSearchByStringMutation, useGetCollectionByNameQuery, useLazyGetCollectionByNameQuery ,} = searchApi;