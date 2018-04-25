import { SET_CONNECTED } from './constants';

export default function reducer(state = { connected: null }, action = {}) {
  switch (action.type) {
    case SET_CONNECTED:
      return { connected: action.connected };
    default:
      return state;
  }
}
