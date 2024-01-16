# SMS Utils for Node.js

Some utilities for working with SMS messages in Node.js.

## Installation

```bash
npm install --save sms-utils
```

## API

### `hasNonGsmChars(text)`

- `text` (`string`, required)
- returns `boolean`

Returns true if the string contains any characters not in the GSM 03.38 character set.

### `replaceNonGsmChars(text[, replacement])`

- `text` (`string`, required) - The text to replace characters in.
- `replacement` (`string`, optional) - The string to replace non-GSM characters with. Defaults to removing the character.
- returns `string`

Replace all characters not in the GSM 03.38 character set with the replacement string.

### `trimTextToOneSms(text[, postfix])`

- `text` (`string`, required)
- `postfix` (`string`, optional)
- returns `string`

Trim the text to the maximum length of a single SMS message. The function will determine the maximum length based on the encoding of the text, GSM by default, and USC2 if the text contains any characters not in the GSM character set.

If the text needs to be trimmed, "..." (or "…" if the text is encoded in USC2) will be appended to the end of the text.

Optionally, a postfix can be specified that will always be present at the end of the text, even if the text does not need to be trimmed. This is useful for adding a signature or link to the end of the text.

Example:

```js
trimTextToOneSms(`You have a new message from ${senderName}`)
trimTextToOneSms(`Your account ${accountName}`, ' is about to expire.')
trimTextToOneSms(`New unread notification: ${notificationTitle}`, `\n\nhttps://example.com/${code}`)
```

## Fuzzing

The `trimTextToOneSms` function has been fuzzed using [js-fuzz](https://gitlab.com/gitlab-org/security-products/analyzers/fuzzers/jsfuzz), see the file `fuzz.js` for the fuzzing code.
