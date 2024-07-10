import React from "react";

import StringWithHanja from "../../string_formatters/StringWithHanja.jsx";

const SenseHistoryInfo = ({ historyInfo }) => {
    const getRowForCentury = (centuryInfo) => {
        return (
            <tr>
                <td>{centuryInfo.century}세기</td>
                <td>{centuryInfo.mark}</td>
                <td>
                    <ul>
                        {centuryInfo.history_example_info &&
                            centuryInfo.history_example_info.map(
                                (example, innerId) => (
                                    <li key={innerId}>
                                        <div>
                                            <StringWithHanja
                                                string={example.example}
                                            />
                                        </div>

                                        <div className="source">
                                            <StringWithHanja
                                                string={example.source}
                                            />
                                        </div>
                                    </li>
                                )
                            )}
                    </ul>
                </td>
            </tr>
        );
    };

    return (
        <div>
            <table
                className="history-header-info-table tbmargin-10"
                style={{
                    borderSpacing: "0px 10px",
                }}
            >
                <colgroup>
                    <col width={"20%"} />
                    <col width={"80%"} />
                </colgroup>

                <tbody>
                    <tr className="tbpad-10">
                        <th className="history-header-table-header">이형태</th>
                        <td className="history-header-table-data">
                            {historyInfo.allomorph}
                        </td>
                    </tr>
                    <tr className="tbpad-10">
                        <th className="history-header-table-header">변화</th>
                        <td className="history-header-table-data">
                            {historyInfo.word_form}
                        </td>
                    </tr>
                    <tr className="tbpad-10">
                        <th className="history-header-table-header">설명</th>
                        <td className="history-header-table-data">
                            {historyInfo.desc}
                        </td>
                    </tr>
                </tbody>
            </table>

            {historyInfo.history_sense_info.length > 0 && (
                <div className="curved-box-nest1">
                    <div className="curved-box-header textcentered">
                        세기별 용례
                    </div>
                    <div className="pad-10">
                        <table
                            style={{
                                borderCollapse: "separate",
                                borderSpacing: "0px 10px",
                            }}
                        >
                            <colgroup>
                                <col width={"15%"} />
                                <col width={"15%"} />
                                <col width={"70%"} />
                            </colgroup>

                            <thead>
                                <tr>
                                    <th className="tbpad-10 underlined">
                                        세기
                                    </th>
                                    <th className="tbpad-10 underlined">
                                        형태
                                    </th>
                                    <th className="tbpad-10 underlined">
                                        용례
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {historyInfo.history_sense_info[0].history_century_info.map(
                                    (centuryInfo, id) => (
                                        <React.Fragment key={id}>
                                            {getRowForCentury(centuryInfo)}
                                        </React.Fragment>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SenseHistoryInfo;
