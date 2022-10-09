import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import defaultClasses from './productBundle.css';
import { useProductBundle } from '../../talons/ProductBundle/useProductBundle';
import Item from './item';
import Price from '@magento/venia-ui/lib/components/Price';
import { FormattedMessage } from 'react-intl';
import Button from '@magento/venia-ui/lib/components/Button';
import Loading from '@magento/venia-ui/lib/components/LoadingIndicator';
import PriceBlock from '@castletech/pwa-module-core/lib/components/PriceBlock';

const ProductBundle = props => {
  const classes = useStyle(defaultClasses, props.classes);
  const { product } = props;
  const {
    items,
    subtotal,
    currencyCode,
    handleAddBundleToCart,
    handleSelectOption,
    selectedOptions,
    loadingAddBundleToCart,
    configuredBundleProduct
  } = useProductBundle({ product });

  if (!items || items.length === 0 || !currencyCode) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.price}>
        <PriceBlock product={configuredBundleProduct} />
      </div>

      {items && items.length > 0 && (
        <div className={classes.items}>
          {items.map(item => (
            <Item key={item.uid} item={item} handleSelectOption={handleSelectOption} />
          ))}
        </div>
      )}

      <div className={classes.actions}>
        <Button
          priority={'high'}
          onClick={handleAddBundleToCart}
          disabled={loadingAddBundleToCart}
        >
          {loadingAddBundleToCart ? (
            <Loading classes={{ root: classes.loading }} />
          ) : (
            <FormattedMessage
              id={'productFullDetail.cartAction'}
              defaultMessage={'Add to cart'}
            />
          )}
        </Button>
      </div>
    </div>
  );
};

ProductBundle.propTypes = {
  classes: shape({ root: string })
};

ProductBundle.defaultProps = {};

export default ProductBundle;