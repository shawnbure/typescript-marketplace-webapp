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
                    url: `${mainPath}/create`

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

        
        UpdateCollectionMintStartDate: builder.mutation<any, any>({

           

            query: ({ collectionId, payload }): FetchArgs => {


                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${collectionId}/mintStartDate`

                }

                return customRequestArg;
            },

        }),



        UpdateCollectionAdminSection: builder.mutation<any, any>({

        
            query: ({ collectionId, payload }): FetchArgs => {


                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${collectionId}/adminSection`

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

        stakeCollection: builder.mutation<any, any>({

            query: ({ payload }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const stakeOnOff = payload.isStakeable ? 'stake' : 'unstake';

                const customRequestArg: FetchArgs = {
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${payload.collectionId}/${stakeOnOff}`
                }

                return customRequestArg;

            },

        }),

        getCollectionById: builder.mutation<any, any>({
            query: ({ collectionId }): FetchArgs => {
                console.log("query getCollectionById")

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${collectionId}`
                }

                return customRequestArg;
            },
        }),


        getAllCollection: builder.mutation<any, any>({

            query: ({payload}): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: POST,
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/all`
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

            query: ({ collectionId, offset, limit, filters = {}, sortRules = {}, onSaleFlag, onStakeFlag, queryFilters }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: POST,
                    url: `/${mainPath}/${collectionId}/tokens/${offset}/${limit}`,
                    body: JSON.stringify({
                        filters: filters,
                        sortRules: sortRules,
                        onSaleFlag: onSaleFlag,
                        onStakeFlag: onStakeFlag,
                        queryFilters: queryFilters,
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


        
        getCollectionVerified: builder.mutation<any, any>({

            query: ({ limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/verified/${limit}`
                }

                return customRequestArg;
            },
        }), 
        

        getCollectionNoteworthy: builder.mutation<any, any>({

            query: ({ limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/noteworthy/${limit}`
                }

                return customRequestArg;
            },
        }), 
        
        getCollectionTrending: builder.mutation<any, any>({

            query: ({ limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/trending/${limit}`
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
    useUpdateCollectionMintStartDateMutation,
    useUpdateCollectionAdminSectionMutation,
    useGetCollectionTokensMutation,
    useRegisterCollectionMutation,
    useCreateCollectionMutation,
    useGetCollectionByIdMutation, 
    useGetAllCollectionMutation,
    useGetCollectionVerifiedMutation,
    useGetCollectionNoteworthyMutation,
    useGetCollectionTrendingMutation, 
    useStakeCollectionMutation} = collectionsApi; 