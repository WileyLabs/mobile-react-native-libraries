/**
 * Specific orientation interface
 * react-native-orientation with RN 0.56 does not support specific orientation on android
 * https://github.com/yamill/react-native-orientation/issues/308
*/
import { Platform } from 'react-native';

export default function ({
    getSpecificOrientation,
    addSpecificOrientationListener,
    removeSpecificOrientationListener,
    lockToLandscapeLeft,
    lockToLandscapeRight
}) {
  const ios = Platform.OS === 'ios';
  return {
    isSupported: () => ios,
    getOrientation: cb => ios ? getSpecificOrientation(cb) : () => {},
    addOrientationListener: fn => ios ? addSpecificOrientationListener(fn) : () => {},
    removeOrientationListener: fn => ios ? removeSpecificOrientationListener(fn) : () => {},
    lockToLandscapeLeft: () => ios ? lockToLandscapeLeft() : () => {},
    lockToLandscapeRight: () => ios ? lockToLandscapeRight() : () => {}
  };
}
