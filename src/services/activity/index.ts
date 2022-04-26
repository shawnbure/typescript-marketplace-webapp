import {
    createApi,
    fetchBaseQuery,
    FetchArgs,
} from "@reduxjs/toolkit/query/react";

import { BASE_URL_API, GET, POST } from "constants/api";

const mainPath = "activities";

export const activityApi = createApi({
    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL_API,
    }),

    endpoints: (builder) => ({
        
        getActivitiesLog: builder.mutation<any, any>({
            query: (): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/all/0/0`,
                };

                return customRequestArg;
            },
        }),
        
    }),
});

export const {
    useGetActivitiesLogMutation,
} = activityApi;
