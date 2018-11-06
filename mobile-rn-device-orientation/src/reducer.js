import orientation from './orientation';
import constants from './constants';

export default function reducer(state = { status: orientation.getParams() }, action = {}) {
  switch (action.type) {
    case constants.SET_STATUS:
      return {
        ...state,
        status: action.status
      };
    default:
      return state;
  }
}
