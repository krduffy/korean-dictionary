import React, { useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import HanjaWriter from "../hanja-writing/HanjaWriter.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import PaginatedResults from "../paginated_results/PaginatedResults.jsx";
import ClipboardCopier from "../string_formatters/ClipboardCopier.jsx";
import StringWithHanja from "../string_formatters/StringWithHanja.jsx";
import StringWithNLP from "../string_formatters/StringWithNLP.jsx";
import TruncatorDropdown from "../string_formatters/TruncatorDropdown.jsx";

import "./styles/hanja-char-view-styles.css";

const HanjaCharView = ({ hanjaChar }) => {
    const [charData, setCharData] = useState({});
    const { apiFetch, loading, error } = useAPIFetcher();

    useEffect(() => {
        apiFetch(
            `http://127.0.0.1:8000/api/hanja_char/${hanjaChar}`,
            setCharData
        );
    }, [hanjaChar]);

    return (
        <>
            {loading ? (
                <LoadingMessage />
            ) : (
                <div>
                    <div className="main-info-section">
                        <div className="main-info-upper">
                            <div className="main-info-upper-left">
                                <div className="jahuneum">
                                    <span className="hanja-header">
                                        {hanjaChar}
                                    </span>{" "}
                                    <span className="meaning-reading-header">
                                        {charData["meaning_reading"]
                                            ? charData["meaning_reading"]
                                            : "훈음 정보가 없습니다."}
                                    </span>
                                </div>
                                <div className="main-info-tables">
                                    <table
                                        className="main-info-table"
                                        id="main-info-table-left"
                                    >
                                        <tbody>
                                            <tr className="main-info-table-row">
                                                <th className="main-info-table-head">
                                                    획수
                                                </th>
                                                <td className="main-info-table-data">
                                                    {charData["strokes"]
                                                        ? charData["strokes"] +
                                                          "획"
                                                        : "-"}
                                                </td>
                                            </tr>

                                            <tr className="main-info-table-row">
                                                <th className="main-info-table-head">
                                                    부수
                                                </th>
                                                <td className="main-info-table-data">
                                                    {charData["radical"] ? (
                                                        <StringWithHanja
                                                            string={
                                                                charData[
                                                                    "radical"
                                                                ]
                                                            }
                                                        />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>

                                            <tr className="main-info-table-row">
                                                <th className="main-info-table-head">
                                                    모양자 분해
                                                </th>
                                                <td className="main-info-table-data">
                                                    {charData[
                                                        "decomposition"
                                                    ] ? (
                                                        <StringWithHanja
                                                            string={
                                                                charData[
                                                                    "decomposition"
                                                                ]
                                                            }
                                                        />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table
                                        className="main-info-table"
                                        id="main-info-table-right"
                                    >
                                        <tbody>
                                            <tr className="main-info-table-row">
                                                <th className="main-info-table-head">
                                                    급수별
                                                </th>
                                                <td className="main-info-table-data">
                                                    {charData["exam_level"]
                                                        ? charData["exam_level"]
                                                        : "-"}
                                                </td>
                                            </tr>

                                            <tr className="main-info-table-row">
                                                <th className="main-info-table-head">
                                                    교육용
                                                </th>
                                                <td className="main-info-table-data">
                                                    {charData["grade_level"]
                                                        ? charData[
                                                              "grade_level"
                                                          ]
                                                        : "-"}
                                                </td>
                                            </tr>

                                            <tr className="main-info-table-row">
                                                <th className="main-info-table-head">
                                                    유니코드
                                                </th>
                                                <td className="main-info-table-data">
                                                    U+
                                                    {hanjaChar
                                                        .charCodeAt(0)
                                                        .toString(16)
                                                        .toUpperCase()}
                                                </td>
                                                <td>
                                                    <ClipboardCopier
                                                        string={hanjaChar}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="main-info-upper-right">
                                <OnDemandHanjaDrawer hanjaChar={hanjaChar} />
                            </div>
                        </div>

                        {/* undecided on if this should be included
                        
                        {charData["explanation"] && (
                            <div className="main-info-lower">
                                <TruncatorDropdown>
                                    {charData["explanation"]
                                        .replaceAll(/\n{2,}/g, "\n")
                                        .split(/\n+/)
                                        .map((paragraph, id) => (
                                            <div key={id}>
                                                <StringWithNLP
                                                    string={paragraph}
                                                />
                                            </div>
                                        ))}
                                </TruncatorDropdown>
                            </div>
                            
                        )} */}
                    </div>

                    <div className="additional-info-section-header">
                        연관단어
                    </div>
                    <div className="example-container">
                        <PaginatedResults
                            searchType="search_hanja_examples"
                            searchTerm={hanjaChar}
                            functions={null}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

HanjaCharView.propTypes = {
    hanjaChar: PropTypes.string.isRequired,
};

export default HanjaCharView;

const OnDemandHanjaDrawer = ({ hanjaChar }) => {
    const ref = useRef(null);

    const handleClick = () => {
        if (ref.current) {
            ref.current.loopCharacterAnimation();
        }
    };

    return (
        <>
            <HanjaWriter
                character={hanjaChar}
                writerArgs={{ width: 150, height: 150 }}
                ref={ref}
            />
            <button className="hanja-play-button" onClick={handleClick}>
                획순 보기
            </button>
        </>
    );
};
