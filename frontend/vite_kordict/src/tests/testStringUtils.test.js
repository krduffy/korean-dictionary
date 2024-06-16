import {
    engKeyboardToKorean,
    getTopicMarker,
    isSingleHanja,
} from "../../util/stringUtils.js";

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
    test('testing that engKeyboardToKorean(rsetns) === "ㄱㄴㄷ순"', () => {
        expect(engKeyboardToKorean("rsetns")).toBe("ㄱㄴㄷ순");
    });
    test('testing that engKeyboardToKorean(agwllrmmlmkn) === "ㅁㅎ지ㅣ그ㅢㅡㅏㅜ"', () => {
        expect(engKeyboardToKorean("agwllrmmlmkn")).toBe("ㅁㅎ지ㅣ그ㅢㅡㅏㅜ");
    });
    test('testing that engKeyboardToKorean(ekfrt) === "닭ㅅ"', () => {
        expect(engKeyboardToKorean("ekfrt")).toBe("닭ㅅ");
    });
    // a definition (sense) for 어학
    test('testing that engKeyboardToKorean(dhlrnrdjfmf dusrngkrjsk tmqemrgkrl dnlgks gkrans. Ehsms rmfjs gkrrhk(學科).) === "외국어를 연구하거나 습득하기 위한 학문. 또는 그런 학과(學科)."', () => {
        expect(
            engKeyboardToKorean(
                "dhlrnrdjfmf dusrngkrjsk tmqemrgkrl dnlgks gkrans. Ehsms rmfjs gkrrhk(學科)."
            )
        ).toBe("외국어를 연구하거나 습득하기 위한 학문. 또는 그런 학과(學科).");
    });
});

describe("Testing isSingleHanja()", () => {
    test("testing that 一 is hanja (first in CJK range)", () => {
        expect(isSingleHanja("一")).toBe(true);
    });
    test("testing that ䷿ is not hanja (1 less than first in CJK range)", () => {
        expect(isSingleHanja("䷿")).toBe(false);
    });
    test("testing that 鿿 is hanja (last in CJK range)", () => {
        expect(isSingleHanja("鿿")).toBe(true);
    });
    test("testing that ꀀ is not hanja (1 more than last in CJK range)", () => {
        expect(isSingleHanja("ꀀ")).toBe(false);
    });
    test("testing that 血 is hanja", () => {
        expect(isSingleHanja("血")).toBe(true);
    });
    test("testing that 血血血 is not hanja (too long)", () => {
        expect(isSingleHanja("血血血")).toBe(false);
    });
});
