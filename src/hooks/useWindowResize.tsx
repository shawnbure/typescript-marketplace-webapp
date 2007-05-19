import { useState, useEffect} from "react";

export interface WindowResizeDimensions { 
    width: number | undefined,
    height: number | undefined
}

export const useWindowSize: () => WindowResizeDimensions = () => {
    
    const [windowSize, setWindowSize] = useState<WindowResizeDimensions>({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {

        const handleResize: () => void = () => {

            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });

        };
        
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);

    }, []);

    return windowSize;
}