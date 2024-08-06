/**
 * Returns the appropriate topic marker for a given string. If the final character of `string` is
 * not a Korean syllable, returns an empty string.
 *
 * @param {string} string - The string whose topic marker should be returned.
 * @returns {"은" | "는" | ""} The appropriate topic marker for `string`.
 */
export const getTopicMarker = (string) => {
    /* This can seem magic-numbery, but for those interested in how to convert a unicode in the 
       Korean Syllables unicode block to its constituent jamo, see the Wikipedia article below.
       https://en.wikipedia.org/wiki/Korean_language_and_computers#Hangul_in_Unicode

       From the article,
        "
          Pre-composed hangul syllables in the Unicode hangul syllables block are algorithmically 
          defined with the following formula:
          [(initial) × 588 + (medial) × 28 + (final)] + 44032
        "

       Therefore the goal of this algorithm is to determine if `final` in the above equation is not 0
       (the syllable ends in a consonant sound).

       Returns '은' if string ends in batchim, final consonant or '는' if it ends in a vowel sound
       If the input does not end in a Korean syllable, returns ''
    */

    if (string.length < 1) return "";

    const lastChar = string.charAt(string.length - 1);

    if (isConsonant(lastChar)) {
        return "은";
    } else if (isVowel(lastChar)) {
        return "는";
    }

    const charCode = lastChar.charCodeAt(0);

    const FIRST_SYLLABLE = 0xac00;
    const LAST_SYLLABLE = 0xd7a3;

    if (charCode < FIRST_SYLLABLE || charCode > LAST_SYLLABLE) {
        return "";
    }

    if (((charCode - 44032) % 588) % 28 != 0) {
        return "은";
    }

    return "는";
};

/* Returns what a key on the english keyboard maps to on the korean keyboard, or
   `key` if `key` does not map to a different key on the korean keyboard. */
const engKeyToKoreanKey = (key) => {
    const caseMatters = ["Q", "W", "E", "R", "T"];
    if (!caseMatters.includes(key)) {
        key = key.toLowerCase();
    }

    switch (key) {
        case "q":
            return "ㅂ";
        case "Q":
            return "ㅃ";
        case "w":
            return "ㅈ";
        case "W":
            return "ㅉ";
        case "e":
            return "ㄷ";
        case "E":
            return "ㄸ";
        case "r":
            return "ㄱ";
        case "R":
            return "ㄲ";
        case "t":
            return "ㅅ";
        case "T":
            return "ㅆ";
        case "y":
            return "ㅛ";
        case "u":
            return "ㅕ";
        case "i":
            return "ㅑ";
        case "o":
            return "ㅐ";
        case "O":
            return "ㅒ";
        case "p":
            return "ㅔ";
        case "P":
            return "ㅖ";
        case "a":
            return "ㅁ";
        case "s":
            return "ㄴ";
        case "d":
            return "ㅇ";
        case "f":
            return "ㄹ";
        case "g":
            return "ㅎ";
        case "h":
            return "ㅗ";
        case "j":
            return "ㅓ";
        case "k":
            return "ㅏ";
        case "l":
            return "ㅣ";
        case "z":
            return "ㅋ";
        case "x":
            return "ㅌ";
        case "c":
            return "ㅊ";
        case "v":
            return "ㅍ";
        case "b":
            return "ㅠ";
        case "n":
            return "ㅜ";
        case "m":
            return "ㅡ";
    }
    return key;
};

const isConsonant = (jamo) => {
    return "ㅂㅈㄷㄱㅅㅁㄴㅇㄹㅎㅋㅌㅊㅍㅃㅉㄸㄲㅆ".includes(jamo);
};

const isVowel = (jamo) => {
    return "ㅛㅕㅑㅐㅔㅗㅓㅏㅣㅠㅜㅡㅖㅒ".includes(jamo);
};

const consonantOrVowel = (jamo) => {
    if (isConsonant(jamo)) {
        return "C";
    }
    if (isVowel(jamo)) {
        return "V";
    }
    return "N"; //neither
};

const toSyllable = (choseong, jungseong, jongseong) => {
    const choseongNum = choseong.charCodeAt(0) - 0x1100;
    const jungseongNum = jungseong.charCodeAt(0) - 0x1161;
    /* 0x11a7 instead of 11a8 to account for 0 possible */
    const jongseongNum = jongseong ? jongseong.charCodeAt(0) - 0x11a7 : 0;

    return String.fromCharCode(
        choseongNum * 588 + jungseongNum * 28 + jongseongNum + 44032
    );
};

const toChoseong = (compatabilityJamo) => {
    switch (compatabilityJamo) {
        case "ㄱ":
            return "ᄀ";
        case "ㄲ":
            return "ᄁ";
        case "ㄴ":
            return "ᄂ";
        case "ㄷ":
            return "ᄃ";
        case "ㄸ":
            return "ᄄ";
        case "ㄹ":
            return "ᄅ";
        case "ㅁ":
            return "ᄆ";
        case "ㅂ":
            return "ᄇ";
        case "ㅃ":
            return "ᄈ";
        case "ㅅ":
            return "ᄉ";
        case "ㅆ":
            return "ᄊ";
        case "ㅇ":
            return "ᄋ";
        case "ㅈ":
            return "ᄌ";
        case "ㅉ":
            return "ᄍ";
        case "ㅊ":
            return "ᄎ";
        case "ㅋ":
            return "ᄏ";
        case "ㅌ":
            return "ᄐ";
        case "ㅍ":
            return "ᄑ";
        case "ㅎ":
            return "ᄒ";
    }
    return "";
};

