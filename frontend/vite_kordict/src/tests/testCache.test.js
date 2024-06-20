import {
    CACHE_CAPACITY,
    cache,
    cachePut,
    cacheRetrieve,
    clearCache,
    processRequest,
} from "../hooks/cache.js";

describe("Cache operations", () => {
    beforeEach(() => {
        clearCache();
    });

    test("cachePut should add items to the cache", () => {
        cachePut("url1", { data: "response1" });
        cachePut("url2", { data: "response2" });

        expect(cache["url1"].response).toEqual({ data: "response1" });
        expect(cache["url2"].response).toEqual({ data: "response2" });
    });

    test("cachePut should evict least recently used item when capacity is reached", () => {
        for (let i = 0; i < CACHE_CAPACITY; i++) {
            cachePut("url" + i, { data: "response" + i });
        }

        cacheRetrieve("url0");
        cachePut("url" + CACHE_CAPACITY, { data: "response" + CACHE_CAPACITY });

        expect(cache["url0"]).toBeDefined();
        expect(cache["url1"]).toBeUndefined();
        expect(cache["url2"]).toBeDefined();
    });

    test("cacheRetrieve should return cached item and update its access time", () => {
        cachePut("url1", { data: "response1" });

        const result = cacheRetrieve("url1");
        expect(result).toEqual({ data: "response1" });

        expect(cache["url1"].lastAccessed).toBe(2);
    });

    test("cacheRetrieve should return null for non-existent items", () => {
        const result = cacheRetrieve("nonexistent-url");
        expect(result).toBeNull();
    });
});

describe("processRequest", () => {
    beforeEach(() => {
        clearCache();

        cachePut("api/search_korean/?page=1&search_term=test", {
            data: {
                results: [
                    {
                        word: "test",
                        is_known: false,
                        is_studied: false,
                    },
                ],
            },
        });
        cachePut("api/korean_word/123", {
            data: {
                word: "test",
                is_known: false,
                is_studied: false,
            },
        });
    });

    test("processRequest should update cache for toggle_word_known", () => {
        /* toggling that the word is known */
        processRequest("api/toggle_word_known", "PUT", {
            word: "test",
            target_code: 123,
        });

        /* both in cache are updated */
        expect(
            cache["api/search_korean/?page=1&search_term=test"].response.data
                .results[0].is_known
        ).toBe(true);

        expect(cache["api/korean_word/123"].response.data.is_known).toBe(true);
    });

    test("processRequest should update cache for toggle_word_studied", () => {
        /* toggling that the word is studied */
        processRequest("api/toggle_word_studied", "PUT", {
            word: "test",
            target_code: 123,
        });

        /* both in cache are updated */
        expect(
            cache["api/search_korean/?page=1&search_term=test"].response.data
                .results[0].is_studied
        ).toBe(true);

        expect(cache["api/korean_word/123"].response.data.is_studied).toBe(
            true
        );
    });
});
