import React, { useEffect, useRef } from "react";
import HanziWriter from "hanzi-writer";

const HanjaWriter = ({ character }) => {
  const divRef = useRef(null);
  const hanjaWriterRef = useRef(null);

  useEffect(() => {
    if (divRef.current && !hanjaWriterRef.current) {
      hanjaWriterRef.current = HanziWriter.create(divRef.current, character, {
        width: 150,
        height: 150,
      });
    }
  }, [character]);

  return <div ref={divRef} className="hanzi-writer"></div>;
};

export default HanjaWriter;
