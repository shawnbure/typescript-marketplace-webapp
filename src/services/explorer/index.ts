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
            query: ({
                lastTimestamp,
                currentPage,
                nextPage,
                priceNominalFilter = "0",
                priceSortFilter = "More",
                typeFilter = "List",
                collectionFilter = "",
                sortTypeFilter = "desc",
                statusFilter = "true",
            }): FetchArgs => {
                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/all/${lastTimestamp}/${currentPage}/${nextPage}?filter=price_nominal|${priceNominalFilter}|${
                        priceSortFilter == "More" ? ">" : "<"
                    }%3BAND%3Bstatus%7C${typeFilter}%7C=${
                        collectionFilter.length
                            ? `%3BAND%3Bcollection_id%7C${collectionFilter}%7C%3D`
                            : ``
                    }&sort=last_market_timestamp|${sortTypeFilter}&limit=30${
                        statusFilter == "true"
                            ? `&collectionFilter=is_verified|true|=`
                            : ``
                    }`,
                };

                return customRequestArg;
            },
        }),
    }),
});

export const { useGetExplorationItemsMutation } = explorerApi;
