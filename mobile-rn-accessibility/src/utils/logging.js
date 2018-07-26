/**
 * Logging utiilities
 * ver 0.0.2
 * created: Mar, 2018
 * last updated: 25 July 2018
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

// Returns current time as hh:mm:ss.ddd
export function getTime() {
  const time = new Date();
  return time.toTimeString().slice(0, 8) + '.' + prepend(time.getMilliseconds().toString(), '0', 3);
}

// Logs function callee and passed parameters
export function logf() {
  let caller = '', params = '';
  let args = [...arguments];
  let stack = new Error().stack;
  try {
    caller = stack.split('\n')[2].trim().split(/at Object.|at Function.|at /)[1].split(/ |:|[(]/)[0];
  }
  catch (err) {
    caller = '';
  }
  try {
    caller = caller.replace('_this.', '');
    params = args.reduce((all, arg) => (all += ((all.length ? '; ' : '') + JSON.stringify(arg))), '' );
    console.log('[' + getTime() + '] ' + caller + (params.length ? (': ' + params) : ''));
  } catch (err) {
    console.log('[' + getTime() + '] ' + caller + ': ' + err.message);
  }
}

// Logs function callee and passed parameters
export function logff(format = { replacer: null, space: '\t', stack: false, name: '', color: '#000000'}) {
  let caller = '', params = '', stack = '';
  const f = format === null ? { replacer: null, space: ' ', stack: false, name: '', color: '#0000000' } : format;
  let args = [...arguments];
  const prefix = !(f.name === undefined || f.name === null) ? f.name : '';
  const clr = !(f.color === undefined || f.color === null) ? f.color : '#000000';
  const errorStack = new Error().stack;
  args.splice(0, 1);
  try {
    const items = errorStack.split('\n');
    const path = [];
    const skip = ['tryCatch', 'blob'];
    if (f.stack) {
      for (let i = 3; i < items.length; i++) {
        const item = items[i].trim().split(/at Object.|at Function.|at /)[1].split(/ |:|[(]/)[0];
        if (skip.indexOf(item) >= 0) {
          continue;
        }
        path.push(item);
      }
      stack = path.length ? path.join(' <- ') : '';
    }
    caller = errorStack.split('\n')[2].trim().split(/at Object.|at Function.|at /)[1].split(/ |:|[(]/)[0];
  }
  catch (err) {
    caller = '';
  }
  try {
    caller = caller.replace('_this.', '');
    params = args.reduce((all, arg) => (all += ((all.length ? '; ' : '') + JSON.stringify(arg, f.replacer, f.space))), '' );
    const style = 'color: ' + clr;
    console.log('%c[' + getTime() + '] '  + prefix + caller + (params.length ? (': ' + params) : ''), style);
    if (stack.length) {
      console.log('<== (' + stack + ')');
    }
  } catch (err) {
    console.log('[' + getTime() + '] '  + prefix + caller + ': ' + err.message);
  }
}

export const loge = logff.bind(logff, { color: 'red', space: '' });
export const logw = logff.bind(logff, { color: 'orange', space: ''});
export const logd = logff.bind(logff, { color: 'green', space: '   ', stack: true});
export const logs = helpers.isDevice('emulator') && logf.bind(logf);

export const logging = {
  log: logf,          // substitution for console.log()
  logf, logff,        // formatted log
  loge, logw, logd,   // errors, warnings, debug
  logs                // simulator only log
};

export default logging;
