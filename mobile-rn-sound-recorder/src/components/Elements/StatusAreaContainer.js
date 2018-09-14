import StatusArea from './StatusArea';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectors } from '../../../index.js';

function mapStateToProps(state) {
  return {
    isRecording: selectors.isRecording(state),
    currentTime: selectors.getCurrentTime(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusArea);
