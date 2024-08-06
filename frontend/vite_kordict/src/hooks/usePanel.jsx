import React, { useRef, useState } from "react";

import { getNewSeed } from "../../util/mathUtils.js";
import { useHistoryManager } from "./useHistoryManager.js";

import HanjaCharView from "../components/panel/detail_view/HanjaCharView.jsx";
import KoreanWordView from "../components/panel/detail_view/KoreanWordView.jsx";
import { UserNoteDetail } from "../components/panel/detail_view/UserNote.jsx";
import EditWordForm from "../components/panel/forms/EditWordForm.jsx";
import GetUnknownWordsForm from "../components/panel/forms/GetUnknownWordsForm.jsx";
import HomePage from "../components/panel/home/HomePage.jsx";
import PaginatedResults from "../components/panel/paginated_results/PaginatedResults.jsx";
import HanjaGame from "../components/panel/review/hanja_game/HanjaGame.jsx";

export const usePanel = () => {
    /* homepage seed doesnt need to be a state because the value in the view stores it */
    const initialHomepageSeed = getNewSeed();
    /* hanja game seed does so that it can be prefetched */
    const initialHanjaGameSeedRef = useRef(getNewSeed());

    const [currentView, setCurrentView] = useState({
        view: "homepage",
        value: initialHomepageSeed,
        searchBarInitialState: {
            boxContent: "",
            dictionary: "korean",
        },
    });

    const {
        pushViewToHistory,
        canNavigateBack,
        getPrecedingView,
        canNavigateForward,
        getFollowingView,
        updateCurrentViewInHistory,
        navigateToLastViewOfType,
        findMostRecentInHistoryOfType,
    } = useHistoryManager({
        view: "homepage",
        value: initialHomepageSeed,
        searchBarInitialState: {
            boxContent: "",
            dictionary: "korean",
        },
    });

    const updateViewAndPushToHistory = (newView) => {
        if (newView) {
            pushViewToHistory(newView);
            setCurrentView(newView);
        }
    };

    const updateViewWithoutPushingToHistory = (newView) => {
        if (newView) {
            setCurrentView(newView);
        }
    };

    const backToHomepage = () => {
        const view = navigateToLastViewOfType("homepage");
        setCurrentView(view);
    };

    const backToHanjaGameOrPushNewGame = () => {
        const view = findMostRecentInHistoryOfType("hanja_game");

        if (view) {
            setCurrentView(view);
        } else {
            updateViewAndPushToHistory({
                view: "hanja_game",
                value: initialHanjaGameSeedRef.current,
                searchBarInitialState: {
                    boxContent: "漢字",
                    dictionary: "hanja",
                },
            });
        }
    };

    /* Whether to have display: none or not */
    const [showPanelContent, setShowPanelContent] = useState(true);

    const getPanelContent = (view, value) => {
        switch (view) {
            case "search_korean":
            case "search_hanja":
            case "user_known_words":
            case "user_study_words":
                return (
                    <PaginatedResults
                        searchType={view}
                        searchTerm={value.search_term}
                        initialPage={value.initial_page}
                    />
                );
            case "detail_korean":
                return <KoreanWordView targetCode={value} />;
            case "detail_hanja":
                return (
                    <HanjaCharView
                        hanjaChar={value.search_term}
                        initialPage={value.initial_page}
                    />
                );
            case "homepage":
                return (
                    <HomePage
                        initialSeed={value}
                        /* this is passed to the homepage so that the homepage can prefetch the
                           first hanja game */
                        initialHanjaGameSeed={initialHanjaGameSeedRef.current}
                        backToHanjaGameOrPushNewGame={
                            backToHanjaGameOrPushNewGame
                        }
                    />
                );
            case "hanja_game":
                return <HanjaGame initialSeed={value} />;
            /* Add word is not currently in the application */
            case "edit_word":
                return <EditWordForm targetCode={value} />;
            case "get_unknown_words":
                return (
                    <GetUnknownWordsForm
                        initialTextContent={value.initialTextContent}
                        initialUnknownWords={value.initialUnknownWords}
                        alreadyInteracted={value.alreadyInteracted}
                    />
                );
            case "detail_note":
                return <UserNoteDetail noteData={value} />;
        }
    };

    const barIsAdded = (view) => {
        return view !== "hanja_game";
    };

    return {
        currentView,
        updateViewAndPushToHistory,
        updateViewWithoutPushingToHistory,
        backToHomepage,
        backToHanjaGameOrPushNewGame,
        showPanelContent,
        setShowPanelContent,
        getPanelContent,
        barIsAdded,

        /* functions directly from use history manager */
        updateCurrentViewInHistory,
        canNavigateBack,
        getPrecedingView,
        canNavigateForward,
        getFollowingView,
    };
};
