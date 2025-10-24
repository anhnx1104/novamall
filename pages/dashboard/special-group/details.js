import dynamic from "next/dynamic";
const SpecialGroupDetails = dynamic(() =>
  import("~/components/ProductForm/SpecialGroupDetails")
);

const NewProduct = () => {
  return <SpecialGroupDetails />;
};

NewProduct.requireAuthAdmin = true;
NewProduct.dashboard = true;

export default NewProduct;
