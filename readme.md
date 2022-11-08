## PWA Studio Product Bundle Extension

![Preview](https://raw.githubusercontent.com/castlebr/pwa-module-product-bundle/master/docs/preview.jpg 'Preview')

This module depends on [Product Types Module](https://github.com/castlebr/pwa-module-product-type), below you can see a simple guide to install the Product Bundle and its dependencies.

#### 1. Installation

```
yarn add @castletech/pwa-module-product-type @castletech/pwa-module-product-bundle
```

#### 2. Active Product Type module in your local-intercept

```
const {
  wrapProductTypeModule
} = require('@castletech/pwa-module-product-type/targets');
wrapProductTypeModule({
  targets
});
```

#### 3. Run project

```
yarn watch
```
