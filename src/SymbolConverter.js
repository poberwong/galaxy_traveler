const { ERROR_TYPE } = require('./helpers/Constant')

/**
 * 罗马字符代号数组的转换器
 */
class SymbolConverter {
    constructor (romanMap, romanOrder) {
        this.romanMap = romanMap
        this.romanOrder = romanOrder
        this.symbolMap = {}
    }

    /**
     * maybe something wrong here
     * @param {string} romanStr 
     */
    isValid (romanStr) {
        return /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(romanStr)
    }

    /**
     * For example: convert XCI into 91
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

module.exports = SymbolConverter
