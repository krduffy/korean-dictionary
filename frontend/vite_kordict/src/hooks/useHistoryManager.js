import { useState } from "react";

export function useHistoryManager(initialView) {
    /* 
    History is stored as an array of views.
    [{"view: "homepage}, {"view": "search_korean", "value": "가다"}, ...] for example
   */
    const [history, setHistory] = useState([initialView]);
    /*
     * historyPointer is the index of the current view in history.
     * If history is composed of views v0, v1, v2, with historyPointer set at v2, click back will move
     * historyPointer to v1.
     *
     *   v0   v1   v2
     *        ^
     *       ptr
     *
     * If a new view v3 is then rendered, history will overwrite v2 and become:
     *
     *   v0   v1   v3
     *             ^
     *            ptr
     */
    const [historyPointer, setHistoryPointer] = useState(0);

    const pushViewToHistory = (newView) => {
        const newHistory = history.slice(0, historyPointer + 1);
        newHistory.push(newView);
        setHistory(newHistory);
        setHistoryPointer(historyPointer + 1);
    };

    const getPrecedingView = () => {
        const prevPointer = historyPointer;
        setHistoryPointer(prevPointer - 1);
        return history[prevPointer - 1];
    };

    const getFollowingView = () => {
        const prevPointer = historyPointer;
        setHistoryPointer(prevPointer + 1);
        return history[prevPointer + 1];
    };

    const canNavigateBack = () => {
        return historyPointer - 1 >= 0;
    };

    const canNavigateForward = () => {
        return historyPointer + 1 <= history.length - 1;
    };

    return {
        pushViewToHistory,
        canNavigateBack,
        getPrecedingView,
        canNavigateForward,
        getFollowingView,
    };
}
