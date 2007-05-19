import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const compiler = createApi({
    reducerPath: 'compiler',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
    endpoints: (builder) => ({

        getFile: builder.query<string,string>({
            query: () => `todos/1`,
            transformResponse: () => ``
        }),

    }),
})

export const { useGetFileQuery } = compiler;