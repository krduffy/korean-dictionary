import React, { useContext, useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import HanjaAnimatorAndTester from "../hanja-writing/HanjaAnimatorAndTester.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import PaginatedResults from "../paginated_results/PaginatedResults.jsx";
import ClipboardCopier from "../string_formatters/ClipboardCopier.jsx";
import StringWithHanja from "../string_formatters/StringWithHanja.jsx";
import StringWithNLP from "../string_formatters/StringWithNLP.jsx";
import TruncatorDropdown from "../string_formatters/TruncatorDropdown.jsx";

import "./styles/hanja-char-view-styles.css";

/**
 * A component that renders detailed data for a Hanja character to the entire view area.
 *
 * @param {Object} props - Component props.
 * @param {string} props.hanjaChar - The character to view data for. Should consist of exactly one (`hanjaChar.length == 1`) hanja character.
 * @returns {React.JSX.Element} The rendered HanjaCharView component.
 */
const HanjaCharView = ({ hanjaChar }) => {
    const authInfo = useContext(AuthenticationInfoContext)["authInfo"];
    const [charData, setCharData] = useState({});
    const { apiFetch, loading, error, response } = useAPIFetcher();

    useEffect(() => {
        const setData = async () => {
            const data = await apiFetch(
                `api/hanja_char/${hanjaChar}`,
                authInfo["token"]
            );
            setCharData(data);
        };
        setData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hanjaChar]);

    return (
        <>
            {loading ? (
                <LoadingMessage />
            ) : error ? (
                <ErrorMessage errorResponse={response} />
            ) : (
                <div>
                    {/* MAIN INFO */}
                    <div className="main-info-section">
                        {/* CHARACTER, STROKES, UNICODE, ANIMATION PLAYER ETC */}
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
                                <HanjaAnimatorAndTester hanjaChar={hanjaChar} />
                            </div>
                        </div>

                        {/* EXPLANATION OF CHARACTER */}
                        {charData["explanation"] && (
                            <div className="main-info-lower">
                                <div className="section-header">
                                    자세한 설명
                                </div>
                                <div className="truncator-dropdown-container">
                                    <TruncatorDropdown>
                                        {charData["explanation"]
                                            .replaceAll(/\n{2,}/g, "\n")
                                            .split(/\n/)
                                            .map(
                                                (
                                                    paragraph,
                                                    id,
                                                    paragraphArray
                                                ) => (
                                                    <div key={id}>
                                                        <StringWithNLP
                                                            string={paragraph}
                                                        />
                                                        {id !=
                                                            paragraphArray.length -
                                                                1 && (
                                                            <>
                                                                <br />
                                                                <br />
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                    </TruncatorDropdown>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* WORDS THAT CONTAIN THIS CHARACTER */}
                    <div className="section-header">연관단어</div>
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
