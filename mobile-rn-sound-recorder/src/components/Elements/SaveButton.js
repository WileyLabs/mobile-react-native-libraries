import React, { Component } from 'react';
import { Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { helpers } from '../../utils';

class SaveButton extends Component {

  static propTypes = {
    style: PropTypes.object,
    iconic: PropTypes.bool,
    hideIcon: PropTypes.bool,
    fileInfo: PropTypes.object,
    userData: PropTypes.object,
    isReadyToSave: PropTypes.bool.isRequired,
    saveAsFileRequest: PropTypes.func.isRequired,
    onPress: PropTypes.func
  };

  static defaultProps = {
    style: {},
    iconic: false,
    hideIcon: false,
    fileInfo: {},
    userData: {},
    isReadyToSave: false
  };

  handlePress = () => {
    this.props.saveAsFileRequest(this.props.fileInfo, this.props.userData);
    this.props.onPress && this.props.onPress();
  }

  render() {
    const { isReadyToSave, style, iconic, hideIcon } = this.props;
    const disabled = !isReadyToSave;
    const textStyle = helpers.updateStyle({ color: 'black', fontSize: 16 }, style.textStyle);
    const disabledTextStyle = helpers.updateStyle({ color: 'darkgrey' }, style.disabledTextStyle);
    const containerViewStyle = helpers.updateStyle({ width:'100%', backgroundColor: 'transparent' }, style.containerViewStyle);
    const buttonStyle = {...{ flex: 1, borderWidth: 1, borderRadius: 8,
                              borderColor: '#f4a460', backgroundColor: 'white'}, ...(style && {...style.buttonStyle}) };
    const styles = {
      ...{ flex: 1, backgroundColor: 'white'},
      ...( style && {...style}),
      ...{ textStyle, disabledTextStyle, containerViewStyle, buttonStyle }
    };
    const textColor = helpers.getField(styles, 'textStyle.color', 'black');
    const iconStyle = hideIcon ? {} : helpers.updateStyle({ name: 'save', type: 'font-awesome', color: textColor, height: 14 }, style && {...style.iconStyle});

    return <Button large icon={iconStyle}
                  onPress={this.handlePress}
                  {...styles}
                  title={iconic ? '' : helpers.getField(style, 'title', 'Save')}
                  disabled={disabled}
            />;

  }

}

export default SaveButton;
