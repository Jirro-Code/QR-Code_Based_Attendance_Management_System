import { useEffect } from "react";
import { useLocation } from "react-router-dom";


export const useScrollToTop = () => {
    const useScrollToTopPage = (pathname: string) => {
        const { pathname: currentPathname } = useLocation();
        useEffect(() => {
            window.scrollTo(0, 0);
        }, [pathname || currentPathname]);
        
        return null;
    }
    
    
    const useScrollToTopOverflow = (containerRef: React.RefObject<HTMLDivElement | null>) => {
        containerRef?.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    
    
    return { useScrollToTopPage, useScrollToTopOverflow };
}