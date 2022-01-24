import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import store from 'redux/store/index';
import { BASE_URL_API, GET, POST } from 'constants/api';
import { selectAccessToken } from 'redux/selectors/user';

const mainPath = 'whitelists';


export const whitelistsApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({
    
        getWhitelistByAddress: builder.mutation<any, any>({

            /*
            query: ({ address }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${address}`          //Note: Define whitelistByAddress = "/:address" (api>proxy>handler)
                }

                return customRequestArg;
            },
            */

            query: ({ address, payload }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${address}`            //Note: Define whitelistByAddress = "/:address" (api>proxy>handler)

                }

                return customRequestArg;
            },

        }),

        setAmountByAddress: builder.mutation<any, any>({

            query: ({ address, amount, payload }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {

                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${address}/${amount}`            //Note: Define whitelistByAddressAmount = "/:address/:amount" (api>proxy>handler)

                }

                return customRequestArg;
            },

        }), 
                
    }),
})    

export const {
    useGetWhitelistByAddressMutation, 
    useSetAmountByAddressMutation, } = whitelistsApi;