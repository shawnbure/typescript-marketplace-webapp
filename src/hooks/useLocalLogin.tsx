import { useState, useEffect} from "react";

export interface WindowResizeDimensions { 
    width: number | undefined,
    height: number | undefined
}

export const useLocalLogin: () => void = () => {
    
    const [shouldDisplayLogin, setShouldDisplayLogin] = useState<boolean>(false);

    useEffect(() => {



    }, []);

    return { shouldDisplayLogin,  setShouldDisplayLogin};
}