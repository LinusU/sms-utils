const base = new Set(
  // Control codes
  '\n\r' +
  // ASCII Punctuation & Symbols
  ' !"#$%&\'()*+,-./:;<=>?@_' +
  // ASCII Digits
  '0123456789' +
  // ASCII Alphabet: Uppercase
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  // ASCII Alphabet: Lowercase
  'abcdefghijklmnopqrstuvwxyz' +
  // Latin-1 Punctuation & Symbols
  '¡£¤¥§¿' +
  // Latin-1 Letters: Uppercase
  'ÄÅÆÇÉÑÖØÜ' +
  // Latin-1 Letters: Lowercase
  'ßàäåæçèéìñòöøùü' +
  // Greek and Coptic
  '\u0394\u03A6\u0393\u039B\u03A9\u03A0\u03A8\u03A3\u0398\u039E'
)

const extended = new Set(
  // ASCII Punctuation & Symbols
  '[\\]^{|}~' +
  // Currency Symbols
  '€'
)

function gsmStringLength (text) {
  let length = 0

  for (const char of text) {
    if (base.has(char)) {
      length += 1
    } else if (extended.has(char)) {
      length += 2
    } else {
      throw new Error(`Character ${char} is not part of the GSM 03.38 character set`)
    }
  }

  return length
}

exports.hasNonGsmChars = function hasNonGsmChars (text) {
  for (const char of text) {
    if (!base.has(char) && !extended.has(char)) {
      return true
    }
  }

  return false
}

exports.replaceNonGsmChars = function replaceNonGsmChars (text, replacement) {
  replacement = (replacement || '')

  let result = ''

  for (const char of text) {
    if (base.has(char) || extended.has(char)) {
      result += char
    } else {
      result += replacement
    }
  }

  return result
}

exports.trimTextToOneSms = function trimTextToOneSms (text, postfix) {
  postfix = (postfix || '')

  if (exports.hasNonGsmChars(text) || exports.hasNonGsmChars(postfix)) {
    if (postfix.length > 69) {
      throw Object.assign(new Error('Postfix are too long for a single SMS'), { code: 'ERR_POSTFIX_TOO_LONG' })
    }

    const maxLength = 70 - postfix.length

    if (text.length <= maxLength) {
      return `${text}${postfix}`
    }

    return `${text.slice(0, maxLength - 1)}…${postfix}`
  }

  const postfixLength = gsmStringLength(postfix)

  if (postfixLength > 157) {
    throw Object.assign(new Error('Postfix are too long for a single SMS'), { code: 'ERR_POSTFIX_TOO_LONG' })
  }

  const textLength = gsmStringLength(text)
  const maxLength = 160 - postfixLength

  if (textLength <= maxLength) {
    return `${text}${postfix}`
  }

  let result = ''
  let length = 0

  for (const char of text) {
    const charLength = base.has(char) ? 1 : 2

    if ((length + charLength) > (maxLength - 3)) {
      break
    }

    result += char
    length += charLength
  }

  return `${result}...${postfix}`
}
