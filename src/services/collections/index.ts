import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import store from 'redux/store/index';
import { BASE_URL_API, POST} from 'constants/api';
import { selectAccessToken } from 'redux/selectors/user';

const reducerPath = 'collections';

export const collectionsApi = createApi({

    reducerPath: reducerPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        createCollection: builder.mutation<any, any>({

            query: ({ }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${reducerPath}`,
                    body: {

                    }

                }

                return customRequestArg;
            },

        }),

        getCollectionByName: builder.query<any, any>({

            query: ({collectionName}): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${reducerPath}/${collectionName}`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const { useGetCollectionByNameQuery, useLazyGetCollectionByNameQuery } = collectionsApi;