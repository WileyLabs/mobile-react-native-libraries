/**
 * Accessibility utils
 * 
 * Version: 0.0.6, 2018.08.16
 * Created: 2018.07.01 by mmalykh@wiley.com
 */
import { Platform, UIManager, findNodeHandle, AccessibilityInfo } from 'react-native';
import html from './utils/html.js';
import helpers from './utils/helpers.js';
import Locker from './utils/locker.js';
import logging from './utils/logging.js';

const log = logging.logff.bind(logging.logff, {name: '[A11Y::Utils] '});

const accessibilityChanged = flag => { Accessibility.status = flag; };
const accessibilityStatus = new Accessibility();
const SILENT = true;

export function Accessibility() {
  Accessibility.status = false;
  Accessibility.debug = false;
  requestStatus(accessibilityChanged);
  beginTrackStatus(accessibilityChanged);
}

export function beginTrackStatus(cb) {
  try {
    AccessibilityInfo.addEventListener('change', cb);
  }
  catch (err) {
  }
}

export function endTrackStatus(cb) {
  try {
    AccessibilityInfo.removeEventListener('change', cb);
  }
  catch (err) {
  }
}

export async function requestStatus(cb) {
  return await AccessibilityInfo.fetch().then(res => cb(res)).catch(cb(false));
}

/**
 * Sets accessibility focus on element
 * @param elem Element
 * @param options.name element name (optional)
 * @param options.silent false to switch on logging and error reporting
 * @param options.verify function to be called just before sendAccesibilityEvent to verify that elem exists (Android, rn 0.56+)
 * @see {@link https://github.com/facebook/react-native/issues/12492}
 */
export function setFocus(elem, { name = '', silent = SILENT, verify = () => true } = { name: '', silent: SILENT, verify: () => true }) {
  const obj = {...(!silent && { name, elem: helpers.getField(elem, '_nativeTag'), object: helpers.getField(elem, 'viewConfig.uiViewClassName')})};
  if (!Accessibility.status && Platform.OS === 'android') {
    return;
  }
  if (!elem) {
    silent || log('Invalid reference passed', obj);
    return;
  }
  try {
    if (Platform.OS === 'ios') {
      AccessibilityInfo.setAccessibilityFocus(findNodeHandle(elem));
    }
    else {
      const node = findNodeHandle(elem);
      if (node && verify && verify()) {
        UIManager.sendAccessibilityEvent(node, 8);
        silent || log(obj);
      }
      else {
        silent || log('Verification failed', obj);
      }
    }
  }
  catch (err) {
    silent || log(err.message, obj);
  }
}

/**
 * Posts accessibility focus
 * @param elem Element
 * @param options.name element name (optional)
 * @param options.timeout post timeout
 * @param options.silent false to switch on logging
 * @param options.verify function to be called by setFocus to verify that elem exists ('mounted' on Android, rn 0.56+)
 */
