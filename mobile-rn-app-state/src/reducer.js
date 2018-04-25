import { SET_APP_STATE } from './constants';

export default function reducer(state = { appState: null }, action = {}) {
  switch (action.type) {
    case SET_APP_STATE:
      return { appState: action.appState };
    default:
      return state;
  }
}
