export const getBasicDetailKoreanView = (word, targetCode) => {
    return {
        view: "detail_korean",
        value: targetCode,
        searchBarInitialState: {
            boxContent: word,
            dictionary: "korean",
        },
    };
};

export const getBasicDetailHanjaView = (character) => {
    return {
        view: "detail_hanja",
        value: {
            search_term: character,
            initial_page: 1,
        },
        searchBarInitialState: {
            boxContent: character,
            dictionary: "hanja",
        },
    };
};
