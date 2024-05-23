import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

import HanziWriter from "hanzi-writer";
import PropTypes from "prop-types";

const HanjaWriter = forwardRef(({ character, writerArgs }, ref) => {
    const divRef = useRef(null);
    const hanjaRef = useRef(null);

    useEffect(() => {
        if (divRef.current && !hanjaRef.current) {
            hanjaRef.current = HanziWriter.create(
                divRef.current,
                character,
                writerArgs
            );
        }
    }, [character]);

    useImperativeHandle(
        ref,
        () => {
            return {
                animateCharacter() {
                    hanjaRef.current.animateCharacter();
                },
                loopCharacterAnimation() {
                    hanjaRef.current.loopCharacterAnimation();
                },
            };
        },
        [ref]
    );

    return <div ref={divRef} className="hanzi-writer"></div>;
});

HanjaWriter.displayName = "HanjaWriter";

HanjaWriter.propTypes = {
    character: PropTypes.string.isRequired,
};

export default HanjaWriter;
