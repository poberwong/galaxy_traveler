const inputStr = `glob is I
prok is V
pish is X
tegj is L
glob glob Silver is 34 Credits
glob prok Gold is 57800 Credits
pish pish Iron is 3910 Credits
how much is pish tegj glob glob ?
how many Credits is glob prok Silver ?
how many Credits is glob prok Gold ?
how many Credits is glob prok Iron ?`

const ROMAN_MAP = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000
}
const ERROR_TYPE = {
    ERROR_QUESTION: 'bad question',
    INVALID_SYMBOLS: 'symbols can\'t convert into arabic',
    UNKNOWN_INPUT: 'input can\'t be parsed'
}

let wordMap = {}, metalMap = {}

function symbolsToArabic (symbols) {
    const romans = symbols.map(word => {
        const roman = wordMap[word]
        if(roman) {
            return roman
        } else {
            throw new Error(ERROR_TYPE.INVALID_SYMBOLS)
        }
    })
}

function parseWord (line) {
    const words = line.split(' ')
    wordMap[words[0]] = words.pop()
}

function caculateMetal (line) {
    const [frontIs, behindIs] = line.split(' is ')
    const creditCount = parseInt(behindIs.split(' ')[0])
    const metal = frontIs.split(' ').pop()
    const symbols = frontIs.split(' ').slice(0, -1)
    metalMap[metal] = creditCount / symbolsToArabic(symbols)
}

/**
 * how much is xxx ?
 * @param line 
 */
function answerNumber (line) {
    const behindIs = line.split(' is ')[1]
    const number = symbolsToArabic(behindIs.split(' '))
    console.log(`${behindIs} is ${number}`)
}

/**
 * how many Credits is xxx ?
 * @param line 
 */
function answerCredits (line) {
    const behindIsArr = line.split(' is ')[1].split(' ')
    const metal = behindIsArr[behindIsArr[behindIsArr.length - 1]]
    const number = symbolsToArabic(behindIsArr.slice(0, -1))
    console.log(`${behindIsArr} is ${number} Credits`)
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

function parseInput (str) {
    const lines = str.split('\n')
    lines.forEach(parseLine)
}




