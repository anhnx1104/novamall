import CartPage from "~/components/Cart";
import HeadData from "~/components/Head";

const Cart = () => {
  return (
    <>
      <HeadData title="Cart" />
      <CartPage />
    </>
  );
};

export default Cart;
Cart.headerBack = true;
Cart.headerBackText = "장바구니";
Cart.footer = false;
