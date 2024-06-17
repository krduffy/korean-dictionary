import {
    engKeyboardToKorean,
    getTopicMarker,
    isSingleHanja,
} from "../../util/stringUtils.js";

describe("Testing getTopicMarker", () => {
    const testMappings = {
        키런: "은",
        다: "는",
        거: "는",
        꿰: "는",
        킭: "은",
        죽: "은",
        ㅈ: "",
    };

    for (const input in testMappings) {
        const expectedOutput = testMappings[input];
        test(`Testing that getTopicMarker("${input}") returns "${expectedOutput}"`, () => {
            expect(getTopicMarker(input)).toBe(expectedOutput);
        });
    }
});

describe("Testing engKeyboardToKorean", () => {
    const testMappings = {
        zlfjs: "키런",
        "ekfrrhk th": "닭과 소",
        dlqfurdj: "입력어",
        _ek: "_다",
        EkRkTk: "따까싸",
        한rmf: "한글",
        rsetns: "ㄱㄴㄷ순",
        agwllrmmlmkn: "ㅁㅎ지ㅣ그ㅢㅡㅏㅜ",
        ekfrt: "닭ㅅ",
        // a definition (sense) for 어학
        "dhlrnrdjfmf dusrngkrjsk tmqemrgkrl dnlgks gkrans. Ehsms rmfjs gkrrhk(學科).":
            "외국어를 연구하거나 습득하기 위한 학문. 또는 그런 학과(學科).",
    };

    for (const input in testMappings) {
        const expectedOutput = testMappings[input];
        test(`Testing that engKeyboardToKorean("${input}") returns "${expectedOutput}"`, () => {
            expect(engKeyboardToKorean(input)).toBe(expectedOutput);
        });
    }
});

describe("Testing isSingleHanja", () => {
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
