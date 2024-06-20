import { useState } from "react";

/**
 * A hook for managing a history of views with navigation capabilities.
 *
 * @param {Object} initialView - The initial view to start the history with.
 * @returns {{
 *   pushViewToHistory: Function,
 *   canNavigateBack: Function,
 *   getPrecedingView: Function,
 *   canNavigateForward: Function,
 *   getFollowingView: Function,
 *   updateCurrentViewInHistory: Function
 * }} An object containing the following functions:
 *   pushViewToHistory - Function to add a new view to the history.
 *   canNavigateBack - Function to check if navigation back is possible.
 *   getPrecedingView - Function that returns the preceding view in the history and updates the history pointer.
 *   canNavigateForward - Function to check if navigation forward is possible.
 *   getFollowingView - Function to retrieve the next view in the history and update the history pointer.
 *   updateCurrentViewInHistory - Function to update the current view in the history.
 */
export function useHistoryManager(initialView) {
    /*
     * History is stored as an array of views.
     * [{"view: "homepage}, {"view": "search_korean", "value": "가다"}, ...] for example
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

    /**
     * Adds a new view to the history.
     *
     * @param {Object} newView - The new view to be added to the history.
     */
    const pushViewToHistory = (newView) => {
        const newHistory = history.slice(0, historyPointer + 1);
        newHistory.push(newView);
        setHistory(newHistory);
        setHistoryPointer(historyPointer + 1);
    };

    /**
     * Retrieves the preceding view in the history and updates the history pointer.
     *
     * @returns {Object} The preceding view in the history.
     */
    const getPrecedingView = () => {
        const prevPointer = historyPointer;
        setHistoryPointer(prevPointer - 1);
        return history[prevPointer - 1];
    };

    /**
     * Retrieves the next view in the history and updates the history pointer.
     *
     * @returns {Object} The next view in the history.
     */
    const getFollowingView = () => {
        const prevPointer = historyPointer;
        setHistoryPointer(prevPointer + 1);
        return history[prevPointer + 1];
    };

    /**
     * Checks if navigation back is possible based on the current history pointer.
     *
     * @returns {boolean} True if navigation back is possible, false otherwise.
     */
    const canNavigateBack = () => {
        return historyPointer - 1 >= 0;
    };

    /**
     * Checks if navigation forward is possible based on the current history pointer.
     *
     * @returns {boolean} True if navigation forward is possible, false otherwise.
     */
    const canNavigateForward = () => {
        return historyPointer + 1 <= history.length - 1;
    };

    /**
     * Updates the current view in the history with a new view.
     *
     * @param {Object} newView - The new view to update the current view with.
     */
    const updateCurrentViewInHistory = (newView) => {
        let newHistory = history.slice(0, history.length);
        newHistory[historyPointer] = newView;
        setHistory(newHistory);
    };

    const navigateToLastViewOfType = (viewType) => {
        for (let i = historyPointer; i >= 0; i--) {
            if (history[i].view === viewType) {
                setHistoryPointer(i);
                return history[i];
            }
        }
    };

    return {
        pushViewToHistory,
        canNavigateBack,
        getPrecedingView,
        canNavigateForward,
        getFollowingView,
        updateCurrentViewInHistory,
        navigateToLastViewOfType,
    };
}
