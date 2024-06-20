export const cache = {};
export const CACHE_CAPACITY = 100;

let itemsStored = 0;

/* used for storing age */
let counter = 0;

/**
 * Clears the cache.
 */
export const clearCache = () => {
    const keys = Object.keys(cache);

    for (let i = 0; i < keys.length; i++) {
        delete cache[keys[i]];
    }

    itemsStored = 0;
    counter = 0;
};

/**
 * A function to update the cache given a new non-get request. Invalidates or updates cache
 * items that are changed by the provided request.
 *
 * @param {string} url - The url for the request.
 * @param {string} method - The method (POST, DELETE, etc).
 * @param {object} additionalInfo - Any additional info necessary for processing the request;
 * can include target_code, word, origin.
 */
export const processRequest = (url, method, additionalInfo) => {
    /*
      Only non-get requests can ever invalidate anything in the cache, so this function
      must be passed to instances of useAPIModifier.

      "search_korean" invalidated when word matching search bar regex is put in toggle known/studied
      "search_hanja" never invalidated
      "detail_korean" invalidated when word is put in toggle known/studied
      "detail_hanja" invalidated when word containing char is put in toggle known/studied
      "hanja_popup" invalidated when word containing char is put in toggle known/studied
      "homepage" invalidated when known/studied is ever toggled + when words in study word are toggled in studied
                      * can recursively check homepage to see if target code is actually on the page.
      "hanja_game"
      "get_unknown_words" doesnt invalidate anything.
      "detail_note" invalidated when note is edited or deleted.

      Login and logout invalidate entire cache.
    */

    /* toggle_word_known */
    if (new RegExp("^api/toggle_word_k").test(url)) {
        const searchesToUpdate = getSearchesMatchingWord(
            "^api/search_k",
            additionalInfo["word"]
        );
        for (let i = 0; i < searchesToUpdate.length; i++) {
            cacheInPlaceUpdate(searchesToUpdate[i], "known", method);
        }

        if (cache[`api/korean_word/${additionalInfo["target_code"]}`]) {
            cacheInPlaceUpdate(
                `api/korean_word/${additionalInfo["target_code"]}`,
                "known",
                method
            );
        }
    } else if (new RegExp("^api/toggle_word_s").test(url)) {
        /* toggle_word_studied */
        const searchesToUpdate = getSearchesMatchingWord(
            "^api/search_k",
            additionalInfo["word"]
        );
        for (let i = 0; i < searchesToUpdate.length; i++) {
            cacheInPlaceUpdate(searchesToUpdate[i], "studied", method);
        }

        if (cache[`api/korean_word/${additionalInfo["target_code"]}`]) {
            cacheInPlaceUpdate(
                `api/korean_word/${additionalInfo["target_code"]}`,
                "studied",
                method
            );
        }
    } else if (new RegExp("^api/create_s").test(url)) {
        /* */
    } else if (new RegExp("^api/create_n").test(url)) {
        /* */
    } else if (new RegExp("^users/login").test(url)) {
        clearCache();
    } else if (new RegExp("^users/logout").test(url)) {
        clearCache();
    }
};

/**
 * A function that returns a response to a get request if it exists in the cache.
 *
 * @param {string} url - The url for the get request.
 * @returns {Object} The cached response, if the url is in the cache; `null` otherwise.
 */
export const cacheRetrieve = (url) => {
    if (Object.keys(cache).includes(url)) {
        cache[url].lastAccessed = ++counter;
        return cache[url].response;
    }
    return null;
};

/**
 * A function that updates cache entries in response to changes in is_known or is_studied variables
 * for the user.
 *
 * @param {string} url - The url to update in the cache.
 * @param {"known" | "studied"} updateType - Whether is_known or is_studied should be updated in cache entries.
 * @param {string} updateMethod - The method (POST or DELETE).
 */
const cacheInPlaceUpdate = (url, updateType, updateMethod) => {
    /* changing in place essentially = making cache dirty instead of refetching */
    /* except there is no need to write back to any other memory */
    if (updateType === "known") {
        changeKnownInPlace(url, updateMethod === "PUT" ? true : false);
    } else if (updateType === "studied") {
        changeStudiedInPlace(url, updateMethod === "PUT" ? true : false);
    }
};

/* recursively check object for key */
const updateFieldRecur = (obj, field, value) => {
    if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                updateFieldRecur(obj[i], field, value);
            }
        } else {
            Object.keys(obj).forEach((key) => {
                if (key === field) {
                    obj[key] = value;
                } else {
                    updateFieldRecur(obj[key], field, value);
                }
            });
        }
    }
};

const changeKnownInPlace = (url, newBoolean) => {
    const cacheItem = cache[url];

    /* recursively check object for known key */
    updateFieldRecur(cacheItem, "is_known", newBoolean);
};

const changeStudiedInPlace = (url, newBoolean) => {
    const cacheItem = cache[url];

    /* recursively check object for studied key */
    updateFieldRecur(cacheItem, "is_studied", newBoolean);
};

/**
 * Caches the response to the given url. Uses an LRU eviction policy if the cache is full.
 *
 * @param {string} url - The url.
 * @param {object} response - The response.
 */
export const cachePut = (url, response) => {
    if (itemsStored >= CACHE_CAPACITY) {
        /* evict least recently used */

        let lowest = Infinity;
        const cacheAsArray = Object.entries(cache);
        let urlToEvict = "";

        for (let i = 0; i < cacheAsArray.length; i++) {
            if (cacheAsArray[i][1].lastAccessed < lowest) {
                lowest = cacheAsArray[i][1].lastAccessed;
                urlToEvict = cacheAsArray[i][0];
            }
        }

        delete cache[urlToEvict];
        itemsStored--;
    }

    cache[url] = {
        lastAccessed: ++counter,
        response: response,
    };
    itemsStored++;
};

/* Not currently used for anything because logging in and out just calls the clear cache function */
/*
const cacheInvalidate = (urlRegex) => {
    const regex = new RegExp(urlRegex);

    Object.keys(cache).forEach((url) => {
        if (regex.test(url)) {
            delete cache[url];
            itemsStored--;
        }
    });
};
*/

/**
 * A function to get cached urls for searches in the Korean dictionary for any regular expression
 * matching the given word.
 *
 * @param {string} urlRegex - The url regular expression for returned urls to match.
 * @param {string} word - The word that urls must have potentially returned in their results.
 * @returns {[string]} An array of strings that match the given urlRegex and word.
 */
const getSearchesMatchingWord = (urlRegex, word) => {
    const urlMatches = (url, prefix, needsToHave) => {
        const regex = new RegExp(`^${prefix}(.*)$`);
        const match = url.match(regex);

        if (match) {
            return (
                match[1] === needsToHave ||
                new RegExp(`^${match[1]}$`).test(needsToHave)
            );
        }
        return false;
    };

    const searches = [];

    Object.keys(cache).forEach((url) => {
        if (
            new RegExp(urlRegex).test(url) &&
            urlMatches(
                url,
                "api\\/search_korean\\/\\?page=\\d+&search_term=",
                word
            )
        ) {
            searches.push(url);
        }
    });

    return searches;
};
