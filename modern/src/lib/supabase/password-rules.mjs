/** @param {string} value */
export function getNewPasswordError(value) {
  if (value.length < 8) return "Use at least 8 characters.";
  if (value.length > 72) return "Use no more than 72 characters.";
  if (new TextEncoder().encode(value).length > 72)
    return "Use no more than 72 bytes, including emoji or accents.";

  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[\p{P}\p{S}]/u.test(value);
  if (!hasNumber && !hasSymbol) return "Include a number and a symbol.";
  if (!hasNumber) return "Include at least one number.";
  if (!hasSymbol) return "Include at least one symbol.";
}
