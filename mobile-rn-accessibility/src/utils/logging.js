/**
 * Logging utiilities
 * ver 0.0.3
 * created: Mar, 2018
 * last updated: 07 Aug 2018
 * author: mmalykh@wiley.com
 * dependencies: ./helpers.js
 */
import helpers from './helpers.js';

// Prepends string with char
export function prepend(text, chr, upToLength) {
  const str = text.toString();
  const length = upToLength - str.length;
  return length > 0 ? new Array(length + 1).join(chr) + str : str;
}

// Logs function callee and passed parameters
export function logf() {
  const time = helpers.getTime();
  let caller = '', stack = new Error().stack;
  try {
    caller = stack.split('\n')[2].trim().split(/at Object.|at Function.|at /)[1].split(/ |:|[(]/)[0];
  }
  catch (err) {
    caller = '';
  }
  try {
    const params = [...arguments].reduce((all, arg) => (all += ((all.length ? '; ' : '') + JSON.stringify(arg))), '' );
    console.log('[' + time + '] ' + caller.replace('_this.', '') + (params.length ? (': ' + params) : ''));
  } catch (err) {
    console.log('[' + time + '] ' + caller + ': ' + err.message);
  }
}

/**
 * Logs function callee and passed parameters, first parameter is always format
 * @param format output format
 * @example
 *    const log = logging.logff.bind(logging.logff, {name: '[A11Y::Navigation]'});
 *    log(action);
 */
export function logff(format, ...args) {
  const time = helpers.getTime();
  const errorStack = new Error().stack;
  const f = { ...{ replacer: null, space: '', stack: false, name: '', color: '#0000000' }, ...format};
  const clr = helpers.getField(f.color, '',  '#000000'), prefix = helpers.getField(f.name, '', '');
  let caller = '', stack;
  try {
    if (f.stack) {
      const items = errorStack.split('\n'), skip = ['tryCatch', 'blob'], path = [];
      for (let i = 3; i < items.length; i++) {
        const item = items[i].trim().split(/at Object.|at Function.|at /)[1].split(/ |:|[(]/)[0];
        skip.indexOf(item) < 0 && path.push(item);
      }
      stack = path.length ? path.join(' < ') : '';
    }
    caller = errorStack.split('\n')[2].trim().split(/at Object.|at Function.|at /)[1].split(/ |:|[(]/)[0];
  }
  catch (err) {
    caller = '';
  }
  const title = '%c[' + time + '] ' + prefix + caller.replace('_this.', '');
  try {
    const params = args.reduce((all, arg) => (all += ((all.length ? '; ' : '') + JSON.stringify(arg, f.replacer, f.space))), '' );
    console.log(title + (params.length ? (': ' + params) : ''), 'color: ' + clr);
    stack && console.log(title + ' < ' + stack, 'color: ' + clr);
  } catch (err) {
    console.log(title + ': ' + err.message, 'color: ' + clr);
  }
}

export const loge = logff.bind(logff, { color: 'red', space: '' });
export const logw = logff.bind(logff, { color: 'orange', space: ''});
export const logd = logff.bind(logff, { color: 'green', space: ' ', stack: true});
export const logs = helpers.isDevice('emulator') && logf.bind(logf);

export const logging = {
  log: logf,          // substitution for console.log()
  logf, logff,        // formatted log
  loge, logw, logd,   // errors, warnings, debug
  logs                // simulator only
};

export default logging;
