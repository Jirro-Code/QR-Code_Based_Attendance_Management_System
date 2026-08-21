import { useEffect} from "react";

export const useScrollFunctions = () => {    
    const useScrollToTopOverflow = (containerRef: React.RefObject<HTMLDivElement | null>) => {
        containerRef?.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    
    const useDisableScroll = () => {
        useEffect(() => {
            const preventPageScroll = (e: WheelEvent) => {
                const target = e.target as HTMLElement;
                
                if (target.closest(".scrollable-card")){
                    return;
                }
                
                e.preventDefault();
            };
            window.addEventListener("wheel", preventPageScroll, { passive: false });
            return () => {
                window.removeEventListener("wheel", preventPageScroll);
            }
        }, []);
    }
    
    return { useScrollToTopOverflow, useDisableScroll };
}
