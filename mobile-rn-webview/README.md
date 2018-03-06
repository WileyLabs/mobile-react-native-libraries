
# mobile-rn-webview

WebView with onShouldStartLoadWithRequest method supported on Android platform

## Getting started

`$ npm install mobile-rn-webview --save`

### Mostly automatic installation

`$ react-native link mobile-rn-webview`

### Manual installation


#### iOS

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNMobileRnWebviewPackage;` to the imports at the top of the file
  - Add `new RNMobileRnWebviewPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':mobile-rn-webview'
  	project(':mobile-rn-webview').projectDir = new File(rootProject.projectDir, 	'../node_modules/mobile-rn-webview/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':mobile-rn-webview')
  	```

## Usage

```javascript
import Webview from 'mobile-rn-webview';

onShouldStartLoadWithRequest(event) {
    const { url } = event;
    ...
}

...

<WebView style={{flex: 1, borderWidth: 2, borderColor: 'red'}}
        source={{html: html}}
        onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
/>
...

```
