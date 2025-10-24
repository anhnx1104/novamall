import { toast } from "react-toastify";
import { addToCart, addVariableProductToCart } from "~/redux/cart.slice";
import customId from "custom-id-new";

export const _simpleProductCart =
  (data, cartData, price, dispatch) => (qty) => {
    const { _id, name, image, quantity, vat, tax } = data.product;
    const existed = cartData.items.find((item) => item._id === _id);
    const totalQty = existed ? existed.qty + qty : qty;
    if (quantity === -1 || quantity >= totalQty) {
      const cartItem = {
        _id,
        uid: customId({ randomLength: 6 }),
        name,
        image,
        price: Number(price),
        qty,
        quantity,
        isSpecial: data.product.isSpecial,
        color: { name: null, value: null },
        attribute: { name: null, value: null, for: null },
        vat: vat || 0,
        tax: tax || 0,
        selected: true,
      };
      dispatch(addToCart(cartItem));
      toast.success("장바구니에 추가되었습니다.");
    } else {
      toast.error("이 항목은 재고가 부족합니다!");
    }
  };

export const _variableProductCart =
  (
    data,
    selectedColor,
    selectedAttribute,
    cartData,
    checkVariantInfo,
    checkQty,
    price,
    dispatch
  ) =>
  (qty) => {
    try {
      const { _id, name, image, colors, attributes, vat, tax } = data.product;
      if (colors.length && !selectedColor.name) {
        toast.warning("색상을 선택해주세요!");
      } else if (attributes.length && !selectedAttribute.name) {
        toast.warning(`${attributes[0]?.for}을(를) 선택해주세요!`);
      } else {
        const existedProduct = cartData.items.find(
          (item) =>
            item._id === _id &&
            item.color.name == selectedColor.name &&
            item.attribute.name == selectedAttribute.name
        );
        const existedQty = existedProduct ? existedProduct.qty : 0;
        const variantData = checkVariantInfo(
          selectedColor.name,
          selectedAttribute.name
        );
        const qtyAvailable =
          variantData && checkQty(existedQty, qty, variantData.qty);
        if (qtyAvailable) {
          const cartItem = {
            _id,
            uid: customId({ randomLength: 6 }),
            name,
            image,
            price: Number(price),
            qty,
            quantity: Number(variantData.qty),
            sku: variantData.sku,
            color: selectedColor.name
              ? { name: selectedColor.name, value: selectedColor.value }
              : { name: null, value: null },
            attribute: selectedAttribute.name
              ? {
                  name: selectedAttribute.name,
                  value: selectedAttribute.value,
                  for: attributes[0]?.for,
                }
              : { name: null, value: null, for: null },
            vat: vat || 0,
            tax: tax || 0,
            selected: true,
          };
          dispatch(addVariableProductToCart(cartItem));
          toast.success("장바구니에 추가되었습니다.");
        } else {
          toast.error("이 항목은 재고가 부족합니다!");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("문제가 발생했습니다.");
    }
  };
