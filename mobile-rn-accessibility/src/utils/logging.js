/**
 * Logging utilities
 *
 * Version: 0.0.4, 2018.08.10
 * Created: 2018.03.01 by mmalykh@wiley.com
 * Latest changes:
 *      2018.08.10 0.0.4 Colored output now works for Emulator only
 */
import helpers from './helpers.js';

const EMULATOR = helpers.isRunningOn('emulator');

// Prepends string with char
export function prepend(text, chr, upToLength) {
  const str = text.toString();
  const length = upToLength - str.length;
  return length > 0 ? new Array(length + 1).join(chr) + str : str;
}

// Logs function callee and passed parameters
export function logf() {
  const prefix = '[' + helpers.getTime() + '] ';
  let caller = '', stack = new Error().stack;
  try {
    caller = stack.split('\n')[2].trim().split(/at Object.|at Function.|at /)[1].split(/ |:|[(]/)[0];
  }
  catch (err) {
    caller = '';
  }
  try {
    const params = [...arguments].reduce((all, arg) => (all += ((all.length ? '; ' : '') + JSON.stringify(arg))), '' );
    console.log(prefix + caller.replace('_this.', '') + (params.length ? (': ' + params) : ''));
  } catch (err) {
    console.log(prefix + caller + ': ' + err.message);
  }
}

/**
 * Logs function callee and passed parameters, first parameter is always format
 * @param format output format
 * @param args arguments
 * @example
 *    const log = logging.logff.bind(logging.logff, {name: '[A11Y::Navigation]'});
 *    log(action);
 */
export function logff(format, ...args) {
  const time = helpers.getTime();
  const errorStack = new Error().stack;
  const f = { ...{ replacer: null, space: '', stack: false, name: '', color: '#0000000' }, ...format};
  const prefix = helpers.getField(f.name, '', '');
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
  const title = '[' + time + '] ' + prefix + caller.replace('_this.', '');
  try {
    const params = args.reduce((all, arg) => (all += ((all.length ? '; ' : '') + JSON.stringify(arg, f.replacer, f.space))), '' );
    if (EMULATOR && f.color) {
      const clr = 'color: ' + f.color;
      console.log('%c' + title + (params.length ? (': ' + params) : ''), clr);
      stack && console.log('%c' + title + ' < ' + stack, clr);
    }
    else {
      console.log(title + (params.length ? (': ' + params) : ''));
      stack && console.log(title + ' < ' + stack);
    }
  } catch (err) {
    console.log(title + ': ' + err.message);
  }
}

export const loge = logff.bind(logff, { color: 'red', space: '' });
export const logw = logff.bind(logff, { color: 'orange', space: ''});
export const logd = logff.bind(logff, { color: 'green', space: ' ', stack: true});
export const logs = helpers.isRunningOn('emulator') && logf.bind(logf);

export const logging = {
  log: logf,          // substitution for console.log()
  logf, logff,        // formatted log
  loge, logw, logd,   // errors, warnings, debug
  logs                // simulator only
};

export default logging;
