import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";

import "./universal-styles.css";

const HanjaHoverBox = ({ character, x, y }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const [hoverBoxData, setHoverBoxData] = useState({});
    const { apiFetch, loading, error } = useAPIFetcher();

    useEffect(() => {
        const setData = async () => {
            const data = await apiFetch(
                `api/hanja_popup_view/?` + `character=${character}`,
                authInfo["token"]
            );
            setHoverBoxData(data);
        };

        setData();
    }, [character]);

    return (
        <>
            {loading ? (
                <></>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        left: x,
                        top: y,
                    }}
                >
                    <div className="hanja-hover-box">
                        {hoverBoxData && (
                            <div>
                                <div className="meaning-reading-section">
                                    <span>
                                        {character}{" "}
                                        {hoverBoxData["meaning_reading"]}
                                    </span>
                                </div>

                                {hoverBoxData["retrieved_words"] > 0 ? (
                                    <KoreanWordSection
                                        wordArray={hoverBoxData["words"]}
                                    />
                                ) : (
                                    <div>
                                        연관단어가 없습니다.
                                        {hoverBoxData["retrieved_words"]}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

HanjaHoverBox.propTypes = {
    character: PropTypes.string.isRequired,
};

/* highlighting hanja char that is same would be maybe nice touch; can also do in hanja results
when paginatedresults are shown */
const KoreanWordSection = ({ wordArray }) => {
    return (
        <div className="korean-word-section">
            {wordArray.map((wordData, id) => (
                <div key={id} className="single-hanja-example">
                    {wordData["kw_word"]} {wordData["kw_origin"]}
                </div>
            ))}
        </div>
    );
};

export default HanjaHoverBox;
