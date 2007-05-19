import { useState } from 'react';
import Popup from 'reactjs-popup';
import { Link, useHistory } from "react-router-dom";
import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as faBrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { routePaths } from 'constants/router';
import { WalletSidebar } from 'components/index';
import { selectShouldDisplayWalletSidebar } from 'redux/selectors/ui';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { toggleShouldDisplayWalletSidebar } from 'redux/slices/ui';
import Select from 'react-select'
import { useSearchByStringMutation } from 'services/search';

import Async, { useAsync } from 'react-select/async';

import AsyncSelect from 'react-select/async';


export const Navbar = () => {

    const history = useHistory();

    const dispatch = useAppDispatch();
    const shouldDisplayWalletSidebar = useAppSelector(selectShouldDisplayWalletSidebar);

    const handleToggleSidebar = () => {

        dispatch(toggleShouldDisplayWalletSidebar());

    }

    const [searchByStringTrigger] = useSearchByStringMutation()

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            // color: state.isSelected ? 'red' : 'blue',
            backgroundColor: '#353840',
            color: 'white',
            padding: 20,
            onOptionHover: {
                backgroundColor: 'red',
            },
            width: "100%"
        }),
        control: (provided: any) => ({
            // none of react-select's styles are passed to <Control />
            // width: 200,
            ...provided,
            backgroundColor: '#353840',
            borderColor: "#353840",
            onOptionHover: {
                borderColor: "red",
            },
            width: "100%",
            color: "white"
        }),
        indicatorSeparator: (provided: any, state: any) => {
            //hide
            return {}
        },
        singleValue: (provided: any, state: any) => {
            // const opacity = state.isDisabled ? 0.5 : 1;
            // const transition = 'opacity 300ms';

            // return { ...provided, opacity, transition };

            // return provided;
            return {
                ...provided,
                color: "white",
                padding: 10,
                backgroundColor: '#353840',
            }
        },
        input: (provided: any, state: any) => {


            return {
                ...provided,
                color: "white",
            }
        },
        menuList: (provided: any, state: any) => {


            return {
                ...provided,
                padding: 0,
                margin: 0,
            }
        },
        menu: (provided: any, state: any) => {


            return {
                ...provided,
                padding: 0,
                margin: 0,
                backgroundColor: '#353840',
            }
        }
    }

    const handleSearchChange = (currentSearch: any) => {

        if (Boolean(currentSearch?.type) && Boolean(currentSearch?.value)) {

            window.location.replace(`/${currentSearch.type}/${currentSearch.value}`);

        }

    };

    const promiseOptions = (searchString: string) => (

        new Promise(async (resolve) => {

            const results: any = await searchByStringTrigger({ searchString });

            const accounts = results?.data?.data?.Accounts?.map(({ address: value, name, }: any) => ({ value, label: name, type: "profile" })) || [];
            const collections = results?.data?.data?.Collections?.map(({ tokenId: value, name, }: any) => ({ value, label: name, type: "collection" })) || [];

            const allResults = [...accounts, ...collections];

            resolve(allResults);


        })

    );

    return (

        <>
            <div className="c-navbar">

                <div className="grid grid-cols-12">

                    <div className="col-span-2">


                        <div className="c-navbar_brand">

                            <Link to={routePaths.home}>
                                <img src="/img/logos/erdsea/erdsea-logo-white.svg" image-rendering="optimizeQuality" className="c-navbar_brand-logo" />
                            </Link>

                            <Link to={routePaths.home} className="c-navbar_brand-name">
                                Erdsea
                            </Link>

                        </div>


                    </div>

                    <div className="col-start-4 col-span-4">
                        <div className="align-items-center flex h-full justify-content-center">

                            {/* <input type="text" className="text-xl bg-opacity-10 bg-white border-1 border-black  p-2 placeholder-opacity-10 rounded-2 text-white w-full" /> */}
                            {/* <AsyncSelect onBlur={()=>{}} value={{ value: currentSearchInput, label: currentSearchInput }}  onInputChange={handleInputSearchChange} options={options} isClearable={true} isSearchable={true} className="text-white w-full" styles={customStyles} /> */}

                            <AsyncSelect onChange={handleSearchChange} isClearable isSearchable cacheOptions defaultOptions loadOptions={promiseOptions} className="text-white w-full" styles={customStyles} />

                        </div>
                    </div>

                    <div className="col-start-9 col-span-4">

                        <ul className="c-navbar_list  float-right">

                            <li className="c-navbar_list-item">
                                <Link to={routePaths.marketplace} className="c-navbar_list-link">
                                    Explore
                                </Link>
                            </li>
                            {/* <li className="c-navbar_list-item">
                                <Link to={routePaths.home} className="c-navbar_list-link">
                                    Stats
                                </Link>
                            </li> */}
                            <li className="c-navbar_list-item">
                                <a href={'https://erdseanft.gitbook.io/docs/'} target="_blank" className="c-navbar_list-link">
                                    Resources
                                </a>
                            </li>

                            <li className="c-navbar_list-item" onClick={handleToggleSidebar}>
                                <span className="c-navbar_list-link">
                                    <FontAwesomeIcon width={'20px'} className="c-navbar_icon-link" icon={faIcons.faWallet} />
                                </span>
                            </li>


                        </ul>


                    </div>

                </div>


            </div>

            {

                <div className={`${!shouldDisplayWalletSidebar && 'visually-hidden'}`}>
                    <WalletSidebar
                        overlayClickCallback={handleToggleSidebar}
                    />
                </div>
            }

        </>

    );

};

export default Navbar;
