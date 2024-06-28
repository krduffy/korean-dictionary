import React, { useRef, useState } from "react";

import PropTypes from "prop-types";

import HanjaQuizPopup from "./HanjaQuizzer.jsx";
import HanjaWriter from "./HanjaWriter.jsx";

/**
 * A component that renders a Hanja character stroke animation player. It can be paused and played.
 *
 * @param {Object} props - Component props.
 * @param {string} props.hanjaChar - The character to view the animation player for. Should consist of exactly one (`hanjaChar.length == 1`) hanja character.
 * @returns {React.JSX.Element} The rendered HanjaAnimationPlayer component.
 */
const HanjaAnimationPlayer = ({ hanjaChar, setShowTest }) => {
    const ref = useRef(null);
    const [hanjaLoadError, setHanjaLoadError] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const interactedRef = useRef(false);

    const play = () => {
        if (ref.current) {
            if (interactedRef.current) {
                ref.current.resumeAnimation();
            } else {
                interactedRef.current = true;
                ref.current.loopCharacterAnimation();
            }
        }
    };

    const pause = () => {
        if (ref.current) {
            ref.current.pauseAnimation();
        }
    };

    const test = () => {
        setShowTest(true);
    };

    return hanjaLoadError ? (
        <></>
    ) : (
        <>
            <HanjaWriter
                character={hanjaChar}
                writerArgs={{
                    width: 150,
                    height: 150,
                    onLoadCharDataSuccess: () => {
                        // if the control panel is not shown only after character load then there
                        // is a flash of the control panel before quickly disappearing, which is
                        // visually unpleasing
                        setShowControls(true);
                    },
                    onLoadCharDataError: () => {
                        setHanjaLoadError(true);
                    },
                }}
                ref={ref}
            />

            {/* BUTTONS BELOW PLAYER */}
            {showControls && (
                <div className="hanja-writer-controls">
                    <button className="hanja-play-button" onClick={play}>
                        ⏵
                    </button>
                    <button className="hanja-play-button" onClick={pause}>
                        ⏸
                    </button>
                    <button className="hanja-play-button" onClick={test}>
                        시험
                    </button>
                </div>
            )}
        </>
    );
};

HanjaAnimationPlayer.propTypes = {
    hanjaChar: PropTypes.string.isRequired,
};

export default HanjaAnimationPlayer;
