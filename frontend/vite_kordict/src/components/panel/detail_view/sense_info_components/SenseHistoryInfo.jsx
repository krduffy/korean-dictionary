import React from "react";

import StringWithHanja from "../../string_formatters/StringWithHanja.jsx";

const SenseHistoryInfo = ({ historyInfo }) => {
    return (
        <div className="sense-history-info">
            <p className="additional-info-section-header">역사 정보</p>

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
                <table className="history-examples-by-century-table">
                    <caption className="history-examples-by-century-table-caption">
                        세기별 용례
                    </caption>

                    <colgroup>
                        <col width={"15%"} />
                        <col width={"15%"} />
                        <col width={"70%"} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th className="history-examples-by-century-table-column-name">
                                세기
                            </th>
                            <th className="history-examples-by-century-table-column-name">
                                형태
                            </th>
                            <th className="history-examples-by-century-table-column-name">
                                용례
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {historyInfo.history_sense_info[0].history_century_info.map(
                            (centuryInfo, id) => (
                                <tr key={id}>
                                    <td className="history-examples-by-century-table-row-header">
                                        {centuryInfo.century}세기
                                    </td>
                                    <td className="history-examples-by-century-table-data">
                                        {centuryInfo.mark}
                                    </td>
                                    <td className="history-examples-by-century-table-data">
                                        <ul>
                                            {centuryInfo.history_example_info &&
                                                centuryInfo.history_example_info.map(
                                                    (example, innerId) => (
                                                        <li key={innerId}>
                                                            <div className="history-example">
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
