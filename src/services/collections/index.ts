import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import store from 'redux/store/index';
import { BASE_URL_API, GET, POST} from 'constants/api';
import { selectAccessToken } from 'redux/selectors/user';

const mainPath = 'collections';

export const collectionsApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        createCollection: builder.mutation<any, any>({

            query: ({ payload }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                  
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/create`

                }

                return customRequestArg;
            },

        }),

        getCollectionById: builder.mutation<any, any>({

            query: ({collectionId}): FetchArgs => {
                
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${collectionId}`
                }

                return customRequestArg;
            },
        }),

        registerCollection: builder.mutation<any, any>({

            query: ({ userWalletAddress, payload}): FetchArgs => {
                
                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${userWalletAddress}`

                }

                return customRequestArg;
            },

        }),

    }),
})

export const { 
    useRegisterCollectionMutation,
    useCreateCollectionMutation,
    useGetCollectionByIdMutation, } = collectionsApi;