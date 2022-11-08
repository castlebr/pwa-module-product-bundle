import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import defaultClasses from './item.css';
import Price from '@magento/venia-ui/lib/components/Price';
import Image from '@magento/venia-ui/lib/components/Image';
import { useItem } from '../../talons/ProductBundle/useItem';
import Select from '@magento/venia-ui/lib/components/Select';

const Item = props => {
  const { item, handleSelectOption } = props;
  const { title, options, option_id } = item;

  const { selectOptions, handleChange, selectedProduct } = useItem({
    options,
    handleSelectOption,
    option_id
  });

  if (!selectedProduct) {
    return null;
  }

  const {
    price_range: {
      minimum_price: { regular_price },
      special_price
    }
  } = selectedProduct;
  const finalPrice = special_price ? special_price : regular_price.value;

  const classes = useStyle(defaultClasses, props.classes);

  return (
    <div className={classes.root}>
      <figure className={classes.image}>
        <Image
          width={100}
          height={100}
          src={selectedProduct.small_image.url}
          alt={selectedProduct.name}
        />
      </figure>
      <div className={classes.wrapper}>
        <div className={classes.info}>
          <strong className={classes.title}>{title}</strong>
        </div>
        <div className={classes.price}>
          <Price value={finalPrice} currencyCode={regular_price.currency} />
          {/* bundle_price_targetable_api */}
        </div>
        <div className={classes.options}>
          <Select field={item.uid} items={selectOptions} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

Item.propTypes = {
  classes: shape({ root: string })
};

Item.defaultProps = {};

export default Item;
