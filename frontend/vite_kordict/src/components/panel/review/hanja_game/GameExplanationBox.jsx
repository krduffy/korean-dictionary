import React from "react";

import PopupBox from "../../string_formatters/PopupBox.jsx";

import "./hanja-game-styles.css";

const GameExplanationBox = ({ fromX, fromY }) => {
    return (
        <PopupBox fromX={fromX} fromY={fromY} positioning="fit" padding={10}>
            <div className="game-explanation-box">
                <div>한자 게임</div>

                <div>
                    한자어의 구성 자(字)를 하나씩 이어서 자 통로를 완성하는
                    게임입니다.
                </div>

                <div>
                    규칙:
                    <ul>
                        <li>
                            첫 번째 한자어는 주어진 <span>출발 자</span>를
                            포함해야 합니다.
                        </li>
                        <li>
                            마지막 한자어는 주어진 <span>도착 자</span>를
                            포함해야 합니다.
                        </li>
                        <li>통로는 4개 이하의 한자어로 구성되어야 합니다.</li>
                        <li>
                            각 한자어는 4자 이하여야 합니다.
                            <span>사자성어는 덤!</span>
                        </li>
                        <li>
                            이어지는 자는 반드시 한자어의 마지막 글자일 필요는
                            없습니다.
                        </li>
                        <li>
                            출발 자, 도착 자 둘 다 포함되는 한자어가 있다면
                            갈끔하게 1자로만 입력할 수 있습니다.
                        </li>
                    </ul>
                </div>

                <div>
                    예시: 출발 자 (金 금 쇠)에서 도착 자 (出 날 출)까지 잇기
                    <div>금요일 金曜日</div>
                    <div>화요일 火曜日</div>
                    <div>분화 噴火</div>
                    <div>분출 噴出</div>
                </div>

                <div>
                    게임을 하면서 어휘력과 조어력을 향상시키고 어원을
                    알아갑시다!
                </div>
            </div>
        </PopupBox>
    );
};

export default GameExplanationBox;