export function postFocus(elem, { name = '', timeout = 333, silent = SILENT, verify = () => true } = { name: '', timeout: 333, silent: SILENT, verify: () => true } ) {
  elem && setTimeout(() => setFocus(elem, { name: (name ? 'post: ' + name : ''), silent: !(silent === false), verify}), timeout || 333);
}

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
export function readRomanNumber(text, separator = '.', silent = SILENT) {
  try {
    const parts = separator ? text.split(separator) : [text];
    const startsAt = parts[0].search(/^[MDCLXVI)(]+$/);
    if (startsAt >= 0) {
      const number = fromRoman(parts[0].slice(startsAt));
      return ((number === undefined) ? '' : number) + separator + (parts.length > 1 ? parts.slice(1).join(separator) : '');
    }
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

// Returns accessibility properties of JSX object for Android
function getPropsAndroid(accessible, { type, checked, disabled, important }) {
  const props = {
    ...(accessible !== undefined && { accessible }),
    ...(important !== undefined ? { importantForAccessibility: important } : { importantForAccessibility: accessible ? 'yes' : 'no-hide-descendants' })
  };
  if (type && !disabled) {
    const controlType = { radiobutton: 'radiobutton', button: 'button', tab: 'button', switch: 'button',
                          checkbox: 'button', link: 'button' }[type];
    controlType && (props.accessibilityComponentType = controlType !== 'radiobutton' ? controlType : (checked ? 'radiobutton_checked' : 'radiobutton_unchecked'));
  }
  return props;
}

// Returns accessibility properties of JSX object for iOS
function getPropsIOS(accessible, { type, traits, disabled, hidden }) {
  const props = {
    ...(accessible !== undefined && { accessible }),
    ...(hidden && { accessibilityElementsHidden: true }),
    ...(traits && { accessibilityTraits: traits })
  };
  if (!traits && type && !disabled) {
    const controlType = { radiobutton: 'button', text: 'text', header: 'text', button: 'button', tab: 'button',
                          switch: 'button', checkbox: 'button', link: 'link', slider: 'adjustable' }[type];
    controlType && (props.accessibilityTraits = controlType);
  }
  return props;
}

/**
 * Returns accessibility properties for JSX element
 *
 * @param accessible true if element accessible
 * @param params.type element's type (one of 'button', 'text', 'checkbox' etc)
 * @param params.name element's name (e.g. text on button)
 * @param params.value element's value (e.g. 1 for switch, 20 for slider etc)
 * @param params.label element's label (overrides name/type pair)
 * @param params.disabled true if element is disabled
 * @param params.focus function to be called on ref to set accessiblity focus
 * @param params.object object type (e..g. 'view', 'modal')
 * @param params.traits special value for 'accessibilityTraits' (iOS)
 * @param params.hidden special value for 'accessibilityElementHidden' (iOS)
 * @param params.important spacial value for 'importantForAccessibility'; (Android)
 * @param params properties to add to a11yProps (e.g. a11yStatus)
 */
export function a11yProps(
  accessible,
  params = { type: '', name: '', value: '', label: '', disabled: 0, focus: 0,
             object: '', traits: '', hidden: false, important: undefined },
  addProps) {
  try {
    const options = { ...params};
    const buildLabel = accessible && ((options.name || options.value) || options.label);
    const type = options.type ? options.type : 'none';
    const propsOptions = {...options, ...{ type: buildLabel ? undefined : type}};
    const props = Platform.OS === 'ios' ? getPropsIOS(accessible, propsOptions) : getPropsAndroid(accessible, propsOptions);

    options.focus && (props.accessibilityFocus = options.focus);
    if (buildLabel) {
      props.accessibilityLabel = options.label ? options.label : a11yLabel(options.name, options.type, options.value, options.disabled);
    }
    if (options.object === 'modal' && Platform.OS === 'android' && props.accessibilityFocus) {
      delete props.accessibilityFocus; // crash on sendAccessibilityEvent for Modal (react 0.51) //TODO check against 0.54+
    }
    if (options.object === 'view' && Platform.OS === 'ios') {
      props.accessible = false;
    }
    return addProps ? {...props, ...addProps} : props;
  }
  catch (err) {
    log(err.message);
  }

  return {};
}

// Generates Accessibility labels for controls
export function a11yLabel(label, type = 'button', value, disabled = false) {
  const controlsTypes = ['button', 'tab', 'switch', 'radiobutton', 'checkbox', 'slider'];
  const suffix = ((controlsTypes.indexOf(type) >= 0) && disabled) ? ', disabled' : '';
  const hasValue = suffix.length === 0 && (value !== undefined);
  let accessibilityLabel = label || '';
  const control = { type: '', data: '' };

  switch (type) {
    case 'text':
      break;
    case 'header':
      control.type = 'Header';
      break;
    case 'button':
      control.type = 'Button';
      break;
    case 'tab':
      control.type = 'Tab Button';
      control.data = ((hasValue && value) ? 'Selected' : '');
      break;
    case 'switch':
      control.type = 'Switch Button';
      control.data = hasValue ? (value ?  'On' : 'Off') : '';
      break;
    case 'radiobutton':
      control.type = 'Radio Button';
      control.data = hasValue ? (value ?  'Checked' : 'Unchecked') : '';
      break;
    case 'checkbox':
      control.type = 'Check Box';
      control.data = hasValue ? (value ?  'Checked' : 'Unchecked') : '';
      break;
    case 'link':
      control.type = Platform.OS === 'ios' ? 'Link' : 'Button';
      break;
    case 'progress':
      control.type = 'Progress Bar';
      break;
    case 'slider':
      control.type = Platform.OS === 'ios' ? 'Adjustable' : '';
      control.data = hasValue ? '' + value : '';
      break;
    case 'duration':
      accessibilityLabel.length > 0 && (accessibilityLabel += ' ');
      accessibilityLabel += getDuration(value);
      break;
    default:
      if (type !== undefined && type.length) {
        control.type = type;
      }
  }

  (type === 'slider' && control.data.length) && (accessibilityLabel += ', ' + control.data);
  control.type.length && (accessibilityLabel += ', ' + control.type);
  (type !== 'slider' && control.data.length) && (accessibilityLabel += ', ' + control.data);

  return accessibilityLabel + suffix;
}

// Exported functions
export const publicUtils = {
  // Accessibility focus
  setFocus, postFocus,
  // Helpers (conversion to voice formats)
  readRomanNumber, getDateTime, getDuration, Locker,
  // JSX properties & helpers
  a11yProps, a11yLabel, cloneChildrenWithProps: helpers.cloneChildrenWithProps,
  // Track accessibility status
  requestStatus, beginTrackStatus, endTrackStatus,
  // Html helpers
  addLabel: html.addLabel, addClassAttribute: html.addClassAttribute,
  // Accessibility status
  accessibilityStatus
};

export default publicUtils;
