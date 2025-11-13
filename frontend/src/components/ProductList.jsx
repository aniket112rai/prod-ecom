import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard  key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
