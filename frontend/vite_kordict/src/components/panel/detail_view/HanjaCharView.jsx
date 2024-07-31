import React, { useContext, useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";

import { useAPIFetcher } from "../../../hooks/useAPIFetcher.js";

import { AuthenticationInfoContext } from "../../../App.jsx";
import HanjaAnimatorAndTester from "../hanja-writing/HanjaAnimatorAndTester.jsx";
import ErrorMessage from "../messages/ErrorMessage.jsx";
import { LoadingMessage } from "../messages/LoadingMessage.jsx";
import PaginatedResults from "../paginated_results/PaginatedResults.jsx";
import ClipboardCopier from "../string_formatters/ClipboardCopier.jsx";
import Href from "../string_formatters/Href.jsx";
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

    const explanationRef = useRef(null);

    const [animatorLoaded, setAnimatorLoaded] = useState(false);

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
                <>
                    <AbridgedMainInfo character={hanjaChar} />{" "}
                    <LoadingMessage />
                </>
            ) : error ? (
                <>
                    <AbridgedMainInfo character={hanjaChar} />
                    <ErrorMessage errorResponse={response} />
                    <br />
                </>
            ) : (
                <div>
                    {/* MAIN INFO */}
                    <div className="main-info-section">
                        {/* CHARACTER, STROKES, UNICODE, ANIMATION PLAYER ETC */}
                        <div>
                            {/* UPPER LEFT (JAHUNEUM + UNICODE ETC) */}
                            <div
                                className="lrpad-10"
                                style={{
                                    /* 150 is to make room for hanja writer */
                                    width: "calc(100% - 150px)",
                                    display: "inline-block",
                                    verticalAlign: "top",
                                    /* padding to prevent stuttering when toggling from 
                                       hanja tester to stroke playback */
                                    paddingBottom: "10px",
                                    minHeight: "200px",
                                }}
                            >
                                <div
                                    style={{
                                        paddingBottom: "10px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: "40px",
                                            paddingRight: "20px",
                                        }}
                                    >
                                        {hanjaChar}
                                    </span>
                                    <span style={{ fontSize: "20px" }}>
                                        {charData["meaning_reading"]
                                            ? charData["meaning_reading"]
                                            : "훈음 정보가 없습니다."}
                                    </span>
                                </div>

                                <div className="full-width">
                                    <table
                                        style={{
                                            width: "50%",
                                            display: "inline-block",
                                        }}
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
                                                    {/* if ends in mmah then it is from makemeahanzi*/}
                                                    {charData["radical"] ? (
                                                        <StringWithHanja
                                                            string={charData[
                                                                "radical"
                                                            ].replace(
                                                                "mmah",
                                                                ""
                                                            )}
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
                                        style={{
                                            width: "50%",
                                            display: "inline-block",
                                        }}
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

                            <div
                                style={{
                                    width: "150px",
                                    display: "inline-block",
                                    verticalAlign: "top",
                                }}
                            >
                                <HanjaAnimatorAndTester
                                    hanjaChar={hanjaChar}
                                    onLoad={() => {
                                        if (!animatorLoaded) {
                                            setAnimatorLoaded(true);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* sources for data at top */}
                        <div
                            className="tbmargin-10"
                            style={{
                                paddingTop: "10px",
                                display: "grid",
                            }}
                        >
                            <div
                                style={{
                                    gridRow: "1 / 2",
                                    gridColumn: "1 / 2",
                                }}
                            >
                                {charData?.radical &&
                                charData["radical"].endsWith("mmah") ? (
                                    <>
                                        <div className="source">
                                            훈음, 획수, 급수별, 교육용 출처:{" "}
                                            <Href
                                                link={`https://namu.wiki/w/${hanjaChar}`}
                                                innerText={"나무위키"}
                                            />
                                        </div>
                                        <div className="source">
                                            부수, 모양자 분해 출처:{" "}
                                            <Href
                                                link={
                                                    "https://github.com/skishore/makemeahanzi"
                                                }
                                                innerText={"makemeahanzi"}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="source">
                                            훈음, 획수, 부수, 급수별, 교육용
                                            출처:{" "}
                                            <Href
                                                link={`https://namu.wiki/w/${hanjaChar}`}
                                                innerText={"나무위키"}
                                            />
                                        </div>
                                        <div className="source">
                                            모양자 출처:{" "}
                                            <Href
                                                link={
                                                    "https://github.com/skishore/makemeahanzi"
                                                }
                                                innerText={"makemeahanzi"}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {animatorLoaded && (
                                <div
                                    style={{
                                        gridRow: "1 / 2",
                                        gridColumn: "2 / 3",
                                    }}
                                    className="source"
                                >
                                    획순 재생기 및 시험기 출처:{" "}
                                    <Href
                                        link={"https://hanziwriter.org/"}
                                        innerText={"hanziwriter"}
                                    />
                                </div>
                            )}
                        </div>

                        {/* EXPLANATION OF CHARACTER */}
                        {charData["explanation"] && (
                            <div className="curved-box tbmargin-10">
                                <div className="curved-box-header">
                                    자세한 설명
                                </div>
                                <div ref={explanationRef} className="pad-10">
                                    <TruncatorDropdown
                                        onCollapseScrollToRef={explanationRef}
                                    >
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
                                    <div className="source tbmargin-10">
                                        출처:{" "}
                                        <Href
                                            link={`https://namu.wiki/w/${hanjaChar}`}
                                            innerText={"나무위키"}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* WORDS THAT CONTAIN THIS CHARACTER; can load whether above is successful or not */}
            {!loading && (
                <div className="curved-box tbmargin-10">
                    <div className="curved-box-header">연관단어</div>

                    <div className="pad-10">
                        <PaginatedResults
                            searchType="search_hanja_examples"
                            searchTerm={hanjaChar}
                            nestLevel={1}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

const AbridgedMainInfo = ({ character }) => {
    return (
        <div
            className=" main-info-section lrpad-10"
            style={{
                /* 150 is to make room for hanja writer */
                width: "calc(100% - 150px)",
                display: "inline-block",
                verticalAlign: "top",
                /* padding to prevent stuttering when toggling from 
                                       hanja tester to stroke playback */
                paddingBottom: "20px",
                fontSize: "40px",
                paddingRight: "20px",
            }}
        >
            {character}
        </div>
    );
};

HanjaCharView.propTypes = {
    hanjaChar: PropTypes.string.isRequired,
};

export default HanjaCharView;
