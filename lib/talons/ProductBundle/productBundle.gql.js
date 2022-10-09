import { gql } from '@apollo/client';

const GET_BUNDLE_PRODUCT = gql`
  query getProductBundle($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        __typename
        sku
        uid
        name
        ... on BundleProduct {
          dynamic_sku
          dynamic_price
          dynamic_weight
          price_view
          ship_bundle_items
          items {
            uid
            title
            required
            type
            position
            sku
            option_id
            options {
              id
              uid
              quantity
              position
              is_default
              price
              price_type
              can_change_quantity
              label
              product {
                uid
                name
                small_image {
                  url
                }
                price_range {
                  minimum_price {
                    regular_price {
                      currency
                      value
                    }
                  }
                  maximum_price {
                    regular_price {
                      currency
                      value
                    }
                  }
                }
                special_price
                sku
                stock_status
                url_key
                url_suffix
              }
            }
          }
        }
      }
    }
  }
`;

const ADD_BUNDLE_PRODUCTS_TO_CART = gql`
  mutation addBundleProductsToCart(
    $cart_id: String!
    $cart_items: [BundleProductCartItemInput]!
  ) {
    addBundleProductsToCart(input: { cart_id: $cart_id, cart_items: $cart_items }) {
      cart {
        items {
          product {
            name
          }
        }
      }
    }
  }
`;

export default {
  getBundleProductQuery: GET_BUNDLE_PRODUCT,
  addBundleProductsToCartMutation: ADD_BUNDLE_PRODUCTS_TO_CART
};
