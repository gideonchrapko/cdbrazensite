import React, { useEffect, useState, useRef } from 'react';
import { useShopify } from '../hooks';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

export default function Product() {
  const { product, fetchProduct, openCart, checkoutState, addVariant } =
    useShopify();
  const { productHandle } = useParams();
  const [size, setSize] = useState('');
  const [click, setClicked] = useState(false);
  const [available, setAvailable] = useState(true);
  const [sizeSelected, setSizeSelected] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const description = product?.description && product?.description.split('.');
  const [imageIndex, setImageIndex] = useState(0);
  const imagesContainerRef = useRef(null);

  function changeSize(sizeId, quantity) {
    openCart();
    if (sizeId === '') {
      sizeId = product?.variants[0].id;
      const lineItemsToAdd = [
        { variantId: sizeId, quantity: parseInt(quantity, 10) },
      ];
      const checkoutId = checkoutState?.id;
      addVariant(checkoutId, lineItemsToAdd);
    } else {
      const lineItemsToAdd = [
        { variantId: sizeId, quantity: parseInt(quantity, 10) },
      ];
      const checkoutId = checkoutState?.id;
      addVariant(checkoutId, lineItemsToAdd);
    }
  }

  useEffect(() => {
    fetchProduct(productHandle);
  }, [productHandle]);

  const handleImageClickScroll = (index) => {
    setImageIndex(index);
    if (imagesContainerRef.current) {
      const imageElement = imagesContainerRef.current.children[index];
      if (imageElement) {
        imageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleImageIndex = (index) => {
    setImageIndex(index);
  };

  // console.log(product?.images[0]?.src, 'image index');

  return (
    <Container fluid>
      <Row style={{ fontFamily: 'lucon' }}>
        <Col
          sm={{ span: 12 }}
          md={{ span: 7 }}
          style={{
            height: '100vh',
            padding: '100px',
            overflow: 'scroll',
          }}
          ref={imagesContainerRef}
          className="mobile-hiding"
        >
          {product?.images &&
            product.images.map((image, i) => (
              <img
                key={image.id}
                src={image.src}
                alt={`${product?.title} product shot`}
              />
            ))}
        </Col>

        <Col style={{ height: '100vh' }}>
          <div className="product-details-container">
            {product?.images && (
              <div className="desktop-hiding-images">
                <img
                  src={product.images[imageIndex].src}
                  style={{
                    height: '100%',
                    overflow: 'scroll',
                    marginTop: '40px',
                  }}
                  alt="product"
                />
              </div>
            )}
            <div
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '40px',
              }}
              className="bottom-mobile-content"
            >
              <div>
                <div
                  style={{
                    marginTop: '20px',
                    gap: '10px',
                    marginBottom: '20px',
                  }}
                  className="desktop-hiding-images"
                >
                  <ImageSelector
                    images={product?.images}
                    title={product?.title}
                    handleImage={handleImageIndex}
                  />
                </div>
                <h1 style={{ textDecoration: 'underline', fontSize: '20px' }}>
                  {product.title}
                </h1>
                <h3 style={{ fontSize: '20px', paddingTop: '15px' }}>
                  ${product.variants && product.variants[0].price.amount}
                </h3>
                <h3
                  style={{ fontSize: '20px', paddingTop: '15px' }}
                  className="shipping-calculated-text"
                >
                  Shipping Calculated at checkout
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '20px',
                    paddingTop: '15px',
                  }}
                >
                  Size:
                  {product.variants &&
                    product.variants.map((variant, item) => {
                      return (
                        <div
                          key={variant.title + item}
                          onClick={(e) => {
                            setSize(variant.id.toString());
                            setClicked(item);
                            setAvailable(variant.available);
                            setSizeSelected(true);
                          }}
                          style={{
                            paddingLeft: '40px',
                            cursor: 'pointer',
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

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '20px',
                    paddingTop: '15px',
                  }}
                >
                  Quantity:
                  <div
                    className="prodQuantity-container"
                    style={{ paddingLeft: '20px' }}
                  >
                    {quantity > 1 ? (
                      <button
                        className="prodQuantity-update"
                        onClick={() => setQuantity(quantity - 1)}
                      >
                        -
                      </button>
                    ) : (
                      <button className="prodQuantity-update">-</button>
                    )}
                    <span className="prodQuantity" style={{ color: 'black' }}>
                      {quantity}
                    </span>
                    <button
                      className="prodQuantity-update"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '20px',
                    listStyleType: 'none',
                    paddingTop: '20px',
                  }}
                >
                  {description &&
                    description.map((each, i) => {
                      return <li key={`line-description +${i}`}>{each}</li>;
                    })}
                </div>
                {sizeSelected && available ? (
                  <button
                    style={{
                      width: '200px',
                      marginTop: '15px',
                      fontSize: '20px',
                    }}
                    className="add-to-cart-button button-mobile"
                    onClick={() => changeSize(size, quantity)}
                  >
                    Add to cart
                  </button>
                ) : (
                  <button
                    style={{
                      width: '200px',
                      marginTop: '15px',
                      fontSize: '20px',
                      border: 'none',
                    }}
                    className="add-to-cart-outofstock button-mobile"
                  >
                    {sizeSelected ? 'Out of Stock' : 'Select a Size'}
                  </button>
                )}
                <div
                  style={{ marginTop: '20px', gap: '10px' }}
                  className="mobile-hiding-heloeleleoeoe"
                >
                  <ImageSelector
                    images={product?.images}
                    title={product?.title}
                    handleImage={handleImageClickScroll}
                  />
                </div>
                <h3
                  style={{ fontSize: '20px', paddingTop: '20px' }}
                  className="mobile-hiding"
                >
                  Design by SD Music Group 2024
                </h3>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function ImageSelector({ images, title, handleImage }) {
  return (
    <>
      {images &&
        images.map((image, i) => {
          return (
            <img
              key={image.id + i}
              src={image.src}
              alt={`${title} product shot`}
              style={{ width: '60px', cursor: 'pointer' }}
              onClick={() => handleImage(i)}
              className="product-image-hover"
            />
          );
        })}
    </>
  );
}
