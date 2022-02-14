import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import store from 'redux/store/index';
import { BASE_URL_API, ELROND_API, ELROND_GATEWAY_API, GET, POST } from 'constants/api';
import { selectAccessToken } from 'redux/selectors/user';

const mainPath = 'accounts';

export const accountsApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getAccount: builder.mutation<any, any>({

            query: ({ userWalletAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/${userWalletAddress}`
                }

                return customRequestArg;
            },
        }),

        setAccount: builder.mutation<any, any>({

            query: ({ userWalletAddress, payload }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${userWalletAddress}`
                }

                return customRequestArg;
            },

        }),

        setProfileImage: builder.mutation<any, any>({

            query: ({ userWalletAddress, imageB64 }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(imageB64),
                    url: `/${mainPath}/${userWalletAddress}/profile`
                }

                return customRequestArg;
            },
        }),


        setCoverImage: builder.mutation<any, any>({

            query: ({ userWalletAddress, imageB64 }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(imageB64),
                    url: `/${mainPath}/${userWalletAddress}/cover`
                }

                return customRequestArg;
            },
        }),


        getAccountTokens: builder.mutation<any, any>({

            query: ({ userWalletAddress, offset, limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `/${mainPath}/${userWalletAddress}/tokens/${offset}/${limit}`
                }

                return customRequestArg;
            },
        }),


        getAccountTokensOnSale: builder.mutation<any, any>({

            query: ({ userWalletAddress, offset, limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `/${mainPath}/${userWalletAddress}/tokens/onsale/${offset}/${limit}`
                }

                return customRequestArg;
            },
        }),

        getAccountTokenGateway: builder.mutation<any, any>({

            query: ({ userWalletAddress, identifier, nonce }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `${ELROND_GATEWAY_API}/address/${userWalletAddress}/nft/${identifier}/nonce/${nonce}`
                }

                return customRequestArg;
            },
        }),

        getAccountCollections: builder.mutation<any, any>({

            query: ({ userWalletAddress, offset, limit }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `${mainPath}/${userWalletAddress}/collections/${offset}/${limit}`
                
                }

                return customRequestArg;
            },
        }),


        getAccountGatewayTokens: builder.mutation<any, any>({

            query: ({ userWalletAddress, offset, limit  }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `${ELROND_API}/accounts/${userWalletAddress}/nfts?from=${offset}&size=${limit}&type=NonFungibleESDT`
                }

                return customRequestArg;
            },

            transformResponse: async (tokens: Array<any>) => {

                const nfts = tokens.filter((token: any) => {

                    const hasUris: boolean = Boolean(token.uris?.length);
                    
                    return hasUris;

                });

                const allIndentifiers = nfts.map((nft: any) => nft?.identifier);

                let availableTokensData = {};

                await fetch(`${BASE_URL_API}/tokens/available`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tokens: allIndentifiers
                    })
                }).then(response => response.json()).then(availableResponse => {

                    availableTokensData = availableResponse.data.tokens;

                });

                return {
                    nfts,
                    availableTokensData,
                };

            },
        }),


    }),
})

export const {
    useSetCoverImageMutation,
    useGetAccountCollectionsMutation,
    useSetAccountMutation,
    useGetAccountMutation,
    useSetProfileImageMutation,
    useGetAccountTokensMutation,
    useGetAccountTokensOnSaleMutation,
    useGetAccountGatewayTokensMutation,
    useGetAccountTokenGatewayMutation, } = accountsApi;