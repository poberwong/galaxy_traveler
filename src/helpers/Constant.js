module.exports = {
    ROMAN_MAP: {I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000, CM: 900, CD: 400, XC: 90, XL: 40, IX: 9, IV: 4},
    ROMAN_ORDER: ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'],
    ERROR_TYPE: {
        ERROR_QUESTION: 'bad question',
        INVALID_SYMBOLS: 'symbols can\'t convert into arabic',
        INVALID_ROMAN: 'roman string can\'t be converted to arabic',
        UNKNOWN_INPUT: 'input can\'t be parsed'
    }
}
