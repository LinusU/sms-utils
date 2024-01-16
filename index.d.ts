/**
 * Returns true if the string contains any characters not in the GSM 03.38 character set.
 */
export declare function hasNonGsmChars(text: string): boolean

/**
 * Replace all characters not in the GSM 03.38 character set with the replacement string.
 *
 * @param text The text to replace characters in.
 * @param replacement The string to replace non-GSM characters with. Defaults to removing the character.
 */
export declare function replaceNonGsmChars(text: string, replacement?: string): string

/**
 * Trim the text to the maximum length of a single SMS message. The function will determine the maximum length based on the encoding of the text, GSM by default, and USC2 if the text contains any characters not in the GSM character set.
 *
 * If the text needs to be trimmed, "..." (or "…" if the text is encoded in USC2) will be appended to the end of the text.
 *
 * Optionally, a postfix can be specified that will always be present at the end of the text, even if the text does not need to be trimmed. This is useful for adding a signature or link to the end of the text.
 *
 * @example
 * ```js
 * trimTextToOneSms(`You have a new message from ${senderName}`)
 * trimTextToOneSms(`Your account ${accountName}`, ' is about to expire.')
 * trimTextToOneSms(`New unread notification: ${notificationTitle}`, `\n\nhttps://example.com/${code}`)
 * ```
 */
export declare function trimTextToOneSms(text: string, postfix?: string): string
