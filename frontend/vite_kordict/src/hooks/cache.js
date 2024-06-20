export const cache = {};
export const CACHE_CAPACITY = 100;

let itemsStored = 0;

/* used for storing age */
let counter = 0;

export const clearCache = () => {
    const keys = Object.keys(cache);

    for (let i = 0; i < keys.length; i++) {
        delete cache[keys[i]];
    }

    itemsStored = 0;
    counter = 0;
};

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

export const cacheRetrieve = (url) => {
    if (Object.keys(cache).includes(url)) {
        cache[url].lastAccessed = ++counter;
        return cache[url].response;
    }
    return null;
};

const cacheInPlaceUpdate = (url, updateType, updateMethod) => {
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

/* changing in place essentially = making cache dirty instead of refetching */
/* except there is no need to write back to any other memory */
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
