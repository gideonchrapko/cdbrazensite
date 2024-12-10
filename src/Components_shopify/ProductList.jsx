import { useShopify } from '../hooks';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCheckCompleteSoldOut } from '../hooks/use-complete-sold-out';

export default function ProductList() {
  const { products } = useShopify();

  return (
    <Container
      fluid
      style={{
        zIndex: '10',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      <Row>
        {products &&
          products.map((product, i) => {
            return <SingleProduct i={i} key={i} product={product} />;
          })}
      </Row>
    </Container>
  );
}

function SingleProduct(props) {
  const { product } = props;
  const navigate = useNavigate();
  const completelySoldOut = useCheckCompleteSoldOut(product.variants);

  const handleRoute = () => {
    navigate(`/product/${product?.handle}`);
  };

  return (
    <Col
      lg={{
        span: 4,
        offset: 4,
      }}
      xs={{ span: 12, offset: 0 }}
      key={product.id}
      style={{ marginBottom: '5vh', marginTop: '5vh' }}
    >
      <div
        className="images-product-bind"
        onClick={() => handleRoute()}
        style={{ cursor: 'pointer' }}
      >
        <img src={product.images[0].src} className="img-drag" alt="product" />
      </div>

      <div
        style={{
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1 className="product-new-title">{product.title}</h1>
        <span className="product-new-title" style={{ color: 'red' }}>
          {completelySoldOut && 'Sold Out'}
        </span>
      </div>
    </Col>
  );
}
