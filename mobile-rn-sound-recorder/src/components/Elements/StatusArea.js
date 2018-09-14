import React, { Component } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { gui, helpers } from '../../utils.js';

class StatusArea extends Component {

  static propTypes = {
    iconic: PropTypes.bool,
    hideIcon: PropTypes.bool,
    style: PropTypes.object,
    currentTime: PropTypes.number.isRequired
  };

  static defaultProps = {
    iconic: false,
    hideIcon: false,
    style: {},
    currentTime: 0.0
  };

  constructor(props) {
    super(props);
    this.layout = {
      fontSize: 14,
      iconSize: 22
    };
  }

  onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    this.layout.iconSize = Math.floor(Math.min(0.5 * height, 16));
  }

  render() {
    const { isRecording, currentTime, style, iconic, hideIcon } = this.props;
    const hasRecording = !isRecording && (currentTime > 0);
    const title = ['Recording...', 'Recorded'];
    const textStyle = helpers.updateStyle({ color: 'black', fontSize: 13 }, style.textStyle);
    const disabledTextStyle = helpers.updateStyle({ color: 'darkgrey' }, style.disabledTextStyle);
    const containerViewStyle = helpers.updateStyle(
      { flex: 0, flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', backgroundColor: 'transparent', height: '100%', width: '100%' }, style.containerViewStyle);
    const styles = {
      ...{ flex: 1, backgroundColor: 'white'},
      ...( style && {...style}),
      ...{ textStyle, disabledTextStyle, containerViewStyle }
    };
    const textColor = helpers.getField(styles, 'textStyle.color', 'black');
    const iconStyle = {...{ height: this.layout.iconSize }, ...(style && {...style.iconStyle}) };
    const showIcon = iconic || !hideIcon;

    try {
      style && style.title && (title[0] = style.title.split('|')[0]);
      style && style.title && (title[1] = style.title.split('|')[1]);
    }
    catch (err) {
      console.log('"style.title" should contain "Recording...|Recorded" status texts separated by |');
    }

    const text = ' ' + (iconic ? '' : title[isRecording ? 0 : 1]) + ' ' + currentTime.toFixed(2) + 's';

    return <View onLayout={this.onLayout} style={styles.containerViewStyle}>
            { isRecording &&
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                { showIcon && <ActivityIndicator size="small" color={textColor} animating={true} style={iconStyle}/> }
                { showIcon && <View style={{width: 8}}/> }
                <Text style={styles.textStyle}>{text}</Text>
              </View>
            }
            { !isRecording && showIcon &&
              <Icon name={gui.getIconName('*time')} type="ionicon" size={iconStyle.height}
                    color={textColor} underlayColor="transparent" iconStyle={iconStyle}/>
            }
            { hasRecording &&
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.textStyle}>{text}</Text>
              </View>
            }
           </View>;
  }

}

export default StatusArea;
