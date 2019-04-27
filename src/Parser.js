const fs = require('fs')
const { ERROR_TYPE, ROMAN_MAP } = require('./helpers/Constant')
const { readFile } = require('./helpers/utils')

/**
 * 程序主引擎
 */
class Parser {
    constructor (symbolConverter) {
        this.wordMap = {}
        this.metalMap = {}
        this.output = ''
        this.symbolConverter = symbolConverter
    }

    /**
     * 计算代号的数值 
     * @param {string} line 
     */
    answerNumber (line) {
        const behindIs = line.split(' is ')[1].replace(' ?', '')
        const number = this.symbolConverter.convert(behindIs.split(' '))
        return `${behindIs} is ${number}`
    }

    /**
     * 计算一定数量金属的换算值
     * @param {string} line 
     */
    answerCredits (line) {
        const behindIs = line.split(' is ')[1].replace(' ?', '')
        const behindIsArr = behindIs.split(' ')
        const metal = behindIsArr[behindIsArr.length - 1]
        const number = this.symbolConverter.convert(behindIsArr.slice(0, -1))
        return `${behindIs} is ${number * this.metalMap[metal]} Credits`
    }

    /**
     * 解析行中金属的单价
     * @param {string} line 
     */
    caculateMetal (line) {
        const [frontIs, behindIs] = line.split(' is ')
        const creditCount = parseInt(behindIs.split(' ')[0])
        const metal = frontIs.split(' ').pop()
        const symbols = frontIs.split(' ').slice(0, -1)
        this.metalMap[metal] = creditCount / this.symbolConverter.convert(symbols)
        return this.metalMap
    }

    /**
     * 解析 symbol 和 roman 字符的对应关系
     * @param {string} line 
     */
    parseSymbol (line) {
        const words = line.split(' ')
        return {[words[0]]: words.pop()}
    }
    /**
     * 回答问句
     * @param {string} line 
     */
    answerQuestion (line) {
        if(/^how much is/.test(line)) {
            return this.answerNumber(line)
        } else if (/^how many/.test(line)){
            return this.answerCredits(line)
        } else {
            throw new Error(ERROR_TYPE.ERROR_QUESTION)
        }
    }

    /**
     * 解析每一行的语句
     * @param {string} line 
     */
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
        } catch (e) {
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

module.exports = Parser
