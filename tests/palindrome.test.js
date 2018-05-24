const palindrom = require('../utils/for_testing').palindrom

test.skip('palindrom of a', () => {
    const result = palindrom('a')

    expect(result).toBe('a')
})

test.skip('palindrom of react', () => {
    const result = palindrom('react')

    expect(result).toBe('tcaer')
})

test.skip('palindrom of saippuakauppias', () => {
    const result = palindrom('saippuakauppias')

    expect(result).toBe('saippuakauppias')
})