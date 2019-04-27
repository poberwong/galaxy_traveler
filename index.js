const commander = require('commander')
const SymbolConverter = require('./src/SymbolConverter')
const Parser = require('./src/Parser')
const { ROMAN_MAP, ROMAN_ORDER } = require('./src/helpers/Constant')

const symbolConverter = new SymbolConverter(ROMAN_MAP, ROMAN_ORDER)
const parser = new Parser(symbolConverter)

commander.option('-i, --inputFile [type]', 'file path').parse(process.argv)

const path = (commander.inputFile && commander.inputFile === String) ? commander.inputFile : 'src/data.txt'
parser.run(path)
