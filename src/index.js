const fs = require('fs')

const ROMAN_MAP = {I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000, CM: 900, CD: 400, XC: 90, XL: 40, IX: 9, IV: 4}
const ROMAN_ORDER = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
const ERROR_TYPE = {
    ERROR_QUESTION: 'bad question',
    INVALID_SYMBOLS: 'symbols can\'t convert into arabic',
    INVALID_ROMAN: 'roman string can\'t be converted to arabic',
    UNKNOWN_INPUT: 'input can\'t be parsed'
}

function readFile (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if(err) {
                reject(err)
            } else {
                resolve(data.toString())
            }
        })
    })
}

class SymbolConverter {
    constructor (romanMap, romanOrder) {
        this.romanMap = romanMap
        this.romanOrder = romanOrder
        this.symbolMap = {}
    }

    isValid (romanStr) {
        return /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(romanStr)
    }

    /**
     * For example: convert XCI into 90
     * @param {string} romanStr
     */
    romansToArabic (romanStr) {
        if(!this.isValid(romanStr)) {
            throw new Error(ERROR_TYPE.INVALID_ROMAN)
        }
        let res = 0
        this.romanOrder.forEach(key => {
            while(romanStr.startsWith(key)) {
                romanStr = romanStr.replace(key, '')
                res += this.romanMap[key]
            }
        })
        return res
    }

    /**
     * 根据 symbolMap 中的映射关系将 symbols 转换为罗马字符串
     * @param {array} symbols 
     */
    symbolsToRoman (symbols) {
        return symbols.map(word => {
            const roman = this.symbolMap[word]
            if(roman) {
                return roman
            } else {
                throw new Error(ERROR_TYPE.INVALID_SYMBOLS)
            }
        }).join('')
    }

    setSymbolMap (obj) {
        this.symbolMap = {...this.symbolMap, ...obj}
    }

    convert (symbols) {
        return this.romansToArabic(this.symbolsToRoman(symbols))
    }
}

class Parser {
    constructor (symbolConverter) {
        this.wordMap = {}
        this.metalMap = {}
        this.output = ''
        this.symbolConverter = symbolConverter
    }

    answerNumber (line) {
        const behindIs = line.split(' is ')[1].replace(' ?', '')
        const number = this.symbolConverter.convert(behindIs.split(' '))
        return `${behindIs} is ${number}`
    }

    answerCredits (line) {
        const behindIs = line.split(' is ')[1].replace(' ?', '')
        const behindIsArr = behindIs.split(' ')
        const metal = behindIsArr[behindIsArr.length - 1]
        const number = this.symbolConverter.convert(behindIsArr.slice(0, -1))
        return `${behindIs} is ${number * this.metalMap[metal]} Credits`
    }

    caculateMetal (line) {
        const [frontIs, behindIs] = line.split(' is ')
        const creditCount = parseInt(behindIs.split(' ')[0])
        const metal = frontIs.split(' ').pop()
        const symbols = frontIs.split(' ').slice(0, -1)
        this.metalMap[metal] = creditCount / this.symbolConverter.convert(symbols)
        return this.metalMap
    }

    parseSymbol (line) {
        const words = line.split(' ')
        return {[words[0]]: words.pop()}
    }

    answerQuestion (line) {
        if(/^how much is/.test(line)) {
            return this.answerNumber(line)
        } else if (/^how many/.test(line)){
            return this.answerCredits(line)
        } else {
            throw new Error(ERROR_TYPE.ERROR_QUESTION)
        }
    }

    parseLine (line) {
        try {
            if(/.Credits$/.test(line)) {
                this.caculateMetal(line)
            } else if (/\?$/.test(line)) {
                this.output += this.answerQuestion(line) + '\n'
            } else if (ROMAN_MAP[line[line.length - 1]] !== undefined) {
                this.symbolConverter.setSymbolMap(this.parseSymbol(line))
            } else {
                throw new Error (ERROR_TYPE.UNKNOWN_INPUT)
            }
        } catch {
            this.output += 'I have no idea what you are talking about\n'
        }
    }

    run (path) {
        readFile(path)
            .then(res => {
                res.split('\n').forEach(this.parseLine.bind(this))
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                this.output = this.output.replace(/\n$/, '')
                console.log(this.output)
            })
    }
}

const symbolConverter = new SymbolConverter(ROMAN_MAP, ROMAN_ORDER)
const parser = new Parser(symbolConverter)
parser.run('src/data.txt')
