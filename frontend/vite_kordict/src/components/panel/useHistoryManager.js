import { useState } from "react";

export function useHistoryManager() {
  /* 
    History is stored as an array of views.
    [{"view: "homepage}, {"view": "search_korean", "value": "가다"}, ...] for example
   */
  const [history, setHistory] = useState([]);
  /* historySize is the logical size of history */
  const [historySize, setHistorySize] = useState(0);
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
    setHistory((prevHistory) => [
      ...prevHistory.slice(0, historyPointer + 1),
      newView,
    ]);
    setHistoryPointer(historyPointer + 1);
    setHistorySize(historyPointer + 1);
  };

  const getPrecedingView = () => {
    setHistoryPointer((prevPointer) => prevPointer - 1);
    return history[historyPointer];
  };

  const getFollowingView = () => {
    setHistoryPointer((prevPointer) => prevPointer + 1);
    return history[historyPointer];
  };

  const canNavigateBack = () => {
    return historyPointer - 1 >= 0;
  };

  const canNavigateForward = () => {
    return historyPointer + 1 <= historySize;
  };

  return {
    pushViewToHistory,
    canNavigateBack,
    getPrecedingView,
    canNavigateForward,
    getFollowingView,
  };
}
