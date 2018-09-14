import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Elements from '../index.js';
import { helpers } from '../../utils';

//https://react-native-training.github.io/react-native-elements/docs/0.19.0/button.html

class Recorder extends Component {

  static propTypes = {
    style: PropTypes.object,
    options: PropTypes.object,
    mountRequest: PropTypes.func.isRequired,
    unmountRequest: PropTypes.func.isRequired
  };

  static defaultProps = {
    style: {},
    options: {}
  };

  constructor(props) {
    super(props);
    this.layout = {
      splitterHeight: 4,
      fontSize: 16,
      iconSize: 14
    };
  }

  componentDidMount() {
    this.props.mountRequest({...this.props.options});
  }

  componentWillUnmount() {
    this.props.unmountRequest();
  }

  onLayout = event => {
    const unit = event.nativeEvent.layout.height / 12;
    this.layout = {
      splitterHeight: unit,
      fontSize: unit * 4,
      iconSize: unit * 5
    };

  };

  initStyles = props => {

    const commons = { flex: 4, backgroundColor: 'white', disabledTextStyle: {color: 'darkgrey'}, containerViewStyle: {width:'100%'}, iconStyle: { height: this.layout.iconSize } };
    const button = { ...commons, ... { textStyle: {color: 'black', fontSize: this.layout.fontSize, fontWeight: '500'} }};
    const status = { ...commons, ... { textStyle: {color: 'darkgreen', fontSize: this.layout.fontSize - 2} }};
    const splitter = { flex: 0, height: this.layout.splitterHeight };
    this.styles = {
      record: helpers.updateStyle(button, {...(props && {...props.record})}),
      save: helpers.updateStyle(button, {...(props && {...props.save})}),
      status: helpers.updateStyle(status, {...(props && {...props.status})}),
      splitter: helpers.updateStyle(splitter, {...(props && {...props.splitter})})
    };
  };

  render() {
    const { record, save, status } = this.props;

    this.styles || this.initStyles(this.props);

    return (
      <View style={styles.outerContainer} onLayout={this.onLayout}>
        {!(record && record.hidden) && <Elements.RecordButton style={this.styles.record}/>}
        {!(record && record.hidden) && <View style={[styles.view, this.styles.splitter]}/>}
        {!(save && save.hidden) && <Elements.SaveButton style={this.styles.save}/>}
        {!(save && save.hidden) && <View style={[styles.view, this.styles.splitter]}/>}
        {!(status && status.hidden) && <Elements.StatusArea style={this.styles.status}/>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  view : {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  }
});

export default Recorder;
