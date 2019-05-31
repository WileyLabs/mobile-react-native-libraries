/**
 * Accessibility utils
 *
 * Version: 0.0.6, 2018.08.16
 * Created: 2018.07.01 by mmalykh@wiley.com
 */
import { Platform, UIManager, findNodeHandle, AccessibilityInfo } from 'react-native';
import html from './utils/html.js';
import helpers from './utils/helpers.js';
import text from './utils/text.js';
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
 * @param name element name (optional options {})
 * @param silent false to switch on logging and error reporting (optional options {})
 * @param verify function to be called just before sendAccesibilityEvent to verify that elem exists (Android, rn 0.56+) (optional options {})
 * @see {@link https://github.com/facebook/react-native/issues/12492}
 */
export function setFocus(elem, { name = '', silent = SILENT, verify = () => true, done = () => {} } =
                               { name: '', silent: SILENT, verify: () => true, done: () => {} }) {
  const obj = silent ? {} :  { name, elem: helpers.getField(elem, '_nativeTag'), object: helpers.getField(elem, 'viewConfig.uiViewClassName')};
  if (!Accessibility.status && Platform.OS === 'android') {
    return;
  }
  if (!elem) {
    silent || log('Invalid reference passed', obj);
    return;
  }
  try {
    const node = findNodeHandle(elem);
    if (node && (!verify || verify())) {
      silent || log(obj);
      Platform.OS === 'ios' ? AccessibilityInfo.setAccessibilityFocus(node) : UIManager.sendAccessibilityEvent(node, 8);
      done && done(name);
    }
    else {
      silent || log('Verification failed', obj);
    }
  }
  catch (err) {
    silent || log(err.message, obj);
  }
}

/**
 * Posts accessibility focus
 * @param elem Element
 * @param name element name (optional options {})
 * @param timeout post timeout (optional options {})
 * @param silent false to switch on logging (optional options {})
 * @param verify function to be called by setFocus to verify that elem exists ('mounted' on Android, rn 0.56+) (optional options {})
 */
export function postFocus(elem, { name = '', timeout = 333, silent = SILENT, verify = () => true, done = () => {} } =
                                { name: '', timeout: 333, silent: SILENT, verify: () => true, done: () => {} }) {
  elem && setTimeout(() => setFocus(elem, { name: (name ? 'post: ' + name : ''), silent, verify, done}), timeout || 333);
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
// 0.57: ...(hint && { accessibilityHint: hint })
function getPropsIOS(accessible, { type, traits, disabled, hidden, hint }) {
  const props = {
    ...(accessible !== undefined && { accessible }),
    ...(hidden !== undefined && { accessibilityElementsHidden: hidden }),
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
 * @param params.hidden special value for 'accessibilityElementsHidden' (iOS)
 * @param params.important spacial value for 'importantForAccessibility'; (Android)
 * @param params properties to add to a11yProps (e.g. a11yStatus)
 * @param addProps optional additional props to be passes as 'accesisility props'
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
export function a11yLabel(label, type = 'button', value, disabled = false, action) {
  const controlsTypes = ['button', 'tab', 'switch', 'radiobutton', 'checkbox', 'slider', 'menuitem', 'listitem', 'phone'];
  let suffix = ((controlsTypes.indexOf(type) >= 0) && disabled) ? ', disabled' : '';
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
      control.type = 'Link';
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
      accessibilityLabel += text.getDuration(value);
      break;
    case 'menuitem':
      control.type = 'Menu Item';
      control.data = hasValue ? (value ?  'Selected' : '') : '';
      if (!suffix.length && action && action.length) {
        suffix = ', double tap to ' + action;
      }
      break;
    case 'listitem':
      control.type = 'List Item';
      control.data = hasValue ? (value ?  'Selected' : '') : '';
      if (!suffix.length && action && action.length) {
        suffix = ', double tap to ' + action;
      }
      break;
    case 'phone':
      control.type = 'Phone Number';
      if (!suffix.length && action && action.length) {
        suffix = ', double tap to ' + action;
      }
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
  // Helpers
  Locker,
  readRomanNumber: text.readRomanNumber, replaceRomanNumbers: text.replaceRomanNumbers,
  getDateTime: text.getDateTime, getDuration: text.getDuration,
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
