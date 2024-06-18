import React, { useRef } from "react";

export function useCache() {
    const cache = useRef({});
    /* array of ages; lru eviction policy */
    const ages = useRef([]);

    const CAPACITY = 100;
    let itemsStored = 0;

    const cacheRetrieve = (url) => {
        if (Object.keys(cache.current).includes(url)) {
            return cache.current[url];
        }

        return null;
    };

    const cachePut = (url, response) => {
        if (!Object.keys(cache.current).includes(url)) {
            itemsStored++;
        } else if (itemsStored == CAPACITY) {
            /* first in first out eviction is temp */
            const first = Object.entries(cache.current)[0];
            delete cache.current[first];
        }
        cache.current[url] = response;
    };

    const cacheInvalidate = (urlRegex) => {
        const regex = new RegExp(urlRegex);

        Object.keys(cache.current).forEach((url) => {
            if (regex.test(url)) {
                delete cache.current[url];
                itemsStored--;
            }
        });
    };

    return {
        cacheRetrieve,
        cachePut,
        cacheInvalidate,
    };
}
