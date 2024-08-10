import { getNewSeed } from "./mathUtils";

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

export const getBasicSearchHanjaView = (character) => {
    return {
        view: "search_hanja",
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

export const getBasicUnknownWordsView = () => {
    return {
        view: "get_unknown_words",
        value: {
            initialTextContent: "",
            initialUnknownWords: [],
            alreadyInteracted: false,
        },
        searchBarInitialState: {
            boxContent: "",
            dictionary: "korean",
        },
    };
};

export const getNewKnownWordsView = () => {
    return {
        view: "user_known_words",
        value: {
            initial_page: 1,
        },
        searchBarInitialState: {
            boxContent: "아는 단어 목록",
            dictionary: "korean",
        },
    };
};

export const getNewStudyWordView = () => {
    return {
        view: "user_study_words",
        value: {
            initial_page: 1,
        },
        searchBarInitialState: {
            boxContent: "공부 단어 목록",
            dictionary: "korean",
        },
    };
};

export const getNewReviewView = () => {
    return {
        view: "study_word_review",
        value: {
            seed: getNewSeed(),
            initialCurrentNumber: 1,
            initialSettings: {
                showPager: true,
                shortcuts: {
                    enable: false,
                    backKey: "ArrowLeft",
                    forwardKey: "ArrowRight",
                },
            },
        },
        searchBarInitialState: {
            boxContent: "암기장 단어 학습",
            dictionary: "korean",
        },
    };
};

export const getBasicHomepageView = (seed) => {
    return {
        view: "homepage",
        value: seed,
        searchBarInitialState: {
            boxContent: "",
            dictionary: "korean",
        },
    };
};

/* to avoid unnecessary api calls this accepts the entire note data object */
export const getBasicDetailNoteView = (noteData) => {
    return {
        view: "detail_note",
        value: noteData,
        searchBarInitialState: {
            boxContent: "",
            dictionary: "korean",
        },
    };
};
