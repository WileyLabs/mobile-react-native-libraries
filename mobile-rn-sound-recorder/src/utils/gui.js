import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// Returns platform-specific name for ionicons collection (either ios- or md-)
export function getIconName(iconName, suffix = {ios: '', android: ''}) {
  let platformName = iconName;
  try {
    const os = Platform.OS === 'ios' ? 'ios-' : 'md-';
    platformName = iconName[0] === '*' ? os + iconName.slice(1) : iconName;
    platformName += suffix[Platform.OS] === undefined ? '' : suffix[Platform.OS];
  } catch (err) {
  }
  return platformName;
}

/**
 * Checks running environment, e.g. isRunningOn('tablet, ios'), or isRunningOn('ios, device');
 * returns true if device sutisfies descriptor, false otherwise
 */
export function isRunningOn(descriptor) {
  try {
    let device = (DeviceInfo.isTablet() ? 'tablet' : 'phone') + (Platform.OS === 'ios' ? ', ios' : ', android') +
                 (DeviceInfo.isEmulator() ? ', emulator' : ', device');
    return descriptor.split(',').every(flag => device.indexOf(flag.trim().toLowerCase()) >= 0);
  }
  catch (err) {
    return false;
  }
}

export const isDevice = isRunningOn;

/**
 * Converts Roman number (string) to Arabic number
 * @param str Roman number as string
 * @see {@link https://www.selftaughtjs.com/algorithm-sundays-converting-roman-numerals/}
 */
function fromRoman(str) {
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

/**
 * Translates Roman numbers to arabic numbers for Accessibility labels
 * @param text text with Roman number (search for first appearance of MDCLXVI symbols)
 * @param separator text separator, if specified then only first part is taken for analysis
 * @param silent if true then no error information printed
 *
 * @example Section II. Examples... => Section 2. Examples...
 */
export function readRomanNumber(text, separator = '.', silent = true) {
  try {
    const parts = separator ? text.split(separator) : [text];
    const startsAt = parts[0].search(/^[MDCLXVI)(]+$/);
    if (startsAt >= 0) {
      const number = fromRoman(parts[0].slice(startsAt));
      return ((number === undefined) ? '' : number) + separator + (parts.length > 1 ? parts.slice(1).join(separator) : '');
    }
  }
  catch (err) {
    silent || console.log(err.message);
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
    dateAsText, silent = true, locale = 'en-US',
    options = { weekday: undefined, year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: undefined }) {
  try {
    return new Date(dateAsText).toLocaleString(locale, options);
  }
  catch (err) {
    silent || console.log(err.message);
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
export function getDuration(text, format = '', shorten = false, silent = true) {
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
    silent || console.log(err.message);
    return text;
  }
}

export const gui = {
  getIconName,
  isDevice, isRunningOn,
  fromRoman, readRomanNumber,
  getDateTime, getDuration
};

export default gui;
