import React from "react";

import PopupBox from "../../string_formatters/PopupBox.jsx";

import "./hanja-game-styles.css";

const GameExplanationBox = ({ fromX, fromY }) => {
    return (
        <PopupBox fromX={fromX} fromY={fromY} positioning="fit" padding={25}>
            <div
                style={{ textAlign: "left", padding: "10px" }}
                className="game-explanation-box"
            >
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "20px",
                        textDecoration: "underline",
                    }}
                >
                    한자 게임
                </div>

                <div>
                    한자어의 구성 자(字)를 하나씩 이어서 자 통로를 완성하는
                    게임입니다.
                    <br />
                    위에 있는 한자를 아래에 있는 판의 칸까지 끌면 한자어를 지을
                    수 있습니다.
                </div>

                <div>
                    <span
                        style={{
                            fontSize: "15px",
                        }}
                    >
                        규칙:
                    </span>
                    <ul className="explanation-list">
                        <li>
                            첫 번째 한자어는 주어진 출발 자를 포함해야 합니다.
                        </li>
                        <li>
                            마지막 한자어는 주어진 도착 자를 포함해야 합니다.
                        </li>
                        <li>통로는 4개 이하의 한자어로 구성되어야 합니다.</li>
                        <li>
                            각 한자어는 4자 이하여야 합니다. (사자성어는 덤!)
                        </li>
                        <li>
                            이어지는 자는 반드시 한자어의 마지막 글자일 필요는
                            없습니다.
                        </li>
                        <li>
                            출발 자, 도착 자 둘 다 포함되는 한자어가 있다면
                            갈끔하게 1자로만 완료할 수 있습니다.
                        </li>
                    </ul>
                </div>

                <div>
                    예시:
                    <ul className="explanation-list">
                        <li style={{ paddingBottom: "5px" }}>
                            출발 자 <span style={{ color: "red" }}>金</span>부터
                            도착 자{" "}
                            <span style={{ color: "midnightblue" }}>出</span>
                            까지 잇기:
                        </li>
                        <li>
                            금요일 <span style={{ color: "red" }}>金</span>
                            <span style={{ color: "orange" }}>曜</span>日
                        </li>
                        <li>
                            화요일 <span style={{ color: "yellow" }}>火</span>
                            <span style={{ color: "orange" }}>曜</span>日
                        </li>
                        <li>
                            분화 <span style={{ color: "green" }}>噴</span>
                            <span style={{ color: "yellow" }}>火</span>
                        </li>
                        <li>
                            분출 <span style={{ color: "green" }}>噴</span>
                            <span style={{ color: "midnightblue" }}>出</span>
                        </li>
                    </ul>
                </div>

                <span>
                    게임을 하면서 어휘력과 조어력을 향상시키고 어원을
                    알아갑시다!
                </span>
            </div>
        </PopupBox>
    );
};

export default GameExplanationBox;
