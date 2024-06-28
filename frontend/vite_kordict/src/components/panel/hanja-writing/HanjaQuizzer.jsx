import React, { useRef, useState } from "react";

import PropTypes from "prop-types";

import { callAfterMs } from "../../../../util/domUtils.js";
import { getElementSizing } from "../../../../util/domUtils.js";

import PopupBox from "../string_formatters/PopupBox.jsx";
import HanjaWriter from "./HanjaWriter.jsx";

const HanjaQuizzer = ({ hanjaChar, setShowTest }) => {
    const ref = useRef(null);
    const containerDivRef = useRef(null);
    const [showInstructionMessage, setShowInstructionMessage] = useState(false);

    const outlineShownRef = useRef(false);

    const demonstrateQuiz = async () => {
        if (ref.current) {
            setShowInstructionMessage(true);

            const waitTime = 400;
            const flickers = 2;

            for (let i = 0; i < flickers; i++) {
                await callAfterMs(() => {
                    ref.current.showOutline();
                    outlineShownRef.current = true;
                }, waitTime);
                await callAfterMs(() => {
                    ref.current.hideOutline();
                    outlineShownRef.current = false;
                }, waitTime);
            }

            await callAfterMs(() => setShowInstructionMessage(false), 200);
        }
    };

    const toggleOutline = () => {
        if (ref.current) {
            if (outlineShownRef.current) {
                ref.current.hideOutline();
                outlineShownRef.current = false;
            } else {
                ref.current.showOutline();
                outlineShownRef.current = true;
            }
        }
    };

    const doQuiz = () => {
        if (ref.current) {
            ref.current.quiz({
                onComplete: function (data) {
                    setTimeout(() => {
                        doQuiz();
                    }, 1000);
                },
            });
        }
    };

    return (
        <>
            <div ref={containerDivRef}>
                <HanjaWriter
                    character={hanjaChar}
                    writerArgs={{
                        width: 150,
                        height: 150,
                        showCharacter: false,
                        showOutline: false,
                        showHintAfterMisses: 2,
                        highlightOnComplete: true,
                        highlightColor: "#f0c507",
                        drawingWidth: 10,
                        radicalColor: "#0774f0",
                        onLoadCharDataSuccess: () => {
                            (async () => {
                                await demonstrateQuiz();
                                doQuiz();
                            })();
                        },
                    }}
                    ref={ref}
                />
            </div>

            <div
                style={{
                    paddingTop: "5px",
                    fontSize: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <button
                    className="hanja-play-button"
                    title="테두리 유무 전환"
                    onClick={toggleOutline}
                >
                    테두리⇄
                </button>
                <button
                    className="hanja-play-button"
                    title="재생기로 가기"
                    onClick={() => setShowTest(false)}
                >
                    재생기
                </button>
            </div>

            {showInstructionMessage &&
                (() => {
                    const dim = getElementSizing(containerDivRef);

                    return (
                        <PopupBox
                            fromX={dim.centerX}
                            fromY={dim.centerY}
                            positioning={"above"}
                            padding={dim.paddingY}
                        >
                            <div
                                style={{
                                    paddingLeft: "10px",
                                    paddingRight: "10px",
                                }}
                            >
                                아래에 써보세요.
                            </div>
                        </PopupBox>
                    );
                })()}
        </>
    );
};

export default HanjaQuizzer;
