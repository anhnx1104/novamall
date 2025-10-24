import dynamic from "next/dynamic";
const ProductFormCreate = dynamic(() =>
  import("~/components/ProductForm/productFormCreate")
);

const NewProduct = () => {
  return <ProductFormCreate />;
};

NewProduct.requireAuthAdmin = true;
NewProduct.dashboard = true;

export default NewProduct;
