import SaveButton from './SaveButton';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectors, actions } from '../../../index.js';

function mapStateToProps(state) {
  return {
    isReadyToSave: selectors.isReadyToSave(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    saveAsFileRequest: actions.saveAsFileRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SaveButton);
