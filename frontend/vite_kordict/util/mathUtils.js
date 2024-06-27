export const getNewSeed = () => {
    return Math.floor(1000000 * Math.random());
};

/* for both fit box x and fit box y if boxWidth/height > innerWidth/height then the 
   box has no choice but to go off screen */
export const fitBoxX = (fromX, boxWidth, padding) => {
    return fromX + boxWidth + padding < window.innerWidth
        ? fromX + padding
        : fromX - boxWidth - padding;
};

export const fitBoxY = (fromY, boxHeight, padding) => {
    if (fromY - boxHeight - padding > 0) {
        return fromY - boxHeight - padding;
    } else if (fromY + boxHeight + padding < window.innerHeight) {
        return fromY + padding;
    } else {
        return (window.innerHeight - boxHeight) / 2;
    }
};
