import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import store from 'redux/store/index';
import { BASE_URL_API, ELROND_API, GET, POST } from 'constants/api';
import { selectAccessToken } from 'redux/selectors/user';

const mainPath = 'accounts';

export const accountsApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getAccount: builder.mutation<any, any>({

            query: ({ userAddress }): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {
                    method: GET,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/${userAddress}`
                }

                return customRequestArg;
            },
        }),


        setAccount: builder.mutation<any, any>({

            query: ({ userAddress, payload }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                    url: `/${mainPath}/${userAddress}`
                }

                return customRequestArg;
            },
        }),



        setProfileImage: builder.mutation<any, any>({

            query: ({ userAddress, imageB64 }): FetchArgs => {

                const accessToken: string = selectAccessToken(store.getState());

                const customRequestArg: FetchArgs = {
                    method: POST,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(imageB64),
                    url: `/${mainPath}/${userAddress}/profile`
                }

                return customRequestArg;
            },
        }),


        getAccountTokens: builder.mutation<any, any>({

            query: ({ userAddress, offset, limit }): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {

                    method: GET,
                    headers: {

                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `/${mainPath}/${userAddress}/tokens/${offset}/${limit}`
                }

                return customRequestArg;
            },
        }),


        getAccountGatewayTokens: builder.mutation<any, any>({

            query: ({ userAddress }): FetchArgs => {

                const accessToken: string = 'admin';

                const customRequestArg: FetchArgs = {

                    method: GET,
                    headers: {

                        "Authorization": `Bearer ${accessToken}`,
                    },
                    url: `${ELROND_API}/accounts/${userAddress}/nfts`
                }

                return customRequestArg;
            },

            transformResponse: async (tokens: Array<any>) => {

                const nfts = tokens.filter((token: any) => {

                    const hasUris: boolean = Boolean(token.uris?.length);
                    const isNft: boolean = token.type === "NonFungibleESDT";

                    return hasUris && isNft;

                });

                const erdNfts: any = [];
                const restNfts: any = [];

                for (let index = 0; index < nfts.length; index++) {

                    const nft = nfts[index];
                    const { nonce, uris } = nft;
                    const secondUrlB64 = uris?.[1];
                    const hasSecondURL: boolean = Boolean(secondUrlB64);

                    if (!hasSecondURL) {

                        restNfts.push(nft);
                        continue;

                    };

                    const secondUrl = window.atob(secondUrlB64);

                    await fetch(`${secondUrl}`)
                        .then(response => response.json())
                        .then(metadata => {

                            const isErd721 = Boolean(metadata?.attributes);

                            if (isErd721) {

                                erdNfts.push(nft);

                            } else {

                                restNfts.push(nft);

                            }

                        }).catch(() => {

                            restNfts.push(nft);

                        });

                };


                // for (let index = 0; index < erdNfts .length; index++) {

                //     const nft = erdNfts[index];

                // }

                const erdNftsCollectionIds = erdNfts.map((nft: any) => nft?.identifier);
                const restNftsCollectionIds = restNfts.map((nft: any) => nft?.identifier);
                const allIndentifiers = [...erdNftsCollectionIds, ...restNftsCollectionIds];

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
                    erdNfts,
                    restNfts,
                    availableTokensData,
                };

            },
        }),


    }),
})

export const {
    useSetAccountMutation,
    useGetAccountMutation,
    useSetProfileImageMutation,
    useGetAccountTokensMutation,
    useGetAccountGatewayTokensMutation } = accountsApi;