import Orientation from 'react-native-orientation';
import { SET_ORIENTATION, SET_ORIENTATION_LOCK,
         SET_SPECIFIC_ORIENTATION, SET_SPECIFIC_ORIENTATION_LOCK,
         SET_SILENT } from './constants';

const initialState = {
  orientation: Orientation.getInitialOrientation(),
  orientationLock: undefined,
  specificOrientation: undefined,
  specificOrientationLock: undefined,
  silent: true
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ORIENTATION:
      return {
        ...state,
        orientation: action.orientation
      };
    case SET_ORIENTATION_LOCK:
      return {
        ...state,
        orientationLock: action.orientation
      };
    case SET_SPECIFIC_ORIENTATION:
      return {
        ...state,
        specificOrientation: action.specificOrientation
      };
    case SET_SPECIFIC_ORIENTATION_LOCK:
      return {
        ...state,
        specificOrientationLock: action.specificOrientation
      };
    case SET_SILENT:
      return {
        ...state,
        silent: action.silent
      };
    default:
      return state;
  }
}
