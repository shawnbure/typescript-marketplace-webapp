import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, ELROND_API, GET } from 'constants/api';

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
                    const lastURI = window.atob(uris.at(-1));

                    await fetch(`${lastURI}/${nonce}`)
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


                // await fetch(`${BASE_URL_API}/tokens/available`, {
                //     method: "POST",
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({
                //         tokens: erdNftsCollectionIds
                //     })
                // }).then(response => response.json()).then(availableTokensData => {

                //     console.log({
                //         availableTokensData
                //     });

                // });

                console.log({
                    erdNfts,
                    restNfts,
                    erdNftsCollectionIds
                });


                return {
                    erdNfts,
                    restNfts
                };

            },
        }),


    }),
})

export const { useGetAccountMutation, useGetAccountTokensMutation, useGetAccountGatewayTokensMutation } = accountsApi;