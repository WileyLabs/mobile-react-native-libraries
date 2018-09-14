import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { gui, helpers } from '../../utils.js';

class RecordButton extends Component {

  static propTypes = {
    style: PropTypes.object,
    iconic: PropTypes.bool,
    hideIcon: PropTypes.bool,
    isMounted: PropTypes.bool.isRequired,
    isRecording: PropTypes.bool.isRequired,
    startRequest: PropTypes.func.isRequired,
    stopRequest: PropTypes.func.isRequired,
    onPress: PropTypes.func
  };

  static defaultProps = {
    style: {},
    iconic: false,
    hideIcon: false,
    isMounted: false,
    isRecording: false
  };

  handlePress = () => {
    this.props.isRecording ? this.props.stopRequest() : this.props.startRequest();
    this.props.onPress && this.props.onPress();
  }

  render() {
    const { isRecording, isMounted, style, iconic, hideIcon } = this.props;
    const title = ['Start', 'Stop'];
    const textStyle = helpers.updateStyle({ color: 'black', fontSize: 16 }, style.textStyle);
    const disabledTextStyle = helpers.updateStyle({ color: 'darkgrey' }, style.disabledTextStyle);
    const containerViewStyle = helpers.updateStyle({ width:'100%' }, style.containerViewStyle);
    const buttonStyle = {...{ flex: 1, height: '100%', borderWidth: 1, borderRadius: 8, borderColor: '#f4a460', backgroundColor: 'white'}, ...(style && {...style.buttonStyle}) };
    const styles = {
      ...{ flex: 1, backgroundColor: 'white'},
      ...( style && {...style}),
      ...{ textStyle, disabledTextStyle, containerViewStyle, buttonStyle }
    };
    const textColor = helpers.getField(styles, 'textStyle.color', 'black');

    try {
      style && style.title && (title[0] = style.title.split('|')[0]);
      style && style.title && (title[1] = style.title.split('|')[1]);
    }
    catch (err) {
      console.log('"style.title" should contain "Start|Stop" button names separated by |');
    }

    return isRecording ? <Button large icon={hideIcon ? {} : { name: gui.getIconName('*mic-off'), type: 'ionicon', color: textColor }}
                                  onPress={this.handlePress}
                                  {...styles}
                                  title={iconic ? '' : title[1]}
                          /> :
                          <Button large icon={hideIcon ? {} : { name: gui.getIconName('*mic'), type: 'ionicon', color: textColor }}
                                  onPress={this.handlePress}
                                  {...styles}
                                  title={iconic ? '' : title[0]}
                                  disabled={!isMounted}
                          />;
  }
}

export default RecordButton;
