import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import store from 'redux/store/index';
import { BASE_URL_API, GET, POST } from 'constants/api';
import { selectAccessToken } from 'redux/selectors/user';

const mainPath = 'sessionStates';

export const sessionStatesApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        createSessionStates: builder.mutation<any, any>({

            query: ({ payload }): FetchArgs => {

                
                console.log("payload JSON: " + JSON.stringify(payload))

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

        deleteSessionStatesByAccountIdByStateType: builder.mutation<any, any>({

            query: ({ accountId, stateType, payload }): FetchArgs => {

                
                console.log("payload JSON: " + JSON.stringify(payload))

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `${mainPath}/delete/${accountId}/${stateType}`

                }

                return customRequestArg;
            },

        }),


    }),
})

export const {
    useCreateSessionStatesMutation, 
    useDeleteSessionStatesByAccountIdByStateTypeMutation, } = sessionStatesApi;