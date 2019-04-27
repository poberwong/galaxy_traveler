const fs = require('fs')

const ROMAN_MAP = {I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000, CM: 900, CD: 400, XC: 90, XL: 40, IX: 9, IV: 4}
const ROMAN_ORDER = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

const ERROR_TYPE = {
    ERROR_QUESTION: 'bad question',
    INVALID_SYMBOLS: 'symbols can\'t convert into arabic',
    INVALID_ROMAN: 'roman string can\'t be converted to arabic',
    UNKNOWN_INPUT: 'input can\'t be parsed'
}

let wordMap = {}, metalMap = {}

/**
 * 
 * @param {string} romans 
 */
function romansToArabic (romans) {
    if(!/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(romans)) {
        throw new Error(ERROR_TYPE.INVALID_ROMAN)
    }
    let res = 0
    ROMAN_ORDER.forEach(key => {
        while(romans.startsWith(key)) {
            romans = romans.replace(key, '')
            res += ROMAN_MAP[key]
        }
    })
    return res
}

/**
 * 
 * @param {array} symbols 
 */
function symbolsToRoman (symbols) {
    return symbols.map(word => {
        const roman = wordMap[word]
        if(roman) {
            return roman
        } else {
            throw new Error(ERROR_TYPE.INVALID_SYMBOLS)
        }
    }).join('')
}

function symbolsToArabic (symbols) {
    return romansToArabic(symbolsToRoman(symbols))
}

function parseWord (line) {
    const words = line.split(' ')
    wordMap[words[0]] = words.pop()
    return wordMap
}

function caculateMetal (line) {
    const [frontIs, behindIs] = line.split(' is ')
    const creditCount = parseInt(behindIs.split(' ')[0])
    const metal = frontIs.split(' ').pop()
    const symbols = frontIs.split(' ').slice(0, -1)
    metalMap[metal] = creditCount / symbolsToArabic(symbols)
    return metalMap
}

/**
 * how much is xxx ?
 * @param line 
 */
function answerNumber (line) {
    const behindIs = line.split(' is ')[1].replace(' ?', '')
    const number = symbolsToArabic(behindIs.split(' '))
    console.log(`${behindIs} is ${number}`)
}

/**
 * how many Credits is xxx ?
 * @param line 
 */
function answerCredits (line) {
    const behindIs = line.split(' is ')[1].replace(' ?', '')
    const behindIsArr = behindIs.split(' ')
    const metal = behindIsArr[behindIsArr.length - 1]
    const number = symbolsToArabic(behindIsArr.slice(0, -1))
    console.log(`${behindIs} is ${number * metalMap[metal]} Credits`)
}

function answerQuestion (line) {
    if(/^how much/.test(line)) {
        answerNumber(line)
    } else if (/^how many/.test(line)){
        answerCredits(line)
    } else {
        throw new Error(ERROR_TYPE.ERROR_QUESTION)
    }
}

function parseLine (line) {
    if(/.Credits$/.test(line)) {
        caculateMetal(line)
    } else if (/\?$/.test(line)) {
        answerQuestion(line)
    } else if (ROMAN_MAP[line[line.length - 1]] !== undefined) {
        parseWord(line)
    } else {
        throw new Error(ERROR_TYPE.UNKNOWN_INPUT)
    }
}

fs.readFile('src/data.txt', (err, data) => {
    if(err) {
        console.log('err: ', err)
    } else {
        try {
            data.toString().split('\n').forEach(parseLine)
        } catch (err) {
            console.log('I have no idea what you are talking about')
        }
    }
})
