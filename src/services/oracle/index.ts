import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'oracle';

export const oracleApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getEgldPrice: builder.query<any, any>({

            query: (): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/egld_price`
                }

                return customRequestArg;
            },
        }),

    }),
})

export const { useGetEgldPriceQuery, useLazyGetEgldPriceQuery } = oracleApi;