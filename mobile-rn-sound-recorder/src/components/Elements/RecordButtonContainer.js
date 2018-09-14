import RecordButton from './RecordButton';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectors, actions } from '../../../index.js';

function mapStateToProps(state) {
  return {
    isMounted: selectors.isMounted(state),
    isRecording: selectors.isRecording(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    startRequest: actions.startRequest,
    stopRequest: actions.stopRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordButton);
