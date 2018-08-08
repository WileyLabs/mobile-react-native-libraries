/**
 * Set of miscelleneous helper functions
 * ver 0.0.2
 * created: Mar, 2018
 * last updated: 04 Aug 2018
 * author: mmalykh@wiley.com
 * dependencies: react-native-device-info
 */
import React from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// Safely returns field's value or defaultValue if path is not correct
export function getField(object, path, defaultValue) {
  try {
    let pathItems = path ? path.split('.') : [];
    while (pathItems.length) {
      object = object[pathItems.shift()];
    }
    return (object === undefined || object === null) ? defaultValue : object;
  } catch (err) {
    return defaultValue;
  }
}

// Puts value within low and high borders
export function putWithin(val, lo, hi) {
  return val < lo ? lo : (val > hi) ? hi : val;
}

// Returns true if object is String
function isString(s) {
  return s !== undefined && (typeof (s) === 'string' || s instanceof String);
}

// Prepends string with specified character up to specified length
export function prepend(text, chr, upToLength) {
  const str = text.toString();
  const length = upToLength - str.length;
  return length > 0 ? new Array(length + 1).join(chr) + str : str;
}

/**
 * Returns current time as hh:mm:ss.ddd
 * @param time time to convert, if undefined then current time will be taken
 * @return current time as hh:mm:ss.ddd
 */
export function getTime(time) {
  const t = time && (typeof time !== 'number') ? time : (time ? new Date(time) : new Date());
  return t.toTimeString().slice(0, 8) + '.' + prepend(t.getMilliseconds().toString(), '0', 3);
}

// Returns true if value is not null and not undefined, strings are trimmed and string length should be > 0
export function isDefined(value, path) {
  if (isString(value)) {
    return value.trim().length > 0;
  }
  return getField(value, path, null) !== null;
}

/**
 * Blocks thread execution for specified number of milliseconds
 */
export function block(ms, start) {
  const time = start ? start : new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - time) >= ms){
      break;
    }
  }
}

/**
 * Sleeps for specified number of milliseconds
 * @param ms number of milliseconds
 * @example await helpers.sleep(1000);
 */
export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Builds mobile-rn error
export function buildError(errCode, error = new Error(), details = {}) {
  return { errCode, details: { ...details, error }};
}

// Gets message from the error
export function getErrorMessage(error) {
  return getField(error, 'details.error.message', 'Error ' + error.errCode);
}

export function isDevice(descriptor) {
  try {
    let device = (DeviceInfo.isTablet() ? 'tablet' : 'phone') + (Platform.OS === 'ios' ? ', ios' : ', android') +
                 (DeviceInfo.isEmulator() ? ', emulator' : ', device');
    return descriptor.split(',').every(flag => device.indexOf(flag.trim().toLowerCase()) >= 0);
  }
  catch (err) {
    return false;
  }
}

/**
 * Clones children with additional props (original props will be replaced)
 * @param children child JSX elements
 * @param props additional props or props to override
 * @param silent true to supress error logging
 */
export function cloneChildrenWithProps(children, props, silent = true) {
  try {
    if (props === undefined || children === undefined) {
      return children;
    }
    return React.Children.map(children, child => {
      if (isString(child) || child === null || child === undefined) {
        return child;
      }
      const updatedProps = {};
      for (let prop in child.props) {
        updatedProps[prop] = props.hasOwnProperty(prop) ? props[prop] : child.props[prop];
      }
      return React.cloneElement(child, {...updatedProps});
    });
  }
  catch (err) {
    !silent && console.log('[cloneChildrenWithProps]', { children, props }, err.message);
  }
  return children;
}

export const helpers = {
  getField,
  putWithin,
  getTime,
  prepend,
  isDefined,
  block, sleep,
  buildError, getErrorMessage,
  isDevice,
  cloneChildrenWithProps
};

export default helpers;
