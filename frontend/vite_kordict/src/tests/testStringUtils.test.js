import { getTopicMarker } from "../../util/stringUtils.js";

describe("Test suite for testing getTopicMarker()", () => {
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
