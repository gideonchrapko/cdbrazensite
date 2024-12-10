import React, { useEffect, useState, useRef } from 'react';
import { useShopify } from '../hooks';
import { Row, Col, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { motion } from 'framer-motion';
import { useCheckCompleteSoldOut } from '../hooks/use-complete-sold-out';

const ImageDots = ({ images, currentIndex }) => {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
    >
      {images.map((_, index) => (
        <div
          key={index}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: index === currentIndex ? 'black' : '#d3d3d3',
            margin: '0 4px',
          }}
        />
      ))}
    </div>
  );
};

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
  const variants = product?.variants;
  const completelySoldOut = useCheckCompleteSoldOut(variants);

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
  // Swipe handlers
  const handleSwipeLeft = () => {
    if (product?.images) {
      setImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const handleSwipeRight = () => {
    if (product?.images) {
      setImageIndex((prevIndex) =>
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

  const handleImageIndex = (index) => {
    setImageIndex(index);
  };

  // Use swipeable hook for gesture detection
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Container fluid>
      <Row style={{ fontFamily: 'lucon' }}>
        <Col
          sm={{ span: 12 }}
          md={{ span: 7 }}
          style={{ height: '100vh', padding: '100px', overflow: 'scroll' }}
          ref={imagesContainerRef}
          className="mobile-hiding"
        >
          {product?.images &&
            product.images.map((image, i) => (
              <motion.img
                key={image.id}
                src={image.src}
                alt={`${product?.title} product shot`}
                transition={{ duration: 0.5 }}
              />
            ))}
        </Col>
        <Col style={{ height: '100vh', position: 'relative' }}>
          <div className="product-details-container">
            {product?.images && (
              <div {...swipeHandlers}>
                <div
                  className="desktop-hiding-images"
                  style={{ flexDirection: 'column', position: 'relative' }} // Ensure relative positioning for child elements
                >
                  <motion.img
                    src={product.images[imageIndex].src}
                    style={{
                      height: '100%',
                      overflow: 'scroll',
                      marginTop: '40px',
                      zIndex: 0, // Ensure it's below the motion images
                    }}
                    alt="product"
                    animate={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                  <ImageDots
                    images={product.images}
                    currentIndex={imageIndex}
                  />
                </div>
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
                <h3 className="details-font">
                  {product.title}
                  <span style={{ color: 'red' }}>
                    {completelySoldOut && ' - Sold Out'}
                  </span>
                </h3>
                <h3 className="details-font">
                  ${product.variants && product.variants[0].price.amount}0
                </h3>
                <h3 className="shipping-calculated-text details-font">
                  Shipping Calculated at checkout
                </h3>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  className="details-font"
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
                  }}
                  className="details-font"
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
                    listStyleType: 'none',
                  }}
                  className="details-font"
                >
                  {description &&
                    description.map((each, i) => {
                      return <li key={`line-description +${i}`}>{each}</li>;
                    })}
                </div>
                {sizeSelected && available ? (
                  <button
                    style={{
                      width: '100%',
                      maxWidth: '300px',
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
                      width: '100%',
                      maxWidth: '300px',
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
