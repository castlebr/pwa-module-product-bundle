module.exports = targets => {
  targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
    flags[targets.name] = {
      esModules: true,
      cssModules: true,
      i18n: true
    };
  });

  // product type variant
  targets.of('@castletech/pwa-module-product-type').productType.tap(types =>
    types.add({
      condition: "product.__typename === 'BundleProduct'",
      componentName: 'ProductBundle',
      componentPath: '@castletech/pwa-module-product-bundle/lib/components/ProductBundle'
    })
  );
};