const toJungseong = (compatibilityJamo) => {
    switch (compatibilityJamo) {
        case "ㅏ":
            return "ᅡ";
        case "ㅐ":
            return "ᅢ";
        case "ㅑ":
            return "ᅣ";
        case "ㅒ":
            return "ᅤ";
        case "ㅓ":
            return "ᅥ";
        case "ㅔ":
            return "ᅦ";
        case "ㅕ":
            return "ᅧ";
        case "ㅖ":
            return "ᅨ";
        case "ㅗ":
            return "ᅩ";
        case "ㅘ":
            return "ᅪ";
        case "ㅙ":
            return "ᅫ";
        case "ㅚ":
            return "ᅬ";
        case "ㅛ":
            return "ᅭ";
        case "ㅜ":
            return "ᅮ";
        case "ㅝ":
            return "ᅯ";
        case "ㅞ":
            return "ᅰ";
        case "ㅟ":
            return "ᅱ";
        case "ㅠ":
            return "ᅲ";
        case "ㅡ":
            return "ᅳ";
        case "ㅢ":
            return "ᅴ";
        case "ㅣ":
            return "ᅵ";
    }
    return "";
};

const toJongseong = (compatibilityJamo) => {
    switch (compatibilityJamo) {
        case "ㄱ":
            return "ᆨ";
        case "ㄲ":
            return "ᆩ";
        case "ㄳ":
            return "ᆪ";
        case "ㄴ":
            return "ᆫ";
        case "ㄵ":
            return "ᆬ";
        case "ㄶ":
            return "ᆭ";
        case "ㄷ":
            return "ᆮ";
        case "ㄹ":
            return "ᆯ";
        case "ㄺ":
            return "ᆰ";
        case "ㄻ":
            return "ᆱ";
        case "ㄼ":
            return "ᆲ";
        case "ㄽ":
            return "ᆳ";
        case "ㄾ":
            return "ᆴ";
        case "ㄿ":
            return "ᆵ";
        case "ㅀ":
            return "ᆶ";
        case "ㅁ":
            return "ᆷ";
        case "ㅂ":
            return "ᆸ";
        case "ㅄ":
            return "ᆹ";
        case "ㅅ":
            return "ᆺ";
        case "ㅆ":
            return "ᆻ";
        case "ㅇ":
            return "ᆼ";
        case "ㅈ":
            return "ᆽ";
        case "ㅊ":
            return "ᆾ";
        case "ㅋ":
            return "ᆿ";
        case "ㅌ":
            return "ᇀ";
        case "ㅍ":
            return "ᇁ";
        case "ㅎ":
            return "ᇂ";
    }
    return "";
};

const mergeJungseong = (v1, v2) => {
    if (v1 === "ㅗ") {
        if (v2 === "ㅏ") return "ㅘ";
        if (v2 === "ㅐ") return "ㅙ";
        if (v2 === "ㅣ") return "ㅚ";
    } else if (v1 === "ㅜ") {
        if (v2 === "ㅓ") return "ㅝ";
        if (v2 === "ㅔ") return "ㅞ";
        if (v2 === "ㅣ") return "ㅟ";
    } else if (v1 === "ㅡ") {
        if (v2 === "ㅣ") return "ㅢ";
    }

    return null;
};

const mergeJongseong = (c1, c2) => {
    if (c1 === "ㄱ") {
        if (c2 === "ㅅ") return "ㄳ";
    } else if (c1 === "ㄴ") {
        if (c2 === "ㅈ") return "ㄵ";
        if (c2 === "ㅎ") return "ㄶ";
    } else if (c1 === "ㄹ") {
        if (c2 === "ㄱ") return "ㄺ";
        if (c2 === "ㅁ") return "ㄻ";
        if (c2 === "ㅂ") return "ㄼ";
        if (c2 === "ㅅ") return "ㄽ";
        if (c2 === "ㅌ") return "ㄾ";
        if (c2 === "ㅍ") return "ㄿ";
        if (c2 === "ㅎ") return "ㅀ";
    } else if (c1 === "ㅂ") {
        if (c2 === "ㅅ") return "ㅄ";
    }

    return null;
};

const arrayToSyllable = (array) => {
    if (array.length <= 1) {
        return array[0];
    } else if (array.length == 2) {
        return toSyllable(toChoseong(array[0]), toJungseong(array[1]));
    } else if (array.length == 3) {
        return toSyllable(
            toChoseong(array[0]),
            toJungseong(array[1]),
            toJongseong(array[2])
        );
    }
    console.error("Array to syllable: array unexpectedly long: " + array);
    return array.join("");
};

