import React from "react";

import StringWithHanja from "../../string_formatters/StringWithHanja.jsx";

const SenseHistoryInfo = ({ historyInfo }) => {
    return (
        <div>
            <table className="history-header-info-table">
                <colgroup>
                    <col width={"15%"} />
                    <col width={"85%"} />
                </colgroup>

                <tbody>
                    <tr className="history-header-table-row">
                        <th className="history-header-table-header">이형태</th>
                        <td className="history-header-table-data">
                            {historyInfo.allomorph}
                        </td>
                    </tr>
                    <tr className="history-header-table-row">
                        <th className="history-header-table-header">변화</th>
                        <td className="history-header-table-data">
                            {historyInfo.word_form}
                        </td>
                    </tr>
                    <tr className="history-header-table-row">
                        <th className="history-header-table-header">설명</th>
                        <td className="history-header-table-data">
                            {historyInfo.desc}
                        </td>
                    </tr>
                </tbody>
            </table>

            {historyInfo.history_sense_info.length > 0 && (
                <table
                    style={{
                        borderCollapse: "collapse",
                    }}
                >
                    <caption>세기별 용례</caption>

                    <colgroup>
                        <col width={"15%"} />
                        <col width={"15%"} />
                        <col width={"70%"} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>세기</th>
                            <th>형태</th>
                            <th>용례</th>
                        </tr>
                    </thead>

                    <tbody>
                        {historyInfo.history_sense_info[0].history_century_info.map(
                            (centuryInfo, id) => (
                                <tr key={id}>
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
                                                                    string={
                                                                        example.example
                                                                    }
                                                                />
                                                            </div>

                                                            <div className="source">
                                                                <StringWithHanja
                                                                    string={
                                                                        example.source
                                                                    }
                                                                />
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                        </ul>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SenseHistoryInfo;
