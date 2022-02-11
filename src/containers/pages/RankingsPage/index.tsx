/* eslint-disable */
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { useGetCollectionsRankingsMutation } from 'services/collections';
import Table from 'rc-table';


export const RankingsPage: (props: any) => any = ({ }) => {

    const {
        address: userWalletAddress,
    } = Dapp.useContext();


    const [getCollectionsRankingsTrigger, {
        data: collectionRankingsData,
    }] = useGetCollectionsRankingsMutation();


    const listingTableColumns = [
        {
            title: 'Collection',
            dataIndex: 'collection',
            key: 'collection',
            className: 'c-table_column',
        },
        {
            title: 'Volume',
            dataIndex: 'volume',
            key: 'volume',
            className: 'c-table_column',
        },
        {
            title: 'Floor price',
            dataIndex: 'floor',
            key: 'floor',
            className: 'c-table_column',
        },
        {
            title: 'Owners',
            dataIndex: 'owners',
            key: 'owners',
            className: 'c-table_column',
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            className: 'c-table_column',
        },
    ];


    const mapListingTableData = collectionRankingsData?.data?.map((collectionData: any, index: number) => {

        const { CollectionId, CollectionName, floorPrice, itemsTotal, volumeTraded, ownersTotal } = collectionData;

        const collection = (
            <Link className="break-words" to={`/collection/${CollectionId}`} >
                <span className="inline-block mr-4">
                    {`${index + 1}. `}

                </span>

                <span className="u-text-theme-blue-anchor inline-block mr-2">
                    {CollectionName || CollectionId}
           
                </span>
                {/* <span  className="u-text-theme-blue-anchor">
                    <FontAwesomeIcon  style={{ width: 15, height: 15 }} icon={faIcons.faLink} />
                </span> */}
            </Link>
        )

        return ({
            collection: collection,
            volume: volumeTraded,
            floor: floorPrice,
            owners: ownersTotal,
            items: itemsTotal,
            key: `key-${index}`
        });


    });

    useEffect(() => {


        getCollectionsRankingsTrigger({
            offset: 0,
            limit: 9,
        });

    }, []);


    return (

        <div className="p-account-settings-page">

            <div className="grid grid-cols-12">

                <div className="col-span-12 m-4 md:m-20">


                    <h2 className="text-2xl md:text-5xl u-text-bold mb-4 text-center">
                        Top NFTs
                    </h2>


                </div>

                <div className="col-span-12 md:col-start-3 md:col-span-8 m-4 md:m-20">

                    <Table className="c-table c-table--rankings" rowClassName="c-table_row" columns={listingTableColumns} data={mapListingTableData} />


                </div>


            </div>

        </div>
    );
};

export default RankingsPage;