/**
 * Remaps any english character in a string to its corresponding letter on the korean keyboard and
 * combines any combinable jamo in the resulting remapping.
 *
 * For example,
 * engKeyboardToKorean("gksrnrdj") === "한국어".
 *
 * @param {string} string - The string to remap.
 * @returns {string} The remapped string.
 */
export const engKeyboardToKorean = (string) => {
    /* Returns what a string of characters from the english keyboard would be if the user
     instead used the korean keyboard.

     For example,
        engKeyboardToKorean("gksrnrdj") = "한국어"
        engKeyboardToKorean("줄rl") = "줄기"
    */

    let tokens = string.split("");
    tokens = tokens.map(engKeyToKoreanKey);
    for (let i = 0; i < tokens.length; i++) {
        tokens[i] = [consonantOrVowel(tokens[i]), [tokens[i]]];
    }

    /*
     * Four passes through tokens can correctly combine jamo
     *
     * Pass 1 = combine consecutive vowels into one vowel if they can go together
     *          (ㅜ and ㅣ can, while ㅓ and ㅓ cannot, for example)
     * Pass 2 = combine consecutive consonant -> vowel into a single CV (consonant-vowel)
     * Pass 3 = combine consecutive consonants into one consonant if they can go together
     *          (ㅂ and ㅅ can, while ㄹ and ㅋ cannot, for example)
     * Pass 4 = combine consecutive CV -> consonant into one syllable block
     *
     * In the code, these passes are made backwards to prevent in place array splicing from
     * altering the iteration of the for loops
     *
     * Example of four passes
     * Initial list of jamo: [C, V, C, V, V, C, C]
     * -> [C, V, C, VV, C, C]
     * -> [CV, CVV, C, C]
     * -> [CV, CVV, CC]
     * -> [CV, CVVCC]
     * Done. This resultant word might be 지쥟 (not a real word)
     */

    /* Pass 1 */
    /* Combined vowels are still represented as V (not VV) despite being diphthongs */
    for (let i = tokens.length - 2; i >= 0; i--) {
        if (
            tokens[i][0] === "V" &&
            tokens[i + 1][0] === "V" &&
            mergeJungseong(tokens[i][1][0], tokens[i + 1][1][0]) != null
        ) {
            const replacement = [
                "V",
                [mergeJungseong(tokens[i][1][0], tokens[i + 1][1][0])],
            ];
            tokens.splice(i, 2, replacement);
        }
    }

    /* Pass 2 */
    for (let i = tokens.length - 2; i >= 0; i--) {
        if (tokens[i][0] === "C" && tokens[i + 1][0] === "V") {
            const replacement = ["CV", [tokens[i][1][0], tokens[i + 1][1][0]]];
            tokens.splice(i, 2, replacement);
        }
    }

    /* Pass 3 */
    /* 겹받침 written as C, not CC */
    for (let i = tokens.length - 2; i >= 0; i--) {
        if (
            tokens[i][0] === "C" &&
            tokens[i + 1][0] === "C" &&
            mergeJongseong(tokens[i][1][0], tokens[i + 1][1][0]) != null &&
            /* below is to avoid a corner case with 3 consonants in a row,
               which could have the first and second OR second and third combined
               eg ㄹ ㄱ ㅅ
             */
            !(i >= 1 && mergeJongseong(tokens[i - 1][1][0], tokens[i][1][0]))
        ) {
            const replacement = [
                "C",
                [mergeJongseong(tokens[i][1][0], tokens[i + 1][1][0])],
            ];
            tokens.splice(i, 2, replacement);
        }
    }

    /* Pass 4 */
    for (let i = tokens.length - 2; i >= 0; i--) {
        if (tokens[i][0] === "CV" && tokens[i + 1][0] === "C") {
            const replacement = [
                "CVC",
                [tokens[i][1][0], tokens[i][1][1], tokens[i + 1][1][0]],
            ];
            tokens.splice(i, 2, replacement);
        }
    }

    return tokens.map((token) => arrayToSyllable(token[1])).join("");
};

/**
 * Determines whether a string is a single hanja character.
 * The only considered hanja characters are those in the CJK Unified Ideograph block of
 * Unicode addresses.
 *
 * @param {string} string - The string to analyze.
 * @returns {boolean} - True if the string has a length of 1 and the character is a Hanja character, false otherwise.
 */
export const isSingleHanja = (string) => {
    if (string.length !== 1) return false;
    const charCode = string.charCodeAt(0);
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    return charCode >= 0x4e00 && charCode <= 0x9fff;
};

/**
 * Isolates Hanja characters from a string.
 *
 * For example,
 * isolateHanja("한자(漢字)만으로 쓴 글.") = ["한자(", "漢", "字", "")만으로 쓴 글."]
 *
 * @param {string} string - The string to isolate Hanja from.
 * @returns {string[]} An array of strings, including isolated Hanja characters and other segments of the original string.
 */
export const isolateHanja = (string) => {
    /* 4e00 through 9fff is block of CJK unified ideographs in unicode */
    return string.split(/([\u4e00-\u9fff])/g).filter((str) => str.length > 0);
};
