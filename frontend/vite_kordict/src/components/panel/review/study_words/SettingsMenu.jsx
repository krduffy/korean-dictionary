import React, { useEffect, useRef, useState } from "react";

import { getElementSizing } from "../../../../../util/domUtils.js";

import PopupBox from "../../string_formatters/PopupBox.jsx";

const SettingsMenu = ({ gearRef, settings, changeSetting, setShowMenu }) => {
    const gearDim = getElementSizing(gearRef);

    return (
        <PopupBox
            fromX={gearDim.centerX}
            fromY={gearDim.centerY}
            padding={gearDim.paddingX + 5}
            positioning={"fit"}
        >
            {/* Top bar with title and X to close */}
            <div className="full-width">
                <div
                    className="textcentered"
                    style={{ width: "90%", display: "inline-block" }}
                >
                    학습 설정
                </div>
                <div
                    style={{
                        cursor: "pointer",
                        width: "10%",
                        display: "inline-block",
                        color: "red",
                    }}
                    onClick={() => {
                        setShowMenu(false);
                    }}
                >
                    ✖
                </div>
            </div>

            {/* List of settings */}
            <ListOfSettings settings={settings} changeSetting={changeSetting} />
        </PopupBox>
    );
};

const ListOfSettings = ({ settings, changeSetting }) => {
    return (
        <div className="pad-10">
            <div>
                <span
                    className="pointer"
                    onClick={() => {
                        changeSetting("showPager", !settings.showPager);
                    }}
                >
                    {settings.showPager ? "☑" : "☐"}
                </span>
                <span> 페이지 우/좌 이동기 표시</span>
            </div>

            {settings.shortcuts && (
                <ShortcutSettingsArea
                    settings={settings}
                    changeSetting={changeSetting}
                />
            )}
        </div>
    );
};

export default SettingsMenu;

const ShortcutSettingsArea = ({ settings, changeSetting }) => {
    const changeShortcutSetting = (key, newValue) => {
        const newShortcutsSetting = {
            ...settings.shortcuts,
            [key]: newValue,
        };

        changeSetting("shortcuts", newShortcutsSetting);
    };

    return (
        <div>
            {/* Enabling shortcuts*/}
            <div>
                <span
                    className="pointer"
                    onClick={() => {
                        changeShortcutSetting(
                            "enable",
                            !settings.shortcuts.enable
                        );
                    }}
                >
                    {settings.shortcuts.enable ? "☑" : "☐"}
                </span>
                <span> 키보드로 통해 우/좌 이동하기</span>
            </div>

            {/* Changing keys */}
            <ul
                style={{
                    color: settings.shortcuts.enable ? undefined : "gray",
                }}
            >
                <li>
                    <span>◀ 키</span>
                    {settings.shortcuts.enable ? (
                        <ChangeKeyBindingSelector
                            currentKey={settings.shortcuts.backKey}
                            callbackOnChange={(key) => {
                                changeShortcutSetting("backKey", key);
                            }}
                        />
                    ) : (
                        <span>≪ - ≫</span>
                    )}
                </li>
                <li>
                    <span>▶ 키</span>
                    {settings.shortcuts.enable ? (
                        <ChangeKeyBindingSelector
                            currentKey={settings.shortcuts.forwardKey}
                            callbackOnChange={(key) => {
                                changeShortcutSetting("forwardKey", key);
                            }}
                        />
                    ) : (
                        <span>≪ - ≫</span>
                    )}
                </li>
            </ul>
        </div>
    );
};

const ChangeKeyBindingSelector = ({ currentKey, callbackOnChange }) => {
    const selectorRef = useRef(null);
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        // if do not click in selector space then unselect
        const clickedOutsideSelector = (event) => {
            if (
                selectorRef.current &&
                !selectorRef.current.contains(event.target)
            ) {
                setSelected(false);
            }
        };

        window.addEventListener("click", clickedOutsideSelector);
        return () => {
            window.removeEventListener("click", clickedOutsideSelector);
        };
    }, []);

    useEffect(() => {
        if (selected) {
            const onKeyDown = (event) => {
                callbackOnChange(event.key);
            };

            window.addEventListener("keydown", onKeyDown);
            return () => {
                window.removeEventListener("keydown", onKeyDown);
            };
        }
    }, [selected, callbackOnChange]);

    return (
        <span
            ref={selectorRef}
            onClick={() => {
                setSelected(true);
            }}
        >
            ≪
            {currentKey ? (
                /* specifically want spaces */ <span> {currentKey} </span>
            ) : (
                " "
            )}
            ≫
        </span>
    );
};
