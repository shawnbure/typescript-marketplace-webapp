

import Select from 'react-select'
import { useSearchByStringMutation } from 'services/search';

import Async, { useAsync } from 'react-select/async';

import AsyncSelect from 'react-select/async';

export const SearchBar = ({
    wrapperClassNames,
    searchBarClassNames,
}: any) => {


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

        <div className={`c-searchbar ${wrapperClassNames}`}>
            <AsyncSelect placeholder="Search collections and accounts" onChange={handleSearchChange} isClearable isSearchable cacheOptions defaultOptions loadOptions={promiseOptions} className={"text-white w-full"} styles={customStyles} />
        </div>
    );
};

export default SearchBar;
