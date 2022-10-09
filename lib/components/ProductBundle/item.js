import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import defaultClasses from './item.css';
import PriceBlock from '@castletech/pwa-module-core/lib/components/PriceBlock';
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

  const classes = useStyle(defaultClasses, props.classes);

  return (
    <div className={classes.root}>
      <figure className={classes.image}>
        <Image width={100} height={100} src={selectedProduct.small_image.url} />
      </figure>
      <div className={classes.wrapper}>
        <div className={classes.info}>
          <strong className={classes.title}>{title}</strong>
        </div>
        <div className={classes.price}>
          <PriceBlock product={selectedProduct} showInstallments={false} />
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
