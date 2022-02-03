import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import store from 'redux/store/index';
import { BASE_URL_API, GET, POST } from 'constants/api';
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
                    url: `/create/${mainPath}`

                }

                return customRequestArg;
            },

        }),


        updateCollection: builder.mutation<any, any>({

            query: ({ collectionId, payload }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${collectionId}`

                }

                return customRequestArg;
            },

        }),

        saveCollectionProfileImage: builder.mutation<any, any>({

            query: ({ collectionId, imageB64 }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(imageB64),
                    url: `/${mainPath}/${collectionId}/profile`
                }

                return customRequestArg;

            },

        }),

        saveCollectionCoverImage: builder.mutation<any, any>({

            query: ({ collectionId, imageB64 }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(imageB64),
                    url: `/${mainPath}/${collectionId}/cover`
                }

                return customRequestArg;

            },

        }),

        getCollectionById: builder.mutation<any, any>({

            query: ({ collectionId }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${collectionId}`
                }

                return customRequestArg;
            },
        }),

        registerCollection: builder.mutation<any, any>({

            query: ({ userWalletAddress, payload }): FetchArgs => {

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

        getCollectionsRankings: builder.mutation<any, any>({

            query: ({ collectionId, offset, limit, filters = {}, sortRules = {} }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${mainPath}/rankings/${offset}/${limit}`,
                    body: JSON.stringify({
                        sortRules: {
                            "criteria": "volumeTraded",
                            "mode": "desc"
                        },
                    })
                }

                return customRequestArg;
            },
        }),

        getCollectionTokens: builder.mutation<any, any>({

            query: ({ collectionId, offset, limit, filters = {}, sortRules = {} }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${mainPath}/${collectionId}/tokens/${offset}/${limit}`,
                    body: JSON.stringify({
                        filters: filters,
                        sortRules: sortRules,
                    })
                }

                return customRequestArg;
            },
        }),


        getCollectionInfo: builder.mutation<any, any>({

            query: ({ collectionId }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `/${mainPath}/${collectionId}/mintInfo`,
                }

                return customRequestArg;
            },
        }),


    }),
})

export const {
    useGetCollectionInfoMutation,
    useGetCollectionsRankingsMutation,
    useSaveCollectionCoverImageMutation,
    useSaveCollectionProfileImageMutation,
    useUpdateCollectionMutation,
    useGetCollectionTokensMutation,
    useRegisterCollectionMutation,
    useCreateCollectionMutation,
    useGetCollectionByIdMutation, } = collectionsApi;