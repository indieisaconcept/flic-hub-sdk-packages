# Helpers

This package provides helpers to assist with building other packages.

## Usage

This package can be referenced from others as follows.

```javascript
const helpers = require('../helpers/main');
```

## Helpers

### registerButtonPackage

Provides a standardised way of creating a button package which responds to
**click**, **double-click** & **hold** actions.

```javascript
const helpers = require('../helpers/main');

helpers.registerButtonPackage('mypackagename', {
    onClick: function (config, button) {
        console.log(config.configValue) // 1
        // do something
    },
    onDoubleClick: function(config, button) {
        // do something
    },
    onHold: function(config, button) {
        // do something
    }
});
```

Each button function is passed a config object which contains configuration options extracted from the button name. Additionally a metadata object is passed for the current button.

Packages created using this method can be used by naming your button as per the following.

```
sdk://mypackagename?configValue=1&configValue=2
```