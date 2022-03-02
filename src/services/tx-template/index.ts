import { createApi, fetchBaseQuery, FetchArgs } from '@reduxjs/toolkit/query/react';

import { BASE_URL_API, GET } from 'constants/api';

const mainPath = 'tx-template';

export const txTemplateApi = createApi({

    reducerPath: mainPath,

    baseQuery: fetchBaseQuery({

        baseUrl: BASE_URL_API

    }),

    endpoints: (builder) => ({

        getBuyNftTemplate: builder.mutation<any, { userWalletAddress: string, collectionId: string, tokenNonce: string, price: number }>({

            query: ({ userWalletAddress, collectionId, tokenNonce, price }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/buy-nft/${userWalletAddress}/${collectionId}/${tokenNonce}/${price}`
                }

                return customRequestArg;
            },
        }),


        getListNftTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce, price }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/list-nft/${userWalletAddress}/${collectionId}/${tokenNonce}/${price}`
                }

                return customRequestArg;
            },
        }),


        getStartAuctionNftTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce, minBid, startTime, deadline }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/start-auction/${userWalletAddress}/${collectionId}/${tokenNonce}/${minBid}/${startTime}/${deadline}`
                }

                return customRequestArg;
            },
        }),


        getWithdrawNftTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/withdraw-nft/${userWalletAddress}/${collectionId}/${tokenNonce}`
                }

                return customRequestArg;
            },
        }),




        getMintTokensTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, numberOfTokens }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/mint-tokens/${userWalletAddress}/${collectionId}/${numberOfTokens}`
                }

                return customRequestArg;
            },
        }),


        getAddDepositEgldTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, amount }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/deposit/${userWalletAddress}/${amount}`
                }

                return customRequestArg;
            },
        }),


        getWithdrawDepositTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, amount }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/withdraw/${userWalletAddress}/${amount}`
                }

                return customRequestArg;
            },
        }),


        getIssueNftTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, tokenName, tokenTicker }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/issue-nft/${userWalletAddress}/${tokenName}/${tokenTicker}`
                }

                return customRequestArg;
            },
        }),

        
        getDeployCollectionTemplate: builder.mutation<any, any>({

            query: ({
                userWalletAddress,
                tokenId,
                royalties,
                tokenNameBase,
                imageBase,
                imageExt,
                price,
                maxSupply,
                saleStart,
                metadataBase, }): FetchArgs => {

                const imageUrlEncode = encodeURIComponent(imageBase);
                const metadataUrlEncode = encodeURIComponent(metadataBase);

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/deploy-template/${userWalletAddress}/${tokenId}/${royalties}/${tokenNameBase}/${imageExt}/${price}/${maxSupply}/${saleStart}?imageBaseLink=${imageUrlEncode}&metadataBaseLink=${metadataUrlEncode}`
                }

                return customRequestArg;
            },
        }),


        getChangeOwnerCollectionTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, contractAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/change-owner/${userWalletAddress}/${contractAddress}`
                }

                return customRequestArg;
            },
        }),


        getSetRolesCollectionTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, contractAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/set-roles/${userWalletAddress}/${collectionId}/${contractAddress}`
                }

                return customRequestArg;
            },
        }),

        getMakeOfferTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce, amount, expire = 9999999999 }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/make-offer/${userWalletAddress}/${collectionId}/${tokenNonce}/${amount}/${expire}`
                }

                return customRequestArg;
            },
        }),


        getMakeBidTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce, payment, bidAmount }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/place-bid/${userWalletAddress}/${collectionId}/${tokenNonce}/${payment}/${bidAmount}`
                }

                return customRequestArg;
            },
        }),

        getAcceptOfferTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce, offerorAddress, amount }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/accept-offer/${userWalletAddress}/${collectionId}/${tokenNonce}/${offerorAddress}/${amount}`
                };

                return customRequestArg;
            },

        }),

        getEndAuctionTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/end-auction/${userWalletAddress}/${collectionId}/${tokenNonce}`
                };

                return customRequestArg;
            },

        }),

        getCancelOfferTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, collectionId, tokenNonce, amount }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/cancel-offer/${userWalletAddress}/${collectionId}/${tokenNonce}/${amount}`
                };

                return customRequestArg;
            },

        }),

        getRequestWithdrawTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, contractAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/request-withdraw/${userWalletAddress}/${contractAddress}`
                };

                return customRequestArg;
            },

        }),

        getWithdrawCreatorRoyaltiesTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/withdraw-creator-royalties/${userWalletAddress}`
                };

                return customRequestArg;
            },

        }),

        getWithdrawMinterTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, contractAddress }): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/${mainPath}/withdraw-minter/${userWalletAddress}/${contractAddress}`
                };

                return customRequestArg;
            },

        }),



        getMintPigsTemplate: builder.mutation<any, any>({

            query: ({ userWalletAddress, numberOfTokens }): FetchArgs => {

                const customRequestArg: FetchArgs = {

                    method: GET,
                    url: `/${mainPath}/mint-pigs/${userWalletAddress}/${numberOfTokens}`
                }

                return customRequestArg;
            },
        }),



        getPigsMintInfo: builder.mutation<any, void>({

            query: (): FetchArgs => {

                const customRequestArg: FetchArgs = {
                    method: GET,
                    url: `/collections/pigs-mint-info`
                }

                return customRequestArg;
            },
        }),



    }),
})

export const {
    useGetWithdrawCreatorRoyaltiesTemplateMutation,
    useGetWithdrawMinterTemplateMutation,
    useGetRequestWithdrawTemplateMutation,
    useGetStartAuctionNftTemplateMutation,
    useGetCancelOfferTemplateMutation,
    useGetEndAuctionTemplateMutation,
    useGetMakeBidTemplateMutation,
    useGetAcceptOfferTemplateMutation,
    useGetMakeOfferTemplateMutation,
    useGetSetRolesCollectionTemplateMutation,
    useGetChangeOwnerCollectionTemplateMutation,
    useGetDeployCollectionTemplateMutation,
    useGetIssueNftTemplateMutation,
    useGetBuyNftTemplateMutation,
    useGetListNftTemplateMutation,
    useGetAddDepositEgldTemplateMutation,
    useGetMintTokensTemplateMutation,
    useGetWithdrawNftTemplateMutation,
    useGetWithdrawDepositTemplateMutation, } = txTemplateApi;