import React from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// Safely returns field's value or defaultValue if path is not correct
export function getField(object, path, defaultValue) {
  try {
    let pathItems = path !== undefined ? path.split('.') : [];
    while (pathItems.length) {
      object = object[pathItems.shift()];
    }
    return (object === undefined || object === null) ? defaultValue : object;
  } catch (err) {
    return defaultValue;
  }
}

export function putWithin(val, lo, hi) {
  return val < lo ? lo : (val > hi) ? hi : val;
}

function isString(s) {
  return s !== undefined && (typeof (s) === 'string' || s instanceof String);
}

// Returns if value is not null or undefined
// String: trimmed length is > 0
export function isDefined(value, path = undefined) {
  if (isString(value)) {
    return value.trim().length > 0;
  }
  const field = getField(value, path, null);
  return !(field === undefined || field === null);
}

// Sleeps for 'milliseconds'
export function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
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

// Clones children with additional props (original props will be replaced)
export function cloneChildrenWithProps(children, props) {
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
  }
  return children;
}

export const helpers = {
  getField,
  putWithin,
  isDefined,
  sleep,
  buildError,
  getErrorMessage,
  isDevice,
  cloneChildrenWithProps
};

export default helpers;
