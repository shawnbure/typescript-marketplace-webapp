import * as Pages from "containers/pages";

export const routePaths = {
    
    home: "/",
    login: "/login",
    ledger: "/ledger",
    create: '/create',
    explore: '/explore',
    account: '/account',
    rankings: "/rankings",
    royalties: "/royalties",
    marketplace: '/marketplace',
    walletconnect: "/walletconnect",
    profile: '/profile/:walletAddress',
    accountSettings: '/account/settings',
    collectionCreate: "/collection/create",
    collection: "/collection/:collectionId",
    token: "/token/:collectionId/:tokenNonce",
    collectionRegister: "/collection/register",
    resources: "https://erdseanft.gitbook.io/docs/",
    collectionEdit: '/collection/:collectionId/edit',
    sellToken: "/token/:walletAddress/:collectionId/:tokenNonce/sell",
    unlistedToken: "/token/:walletAddress/:collectionId/:tokenNonce",
    dao: "/dao",
    rewards: "/rewards",
    confirmation: "/confirmation/:action/:collectionId/:tokenNonce",
};

export const routes: Array<any> = [
    
    {
        path: routePaths.home,
        title: "Home",
        component: Pages.HomePage,
        authenticatedRoute: false,
    },
    {
        path: routePaths.rankings,
        title: "Rankings",
        component: Pages.RankingsPage,
        authenticatedRoute: false,
    },
    {
        path: routePaths.rewards,
        title: "Rewards",
        component: Pages.RewardsPage,
        authenticatedRoute: false,
    },
    {
        path: routePaths.sellToken,
        title: "Sell Token",
        component: Pages.SellTokenPage,
        authenticatedRoute: true,
    },
    {
        path: routePaths.confirmation,
        title: "Confirmation",
        component: Pages.ConfirmationPage,
        authenticatedRoute: true,
    },
    {
        path: routePaths.token,
        title: "Token",
        component: Pages.TokenPage,
        authenticatedRoute: false,
    },
    {
        path: routePaths.unlistedToken,
        title: "Unlisted Token",
        component: Pages.TokenPage,
        authenticatedRoute: false,
    },
    {
        path: routePaths.collectionRegister,
        title: "Register Collection",
        component: Pages.RegisterCollectionPage,
        authenticatedRoute: true,
    },
    {
        path: routePaths.create,
        title: "CReate",
        component: Pages.CreatePage,
        authenticatedRoute: false,
    },
    {
        path: routePaths.collectionCreate,
        title: "Create Collection",
        component: Pages.CreateCollectionPage,
        authenticatedRoute: true,
    },
    {
        path: routePaths.accountSettings,
        title: "Account Settings",
        component: Pages.AccountSettingsPage,
        authenticatedRoute: true,
    },
    {
        path: routePaths.collectionEdit,
        title: "Edit Collection",
        component: Pages.CollectionEditPage,
        authenticatedRoute: true,
    },
    {
        path: routePaths.royalties,
        title: "Royalties",
        component: Pages.RoyaltiesPage,
        authenticatedRoute: true,
    },
];