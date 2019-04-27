const SymbolConverter = require('./src/SymbolConverter')
const Parser = require('./src/Parser')
const { ROMAN_MAP, ROMAN_ORDER } = require('./src/helpers/Constant')

const symbolConverter = new SymbolConverter(ROMAN_MAP, ROMAN_ORDER)
const parser = new Parser(symbolConverter)
parser.run('src/data.txt')
