import React, { useContext } from "react";
import { ViewContext } from "../../Panel";
import PropTypes from "prop-types";

const SenseProverbInfo = ({ proverbInfo }) => {
  return (
    <div className="sense-proverb-list">
      <ul>
        {proverbInfo.map((proverb, id) => (
          <li key={id}>
            <SenseProverb proverb={proverb} />
          </li>
        ))}
      </ul>
    </div>
  );
};

SenseProverbInfo.propTypes = {
  proverbInfo: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      word: PropTypes.string.isRequired,
      definition: PropTypes.string.isRequired,
      link_target_code: PropTypes.number, // optional
    }),
  ).isRequired,
};

const SenseProverb = ({ proverb }) => {
  const updateViewAndPushToHistory =
    useContext(ViewContext)["updateViewAndPushToHistory"];
  return (
    <div className="sense-proverb">
      <span>{proverb.type}</span>
      <div
        onClick={() => {
          if (proverb.link_target_code) {
            updateViewAndPushToHistory({
              view: "detail_korean",
              value: proverb.link_target_code,
              searchBarInitialState: {
                boxContent: proverb.word,
                dictionary: "korean",
              },
            });
          }
        }}
      >
        <span>{proverb.word}</span>
        <span>{proverb.definition}</span>
      </div>
    </div>
  );
};

SenseProverb.propTypes = {
  proverb: PropTypes.shape({
    type: PropTypes.string.isRequired,
    word: PropTypes.string.isRequired,
    definition: PropTypes.string.isRequired,
    link_target_code: PropTypes.number, // optional
  }).isRequired,
};

export default SenseProverbInfo;
