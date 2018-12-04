
const SILENT = false;
const log = console.log.bind('[A11Y::Utils::Text]');

export function splitByWords(text, wordsOnly = false) {
  if (!text || !text.length) {
    return [];
  }
  return wordsOnly ?
    text.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').split(' ') :
    text.match(/\w+|\s+|[^\s\w]+/g);
}

/**
 * Converts Roman number (string) to Arabic number
 * @param str Roman number as string
 * @see {@link https://www.selftaughtjs.com/algorithm-sundays-converting-roman-numerals/}
 */
function decimalFromRoman(str) {
  let result = 0; // the result is now a number, not a string
  try {
    const decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    for (let i = 0; i <= decimal.length; i++) {
      while (str.indexOf(roman[i]) === 0) {
        result += decimal[i];
        str = str.replace(roman[i], '');
      }
    }
  }
  catch (err) {
    result = undefined;
  }
  return result;
}

function translateIfRoman(str) {
  let result = 0;
  const baseStr = str;
  try {
    const decimal = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const roman = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    for (let i = 0; i <= decimal.length; i++) {
      while (str.indexOf(roman[i]) === 0) {
        result += decimal[i];
        str = str.replace(roman[i], '');
        if (str.length && str.search(/^[MDCLXVI)(]+$/) !== 0) {
          return baseStr;
        }
      }
    }
  }
  catch (err) {
    return baseStr;
  }
  return result ? result.toString() : baseStr;
}

/**
 * Translates Roman numbers to decimal numbers for Accessibility labels
 * @param text text with Roman number (search for first appearance of MDCLXVI symbols)
 * @param separator text separator, if specified then only first part is taken for analysis
 * @param silent if true then no error information printed
 *
 * @example Section II. Examples... => Section 2. Examples...
 */
export function readRomanNumber(text, separator = '.', silent = SILENT) {
  try {
    const parts = separator ? text.split(separator) : [text];
    const startsAt = parts[0].search(/^[MDCLXVI)(]+$/);
    if (startsAt >= 0) {
      const number = decimalFromRoman(parts[0].slice(startsAt));
      return ((number === undefined) ? '' : number) + separator + (parts.length > 1 ? parts.slice(1).join(separator) : '');
    }
  }
  catch (err) {
    silent || log(err.message);
  }
  return text;
}

/**
 * Replaces Roman numbers in string with decimal numbers for Accessibility labels
 * @param text text with Roman numbers (if any)
 * @param silent if true then no error information printed
 * @return modified string if Roman Numbers are found, the same string otherwise
 * @example CFA Level ||| 2019... => CFA Level 3 2019...
 */
export function replaceRomanNumbers(text, silent = SILENT) {
  try {
    const words = splitByWords(text);
    words.forEach((elem, index, arr) => { arr[index] = translateIfRoman(elem); });
    return words.join('');
  }
  catch (err) {
    silent || log(err.message);
  }
  return text;
}

/**
 * Translates Date for Accessibility labels (accessibility label should read Date as a Date and not as Numbers)
 * @param dateAsText date as text
 * @param silent if true then no error information printed
 * @param locale locale to apply for conversion
 * @param options options to apply for conversion
 */
export function getDateTime(
  dateAsText, silent = SILENT, locale = 'en-US',
  options = { weekday: undefined, year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: undefined }) {
  try {
    return new Date(dateAsText).toLocaleString(locale, options);
  }
  catch (err) {
    silent || log(err.message);
  }
  return dateAsText;
}

/**
* Translates duration specified as 'hh:mm:ss' or 'mm:ss' for Accessibility labels;
* First digit position in text is used as initial time position
* @param text duration as text ('hh:mm:ss' or 'mm:ss')
* @param format duration's format; by default 'hh:mm:ss' (L(text) >= 5) or 'mm:ss' (L(text) < 5)
* @param shorten if true then leading zeroes are skipped
* @param silent if true then no error information printed
*/
export function getDuration(text, format = '', shorten = false, silent = SILENT) {
  try {
    const abbrs = [ 'hh', 'mm', 'ss' ];
    const names = [ { one: 'hour', many: 'hours' }, { one: 'minute', many: 'minutes' }, { one: 'second', many: 'seconds' } ];
    let duration = 0, time = '';
    let timeStartsAt = text.search(/\d+/);
    const hms = text.slice(timeStartsAt < 0 ? 0 : timeStartsAt);
    const fmt = (format === undefined || !format.length) ? (hms.length > 5 ? 'hh:mm:ss' : 'mm:ss') : format;
    abbrs.forEach((elem, index) => {
      const pos = fmt.search(elem);
      if (pos >= 0) {
        const value = Number(hms.slice(pos, pos + 2));
        if (shorten && value === 0 && !(index === 2 && duration === 0))  {
          return;
        }
        duration += value;
        const skip = (index === 2 && duration !== 0 && value === 0); // skip if seconds are 0
        !skip && (time += (time.length ? ', ' : '') + value + ' ' + names[index][value === 1 ? 'one' : 'many']);
      }
    });
    return (timeStartsAt > 0 ? text.slice(0, timeStartsAt) : '') + time;
  }
  catch (err) {
    silent || log(err.message);
    return text;
  }
}

export const text = {
  splitByWords,
  readRomanNumber,
  replaceRomanNumbers,
  getDateTime,
  getDuration
};

export default text;
