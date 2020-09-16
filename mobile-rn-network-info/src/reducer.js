import { SET_NET_INFO_STATE } from './constants';

export default function reducer(state = { netInfoState: {} }, action = {}) {
  switch (action.type) {
    case SET_NET_INFO_STATE:
      return { netInfoState: action.netInfoState };
    default:
      return state;
  }
}
