import { useCallback, useMemo, useState, useEffect } from 'react';

export const useItem = (props = {}) => {
  const { options, option_id, handleSelectOption } = props;

  const [selectedProduct, setSelectedProduct] = useState(null);

  const selectOptions = useMemo(() => {
    if (!options || options.length === 0) return [];
    return options
      .map(({ id, product }) => {
        if (!product) return null;
        return {
          key: product.uid,
          label: `${product.name.replace(/.*-/, '')}`,
          value: id
        };
      })
      .filter(item => !!item);
  }, [options]);

  useEffect(() => {
    if (!selectedProduct && options && options.length > 0) {
      const { product, id } = options[0];
      console.log('efect', { product, id });
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
