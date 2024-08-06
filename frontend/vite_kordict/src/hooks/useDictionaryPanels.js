import { usePanel } from "./usePanel.jsx";

/* Has two panels which need access to each other. */

export const useDictionaryPanels = () => {
    const useLeftPanel = usePanel();
    const useRightPanel = usePanel();

    /* specifically for update view and push to history. moving left and right with arrows
     does not call this because it doesnt push anything to history. */
    const addPushView = (usePanelObject, leftOrRight) => {
        /* checks if ctrl is being held down */
        const pushView = (event, newView) => {
            if (event.ctrlKey) {
                /* search in other panel. */
                if (leftOrRight === "right") {
                    useLeftPanel.updateViewAndPushToHistory(newView);
                } else if (leftOrRight === "left") {
                    useRightPanel.updateViewAndPushToHistory(newView);
                }
            } else {
                if (leftOrRight === "left") {
                    useLeftPanel.updateViewAndPushToHistory(newView);
                } else if (leftOrRight === "right") {
                    useRightPanel.updateViewAndPushToHistory(newView);
                }
            }
        };

        usePanelObject.pushView = pushView;
    };

    addPushView(useLeftPanel, "left");
    addPushView(useRightPanel, "right");

    return {
        useLeftPanel,
        useRightPanel,
    };
};
