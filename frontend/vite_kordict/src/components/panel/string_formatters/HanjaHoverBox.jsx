import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import PopupBox from "./PopupBox.jsx";

import "./universal-styles.css";

const HanjaHoverBox = ({ character, mouseX, mouseY }) => {
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
                <PopupBox
                    fromX={mouseX}
                    fromY={mouseY}
                    positioning={"fit"}
                    padding={10}
                >
                    {hoverBoxData && (
                        <div
                            className="shaded-background"
                            style={{ minWidth: "200px", color: "white" }}
                        >
                            <div className="section-header textcentered full-width">
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
                                <div className="pad-10 ">
                                    연관단어가 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                </PopupBox>
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
                    {wordData["word"]} {wordData["origin"]}
                </div>
            ))}
        </div>
    );
};

export default HanjaHoverBox;
