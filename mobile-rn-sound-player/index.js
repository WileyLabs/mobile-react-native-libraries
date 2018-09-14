import reducer from './src/reducer';
import saga from './src/sagas';
import actions from './src/actions';
import selectors from './src/selectors';
import constants from './src/constants';

const { NAME, ON_ERROR, ERROR_NO_ERROR, ERROR_NOT_MOUNTED, ERROR_SOURCE_URI, ERROR_PLAYBACK } = constants;

export {
  reducer, saga, actions, selectors, constants
};

export default {
  reducer, saga, selectors, actions, constants,
  NAME, ON_ERROR,
  ERROR_NO_ERROR, ERROR_NOT_MOUNTED, ERROR_SOURCE_URI, ERROR_PLAYBACK
};
