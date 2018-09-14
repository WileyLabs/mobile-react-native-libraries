import reducer from './src/reducer';
import saga from './src/sagas';
import actions from './src/actions';
import selectors from './src/selectors';
import constants from './src/constants';
import components from './src/components';

const { NAME, ON_ERROR, ON_RECORDING_SAVED } = constants;
const { Recorder, RecordButton, SaveButton, StatusArea } = components;

export {
  reducer, saga, selectors, actions, constants, components
};

export default {
  reducer, saga, selectors, actions, constants, components,
  NAME, ON_ERROR, ON_RECORDING_SAVED,
  Recorder, RecordButton, SaveButton, StatusArea
};
