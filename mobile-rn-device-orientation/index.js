import reducer from './src/reducer';
import saga from './src/sagas';
import actions from './src/actions';
import selectors from './src/selectors';
import constants from './src/constants';

const { NAME, mode, specificMode, ON_ORIENTATION_CHANGE, ON_SPECIFIC_ORIENTATION_CHANGE } = constants;
const { initRequest, lockOrientation, lockSpecificOrientation } = actions;
const { getOrientation, getSpecificOrientation } = selectors;

export default {
  actions, reducer, saga, selectors, constants,
  NAME, mode, specificMode,
  ON_ORIENTATION_CHANGE, ON_SPECIFIC_ORIENTATION_CHANGE,
  initRequest, getOrientation, getSpecificOrientation, lockOrientation, lockSpecificOrientation
};

export {
  actions,
  reducer,
  saga,
  selectors,
  constants
};


