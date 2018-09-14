import Recorder from './Recorder';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions } from '../../../index.js';

function mapStateToProps(state, ownProps) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    mountRequest: actions.mountRequest,
    unmountRequest: actions.unmountRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Recorder);
