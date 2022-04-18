import {
    createApi,
    fetchBaseQuery,
    FetchArgs,
} from "@reduxjs/toolkit/query/react";

import { BASE_URL_API, GET, POST } from "constants/api";

const mainPath = "stats";

export const statsApi = createApi({
    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL_API,
    }),

    endpoints: (builder) => ({
        getTokensCount: builder.mutation<any, any>({
            query: (): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/tokens/totalCount`,
                };

                return customRequestArg;
            },
        }),

        getTransactionsList: builder.mutation<any, any>({
            query: (): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/transactions/list/0/0`,
                };

                return customRequestArg;
            },
        }),

        getTradesCount: builder.mutation<any, any>({
            query: (): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/txCount`,
                };

                return customRequestArg;
            },
        }),

        getDailyTradesCount: builder.mutation<any, any>({
            query: ({ date }): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/txCount/${date}`,
                };

                return customRequestArg;
            },
        }),

        getTotalVolume: builder.mutation<any, any>({
            query: (): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/volume/total`,
                };

                return customRequestArg;
            },
        }),

        getLastWeekVolume: builder.mutation<any, any>({
            query: (): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/volume/lastWeek`,
                };

                return customRequestArg;
            },
        }),
    }),
});

export const {
    useGetTokensCountMutation,
    useGetTransactionsListMutation,
    useGetTradesCountMutation,
    useGetDailyTradesCountMutation,
    useGetTotalVolumeMutation,
    useGetLastWeekVolumeMutation,
} = statsApi;
