const engKeyToKoreanKey = (key) => {
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

    const charCode = string.charCodeAt(string.length - 1);

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

export const engKeyboardToKorean = (string) => {
    /* Returns what a string of characters from the english keyboard would be if the user
     instead used the korean keyboard.

     For example,
        engKeyboardToKorean("gksrnrdj") = "한국어"
        engKeyboardToKorean("줄rl") = "줄기"
  */
};
