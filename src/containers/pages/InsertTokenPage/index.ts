import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useCreateTokenMutation } from "services/tokens";

export const InsertTokenPage: (props: any) => any = ({ }) => {

    const [createTokenTrigger,] = useCreateTokenMutation();
 
    useEffect(() => {

        const queryString = window.location.search;
        const pathArray = window.location.pathname.split('/');
        const urlParams = new URLSearchParams(queryString);
        const status = urlParams.get('status')

        if(status == "success"){
            
            const walletAddress = urlParams.get('address')
            const tokenName = pathArray[2]
            const tokenNonce = pathArray[3]

            //database nonce is bigint - this value needs to be hexidecimal. basically adding 0 to the first position is the len = 1
            let hexNonce = tokenNonce;
            if(tokenNonce?.length == 1){
                hexNonce = "0" + tokenNonce;
            }

            const formattedData = {
                walletAddress: walletAddress,
                tokenName: tokenName,
                tokenNonce: hexNonce,
            }
            
            const response: any = createTokenTrigger({ payload: formattedData });

        }    

    }, []); 

    return null;

};

export default InsertTokenPage;
