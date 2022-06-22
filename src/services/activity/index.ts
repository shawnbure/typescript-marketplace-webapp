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
                typeFilter = "List",
                collectionFilter = "",
                verifiedItems = "true",
            }): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/all/${timestamp}/${currentPage}/${nextPage}?${
                        typeFilter.length
                            ? `filter=type%7C${typeFilter}%7C%3D`
                            : "filter=type%7CList%7C%3D"
                    }${
                        collectionFilter.length
                            ? `%3BAND%3Bcollection_id%7C${collectionFilter}%7C%3D`
                            : ``
                    }${
                        verifiedItems == "true"
                            ? `&collectionFilter=is_verified|true|=`
                            : ``
                    }&limit=30`,
                };

                return customRequestArg;
            },
        }),
    }),
});

export const { useGetActivitiesLogMutation } = activityApi;
