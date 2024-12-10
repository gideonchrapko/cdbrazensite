import React from 'react';

import '../Styles/Home.css';
import ProductList from '../Components_shopify/ProductList';

const Home = () => {
  return (
    <div style={{ overflow: 'scroll' }}>
      <div>
        <ProductList />
      </div>
    </div>
  );
};

export default Home;
