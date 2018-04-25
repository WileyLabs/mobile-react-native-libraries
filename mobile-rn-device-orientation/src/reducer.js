import Orientation from 'react-native-orientation';
import {
  SET_ORIENTATION
} from './constants';

const initialState = {
  orientation: Orientation.getInitialOrientation()
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ORIENTATION:
      return {
        ...state,
        orientation: action.orientation
      };
    default:
      return state;
  }
}
