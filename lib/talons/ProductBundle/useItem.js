import { useCallback, useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

export const useItem = (props = {}) => {
  const { options, option_id, handleSelectOption } = props;
  const { formatMessage, locale } = useIntl();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const selectOptions = useMemo(() => {
    if (!options || options.length === 0) return [];
    
    return options
      .map(({ id, product }) => {
        if (!product) return null;
        const {
          stock_status,
          uid,
          name,
          label,
          price_range: {
            minimum_price: { regular_price }
          },
          special_price
        } = product;
        const formatCurrency = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: regular_price.currency,
          minimumFractionDigits: 2
        });
        const finalValue = special_price ? special_price : regular_price.value;
        const formatedValue = formatCurrency.format(finalValue);
        const status =
          stock_status === 'OUT_OF_STOCK'
            ? formatMessage({
                id: 'productBundle.outOfStock',
                defaultMessage: 'Out of stock'
              })
            : `+${formatedValue}`;

        const finalName = label ? label : name.replace(/.*-/, '');

        return {
          key: uid,
          label: `${finalName} ${status}`,
          value: id,
          disabled: stock_status === 'OUT_OF_STOCK'
        };
      })
      .filter(item => !!item);
  }, [options]);

  useEffect(() => {
    if (!selectedProduct && options && options.length > 0) {
      const { product, id } = options[0];
      if (!!product) {
        setSelectedProduct(product);
      }
      if (id && option_id) {
        handleSelectOption({ optionId: option_id, selectionId: id });
      }
    }
  }, [selectedProduct, options, option_id]);

  const handleChange = useCallback(
    ({ target: { value } }) => {
      const selectionId = Number(value);
      if (options && options.length > 0) {
        const finded = options.find(({ id }) => id === selectionId);
        if (finded && finded.product) {
          setSelectedProduct(finded.product);
        }
      }
      handleSelectOption({ optionId: option_id, selectionId });
    },
    [options, handleSelectOption, setSelectedProduct]
  );

  return {
    selectOptions,
    handleChange,
    selectedProduct
  };
};
