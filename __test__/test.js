const Parser = require('../src/Parser')
const SymbolConverter = require('../src/SymbolConverter')
const { ROMAN_MAP, ROMAN_ORDER } = require('../src/helpers/Constant')

const converter = new SymbolConverter(ROMAN_MAP, ROMAN_ORDER)
converter.setSymbolMap({glob: 'I', prok: 'V', pish: 'X', tegj: 'L'})
const parser = new Parser(converter)

describe('symbol converter', () => {
    // toBe: address or shallow compare
    // toEqual: value and deep compare
    test('roman converter', () => {
      expect(converter.romansToArabic('XCI')).toBe(91)
      expect(converter.romansToArabic('MXCVI')).toBe(1096)
    })

    test('symbolsToRoman', () => {
      expect(converter.symbolsToRoman(['glob', 'prok'])).toBe('IV')
    })

    test('romanStrValidation', () => {
      expect(converter.isValid(['XL'])).toBe(true)
    })

    test('convert', () => {
      expect(converter.convert(['pish', 'tegj', 'glob'])).toBe(41)
    })
  }
)

describe('parser', () => {
    test('parseSymbol', () => {
      expect(parser.parseSymbol('pish is X')).toEqual({pish: 'X'})
    })

    test('caculateMetal', () => {
      expect(parser.caculateMetal('glob prok Gold is 57800 Credits')).toEqual({Gold: 14450})
    })

    test('answerNumber', () => {
      expect(parser.answerNumber('how much is pish tegj glob glob ?')).toEqual('pish tegj glob glob is 42')
    })

    test('answerCredit', () => {
      expect(parser.answerCredits('how many Credits is glob prok Gold ?')).toEqual('glob prok Gold is 57800 Credits')
    })
})
  