export const objsAreDeepEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
        return true;
    }

    if (
        typeof obj1 !== "object" ||
        obj1 === null ||
        typeof obj2 !== "object" ||
        obj2 === null
    ) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (!keys2.includes(key) || !objsAreDeepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
};

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

export const getPanelCenterX = (x) => {
    if (x > window.innerWidth) {
        return 0.75 * window.innerWidth;
    }

    return 0.25 * window.innerWidth;
};

export const getPanelCenterY = (y) => {
    return 0.55 * window.innerHeight;
};
