import React, { Component } from 'react';
import { WebView } from 'react-native';

class MobileRNWebView extends Component {

  constructor(props) {
    super(props);
    this.state = { source: props.source };
    this.nativeConfig = { props: { onShouldStartLoadWithRequest: this.onShouldStartLoadWithRequest }};
  }

  componentWillReceiveProps({ source }) {
    this.setState({ source });
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

  injectJavaScript = (data) => {
    this.webView.injectJavaScript(data);
  };

  getRef = (webView) => {
    this.webView = webView;
  };

  render() {
    const { source } = this.state;
    return <WebView ref={this.getRef} {...this.props} source={source} nativeConfig={this.nativeConfig} />;
  }

}

export default MobileRNWebView;
