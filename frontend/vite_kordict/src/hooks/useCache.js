const cache = {};
/* array of ages; lru eviction policy */

const CAPACITY = 100;
let itemsStored = 0;

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

    console.log("ADDITIONAL INFO IS ");
    console.log(additionalInfo);

    /* toggle_word_known */
    if (new RegExp("^api/toggle_word_k").test(url)) {
        console.log("toggling");
        console.log(
            "matches?" +
                getSearchesMatchingWord("^api/search_k", additionalInfo["word"])
        );
        const searchesToUpdate = getSearchesMatchingWord(
            "^api/search_k",
            additionalInfo["word"]
        );

        for (let i = 0; i < searchesToUpdate.length; i++) {
            cacheInPlaceUpdate(searchesToUpdate[i], "known", method);
        }
    } else if (new RegExp("^api/toggle_word_s").test(url)) {
        /* toggle_word_studied */
        cacheInPlaceUpdate("^api/korean_word/", "studied", method);
        return getSearchesMatchingWord("^api/search_k", additionalInfo["word"]);
    } else if (new RegExp("^api/create_s").test(url)) {
        if (cache[`/api/korean_word/${additionalInfo["word_target_code"]}`]) {
            /* Returns single url as an array of length 1 so that
                 it can be refetched */
            return [`/api/korean_word/${additionalInfo["word_target_code"]}`];
        }
    } else if (new RegExp("^api/create_n").test(url)) {
        /* same as adding sense (updating examples) */
        if (cache[`/api/korean_word/${additionalInfo["word_target_code"]}`]) {
            return [`/api/korean_word/${additionalInfo["word_target_code"]}`];
        }
    }
};

export const cacheRetrieve = (url) => {
    if (Object.keys(cache).includes(url)) {
        return cache[url];
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

/* recursively check object for known key */
/* will remove annoying kw_ prefix in only one serializer */
const updateFieldRecur = (obj, field1, field2, value) => {
    if (typeof obj === "object" && obj !== null) {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                updateFieldRecur(obj[i], field1, field2, value);
            }
        } else {
            Object.keys(obj).forEach((key) => {
                if (key === field1 || key === field2) {
                    obj[key] = value;
                } else {
                    updateFieldRecur(obj[key], field1, field2, value);
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
    updateFieldRecur(cacheItem, "is_known", "kw_is_known", newBoolean);
};

const changeStudiedInPlace = (url, newBoolean) => {
    const cacheItem = cache[url];

    /* recursively check object for studied key */
    updateFieldRecur(cacheItem, "is_studied", "kw_is_studied", newBoolean);
};

export const cachePut = (url, response) => {
    if (!Object.keys(cache).includes(url)) {
        itemsStored++;
    } else if (itemsStored == CAPACITY) {
        /* first in first out eviction is temp */
        const first = Object.entries(cache)[0];
        delete cache[first];
    }
    cache[url] = response;
};

const cacheInvalidate = (urlRegex) => {
    const regex = new RegExp(urlRegex);

    Object.keys(cache).forEach((url) => {
        if (regex.test(url)) {
            delete cache[url];
            itemsStored--;
        }
    });
};

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
