export const getElementSizing = (elementRef) => {
    if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();

        return {
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
            paddingX: rect.width / 2,
            paddingY: rect.height / 2,
        };
    }

    return null;
};
