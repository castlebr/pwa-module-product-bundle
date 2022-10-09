import { useState, useCallback, useMemo } from 'react';
import { useStoreConfigContext } from '@castletech/pwa-module-core/lib/context/storeConfig';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './productBundle.gql';
import { useMutation, useQuery } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

export const useProductBundle = (props = {}) => {
  const { product } = props;
  const { sku } = product;
  const [{ currencyCode }] = useStoreConfigContext();
  const [{ cartId }] = useCartContext();

  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { addBundleProductsToCartMutation, getBundleProductQuery } = operations;

  const {
    error: errorProductBundle,
    loading: loadingProductBundle,
    data: dataProductBundle
  } = useQuery(getBundleProductQuery, {
    skip: !sku,
    variables: {
      sku
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  const [
    addBundleToCart,
    {
      error: errorLoadingAddBundleToCart,
      loading: loadingAddBundleToCart,
      data: dataAddBundleToCart
    }
  ] = useMutation(addBundleProductsToCartMutation);

  const [selectedOptions, setSelectedOptions] = useState([]);

  const items = useMemo(() => {
    if (
      dataProductBundle &&
      dataProductBundle.products &&
      dataProductBundle.products.items &&
      dataProductBundle.products.items.length > 0
    ) {
      const finded = dataProductBundle.products.items.find(item => item.sku === sku);
      if (finded) return finded.items;
    }
  }, [sku, dataProductBundle]);

  const handleSelectOption = useCallback(
    ({ optionId, selectionId }) => {
      setSelectedOptions(prevState => [
        { optionId, selectionId },
        ...prevState.filter(item => item.optionId !== optionId)
      ]);
    },
    [selectedOptions]
  );

  const setBundlePrice = useCallback(
    ({ special = false } = {}) => {
      if (selectedOptions && selectedOptions.length > 0) {
        return selectedOptions.reduce((a, { optionId, selectionId }) => {
          if (items && items.length > 0) {
            const optionProduct = items.find(item => item.option_id === optionId);
            if (optionProduct) {
              const { options } = optionProduct;
              const selectedOption = options.find(item => item.id === selectionId);
              if (selectedOption) {
                const {
                  special_price,
                  price_range: {
                    minimum_price: { regular_price }
                  }
                } = selectedOption.product;
                if (special) {
                  const finalPrice = special_price ? special_price : regular_price.value;
                  return a + finalPrice;
                } else {
                  return a + regular_price.value;
                }
              }
            }
          }
        }, 0);
      }
      return 0;
    },
    [selectedOptions, items]
  );

  const subtotal = 0;

  const configuredBundleProduct = useMemo(() => {
    if (product) {
      const regular_price = setBundlePrice();
      const special_price = setBundlePrice({ special: true });
      return {
        ...product,
        price_range: {
          minimum_price: {
            regular_price: {
              value: regular_price,
              currency: currencyCode
            }
          }
        },
        special_price
      };
    }
  }, [currencyCode, product, setBundlePrice]);

  const handleAddBundleToCart = useCallback(async () => {
    const cartItems = [
      {
        data: {
          sku: product.sku,
          quantity: 1
        },
        bundle_options: selectedOptions.map(({ optionId, selectionId }) => ({
          id: optionId,
          quantity: 1,
          value: [`${selectionId}`]
        }))
      }
    ];

    try {
      await addBundleToCart({
        variables: {
          cart_id: cartId,
          cart_items: cartItems
        }
      });
    } catch (error) {
      console.error(error);
    }
  }, [cartId, product, selectedOptions]);

  return {
    items,
    subtotal,
    currencyCode,
    handleAddBundleToCart,
    handleSelectOption,
    selectedOptions,
    loadingAddBundleToCart,
    dataAddBundleToCart,
    configuredBundleProduct
  };
};
