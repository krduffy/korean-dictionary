import React, { useRef } from "react";

import PropTypes from "prop-types";

import HanjaWriter from "./HanjaWriter.jsx";

const HanjaQuizzer = ({ hanjaChar, setShowTest }) => {
    const ref = useRef(null);

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
            <div style={{ border: "1px gold solid" }}>
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
                            doQuiz();
                        },
                    }}
                    ref={ref}
                />
            </div>
        </>
    );
};

export default HanjaQuizzer;
