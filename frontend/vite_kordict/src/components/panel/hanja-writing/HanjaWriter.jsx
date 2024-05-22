import React, { useEffect, useRef } from "react";

import HanziWriter from "hanzi-writer";
import PropTypes from "prop-types";

const HanjaWriter = ({ character, writerArgs }) => {
    const divRef = useRef(null);
    const hanjaWriterRef = useRef(null);

    useEffect(() => {
        if (divRef.current && !hanjaWriterRef.current) {
            hanjaWriterRef.current = HanziWriter.create(
                divRef.current,
                character,
                writerArgs
            );
            setTimeout(() => {
                hanjaWriterRef.current.animateCharacter();
            }, 1000);
        }
    }, [character]);

    return <div ref={divRef} className="hanzi-writer"></div>;
};

HanjaWriter.propTypes = {
    character: PropTypes.string.isRequired,
};

export default HanjaWriter;
