import React from 'react';
import { WebView } from 'react-native';

class MobileRNWebView extends WebView {

  constructor(props) {
    super(props);
    this.state = { source: props.source };
  }

  onShouldStartLoadWithRequest = (event) => {
    const { url } = event.nativeEvent;

    if (this.props.onShouldStartLoadWithRequest) {
      if (this.props.onShouldStartLoadWithRequest(event.nativeEvent)) {
        this.setState({ source: { uri: url } });
      }
    } else {
      this.setState({ source: { uri: url } });
    }
  };

  render() {
    const { source } = this.state;
    const nativeConfig = { props: { onShouldStartLoadWithRequest: this.onShouldStartLoadWithRequest }};
    return <WebView {...this.props} source={source} nativeConfig={nativeConfig} />;
  }

}

export default MobileRNWebView;
