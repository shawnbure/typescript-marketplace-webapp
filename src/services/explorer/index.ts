import {
    createApi,
    fetchBaseQuery,
    FetchArgs,
} from "@reduxjs/toolkit/query/react";

import { BASE_URL_API, GET, POST } from "constants/api";

const mainPath = "explorer";

export const explorerApi = createApi({
    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL_API,
    }),

    endpoints: (builder) => ({
        
        getExplorationItems: builder.mutation<any, any>({
            query: ({lastTimestamp, currentPage, nextPage, filters}): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/all/${lastTimestamp}/${currentPage}/${nextPage}?filter=${filters}`,
                };
                return customRequestArg;
            },
        }),
        
    }),
});

export const {
    useGetExplorationItemsMutation,
} = explorerApi;
