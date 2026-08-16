export const useScrollToTop = () => {    
    const useScrollToTopOverflow = (containerRef: React.RefObject<HTMLDivElement | null>) => {
        containerRef?.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return { useScrollToTopOverflow };
}