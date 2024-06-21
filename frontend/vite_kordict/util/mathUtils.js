export const getNewSeed = () => {
    return Math.floor(1000000 * Math.random());
};

/* for both fit box x and fit box y if boxWidth/height > innerWidth/height then the 
   box has no choice but to go off screen */
export const fitBoxX = (fromX, boxWidth, buffer) => {
    return fromX + buffer >= window.innerWidth / 2
        ? fromX + buffer
        : fromX - boxWidth - buffer;
};

export const fitBoxY = (fromY, boxHeight, buffer) => {
    return fromY + buffer >= window.innerHeight / 2
        ? fromY - boxHeight - buffer
        : fromY + buffer;
};
