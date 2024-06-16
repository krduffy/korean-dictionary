import { engKeyboardToKorean, getTopicMarker } from "../../util/stringUtils.js";

describe("Testing getTopicMarker()", () => {
    test("gets topic marker for 키런 to be 은", () => {
        expect(getTopicMarker("키런")).toBe("은");
    });
    test("gets topic marker for 다 to be 는", () => {
        expect(getTopicMarker("다")).toBe("는");
    });
    test("gets topic marker for 거 to be 는", () => {
        expect(getTopicMarker("거")).toBe("는");
    });
    test("gets topic marker for 꿰 to be 는", () => {
        expect(getTopicMarker("꿰")).toBe("는");
    });
    test("gets topic marker for 킭 to be 은", () => {
        expect(getTopicMarker("킭")).toBe("은");
    });
    test("gets topic marker for 죽 to be 은", () => {
        expect(getTopicMarker("죽")).toBe("은");
    });
    test("gets topic marker for ㅈ to be an empty string", () => {
        expect(getTopicMarker("ㅈ")).toBe("");
    });
});

describe("Testing engKeyboardToKorean()", () => {
    test('testing that engKeyboardToKorean(zlfjs) === "키런"', () => {
        expect(engKeyboardToKorean("zlfjs")).toBe("키런");
    });
    test('testing that engKeyboardToKorean(ekfrrhk th) === "닭과 소"', () => {
        expect(engKeyboardToKorean("ekfrrhk th")).toBe("닭과 소");
    });
    test('testing that engKeyboardToKorean(dlqfurdj) === "입력어"', () => {
        expect(engKeyboardToKorean("dlqfurdj")).toBe("입력어");
    });
    test('testing that engKeyboardToKorean(_ek) === "_다"', () => {
        expect(engKeyboardToKorean("_ek")).toBe("_다");
    });
    test('testing that engKeyboardToKorean(EkRkTk) === "따까싸"', () => {
        expect(engKeyboardToKorean("EkRkTk")).toBe("따까싸");
    });
    test('testing that engKeyboardToKorean(한rmf) === "한글"', () => {
        expect(engKeyboardToKorean("한rmf")).toBe("한글");
    });
});
