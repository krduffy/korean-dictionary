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

export const getBasicSearchKoreanView = (searchTerm) => {
    return {
        view: "search_korean",
        value: { search_term: searchTerm, initial_page: 1 },
        searchBarInitialState: {
            boxContent: searchTerm,
            dictionary: "korean",
        },
    };
};

export const getBasicUnknownWordsView = () => {
    return {
        view: "get_unknown_words",
        value: {
            initialTextContent: "",
            initialUnknownWords: [],
        },
        searchBarInitialState: {
            boxContent: "",
            dictionary: "korean",
        },
    };
};
