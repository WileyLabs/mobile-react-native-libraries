import { NAME } from './constants';

export const getAppState = (state) => state[NAME].appState;
export const isActive = (state) => state[NAME].appState === 'active';

export const publicSelectors = {
  getAppState,
  isActive
};
