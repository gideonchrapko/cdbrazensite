import { useState } from 'react';
import { useShopify } from '../hooks';

export const SizeVariant = (props) => {
  const { products, openCart, checkoutState, addVariant } = useShopify();

  const { description, product } = props;
  const [click, setClicked] = useState();
  const [size, setSize] = useState('');
  const [available, setAvailable] = useState(true);
  const [sizeSelected, setSizeSelected] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [prodIndex, setProdIndex] = useState(0);

  function changeSize(sizeId, quantity) {
    openCart();
    if (sizeId === '') {
      sizeId = products[prodIndex].variants[0].id;
      const lineItemsToAdd = [
        { variantId: sizeId, quantity: parseInt(quantity, 10) },
      ];
      const checkoutId = checkoutState.id;
      addVariant(checkoutId, lineItemsToAdd);
    } else {
      const lineItemsToAdd = [
        { variantId: sizeId, quantity: parseInt(quantity, 10) },
      ];
      const checkoutId = checkoutState.id;
      addVariant(checkoutId, lineItemsToAdd);
    }
  }

  return (
    <div>
      <div
        style={{
          width: '100%',
        }}
      >
        {description &&
          description.map((each, i) => {
            return (
              <p
                style={{
                  textAlign: 'center',
                  maxWidth: '150px',
                  margin: 'auto',
                  fontFamily: 'lucon',
                }}
                key={`line-description +${i}`}
              >
                {each}
              </p>
            );
          })}
      </div>
      <div
        style={{
          display: 'flex',
          maxWidth: '90px',
          margin: 'auto',
          paddingBottom: '10px',
        }}
      >
        {product.variants &&
          product.variants.map((variant, item) => {
            const varWidth = 100 / product.variants.length;
            return (
              <div
                key={variant.title + item}
                onClick={(e) => {
                  setSize(variant.id.toString());
                  setClicked(item);
                  setAvailable(variant.available);
                  setSizeSelected(true);
                }}
                className="Prod-font-size"
                style={{
                  cursor: 'pointer',
                  width: `${varWidth}%`,
                  color: variant.available
                    ? `${click === item ? '#FF09B1' : 'black'}`
                    : 'grey',
                }}
              >
                {variant.title}
              </div>
            );
          })}
      </div>
      <div style={{ margin: '0', position: 'relative' }}>
        {sizeSelected && available ? (
          <div style={{ width: '100%', display: 'flex' }}>
            <h3
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                changeSize(size, quantity);
                // setProdIndex(i);
              }}
              className="Prod-cart"
            >
              Add to Cart
            </h3>
          </div>
        ) : (
          <div style={{ width: '100%', display: 'flex' }}>
            <h3
              style={{
                cursor: 'not-allowed',
                color: 'grey',
              }}
              className="Prod-cart"
            >
              {sizeSelected ? 'Out of Stock' : 'Select a Size'}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeVariant;
