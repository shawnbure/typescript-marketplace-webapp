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
            query: ({
                timestamp,
                currentPage,
                nextPage,
                filters,
            }): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/all/${timestamp}/${currentPage}/${nextPage}?filter=${filters}&limit=30`,
                };

                console.log(customRequestArg);

                return customRequestArg;
            },
        }),
    }),
});

export const { useGetActivitiesLogMutation } = activityApi;
