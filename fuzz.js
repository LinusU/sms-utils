const assert = require('node:assert')

const { trimTextToOneSms } = require('./')

exports.fuzz = function fuzz (buf) {
  const textBaseCount = buf[0] ?? 0
  const textExtendedCount = buf[1] ?? 0
  const textUcs2Count = buf[2] ?? 0

  const postfixBaseCount = buf[3] ?? 0
  const postfixExtendedCount = buf[4] ?? 0
  const postfixUcs2Count = buf[5] ?? 0

  const text = 'A'.repeat(textBaseCount) + '€'.repeat(textExtendedCount) + '¶'.repeat(textUcs2Count)
  const postfix = 'B'.repeat(postfixBaseCount) + '€'.repeat(postfixExtendedCount) + '¶'.repeat(postfixUcs2Count)

  const hasExtended = (textExtendedCount + postfixExtendedCount) > 0
  const hasUcs2 = (textUcs2Count + postfixUcs2Count) > 0

  const textBitCount = hasUcs2 ? text.length * 16 : (textBaseCount + (textExtendedCount * 2)) * 7
  const postfixBitCount = hasUcs2 ? postfix.length * 16 : (postfixBaseCount + (postfixExtendedCount * 2)) * 7

  const ellipsis = hasUcs2 ? '…' : '...'
  const ellipsisBitCount = hasUcs2 ? 16 : 21

  if (postfixBitCount > (1120 - ellipsisBitCount)) {
    assert.throws(() => trimTextToOneSms(text, postfix), { code: 'ERR_POSTFIX_TOO_LONG' })
    return
  }

  if ((textBitCount + postfixBitCount) <= 1120) {
    assert.strictEqual(trimTextToOneSms(text, postfix), `${text}${postfix}`)
    return
  }

  const result = trimTextToOneSms(text, postfix)

  const prefixBitCount = 1120 - ellipsisBitCount - postfixBitCount
  const prefixCharCount = hasUcs2 ? prefixBitCount / 16 : prefixBitCount / 7
  const prefix = hasUcs2
    ? text.slice(0, prefixCharCount)
    : text.slice(0, Math.min(textBaseCount, prefixCharCount)) + text.slice(textBaseCount).slice(0, Math.max(0, Math.floor((prefixCharCount - textBaseCount) / 2)))

  assert.strictEqual(result, `${prefix}${ellipsis}${postfix}`)

  if (hasUcs2) {
    assert.strictEqual(result.length, 70)
  } else if (hasExtended) {
    assert.ok(result.length >= 80)
    assert.ok(result.length <= 160)
  } else {
    assert.strictEqual(result.length, 160)
  }
}
