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

// Adds message to the error
export function buildErrorWithMessage(errCode, message) {
  return isDefined(message) ? { errCode, details: { error: (new Error(message)) } } :
                              { errCode, details: { error: (new Error('Error [' + errCode + ']')) } };
}

// Gets message from the error
export function getErrorMessage(error) {
  return getField(error, 'details.error.message', 'Error [' + error.errCode + ']');
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

export const helpers = {
  getField,
  isDefined,
  buildErrorWithMessage,
  getErrorMessage,
  sleep
};

export default helpers;
