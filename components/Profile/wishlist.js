import { Trash3 } from "@styled-icons/bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { deleteData, fetchData, formatNumber } from "~/lib/clientFunctions";
import { updateWishlist } from "~/redux/cart.slice";
import GlobalModal from "../../components/Ui/Modal/modal";
import Spinner from "../../components/Ui/Spinner";
import Product from "../Shop/Product/product";
import ProductDetails from "../Shop/Product/productDetails";
import c from "./wishlist.module.css";
import ImageLoader from "../Image";
import { X } from "@styled-icons/bootstrap";
import PaginationCustom from "../PaginationCustom";
import { DeleteIcon, TruckShippingIcon } from "../Ui/Icons/icons";

const ManageWishList = (props) => {
  const url = `/api/profile?id=${props.id}&scope=favorite`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const [wishlist, setWishlist] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { wishlist: wishlistState } = useSelector((state) => state.cart);
  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data.user) {
      setWishlist(data.user.favorite);
    }
  }, [data]);

  const handleCloseModal = () => {
    router.push("/profile", undefined, { shallow: true });
    setIsOpen(false);
  };

  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  function updateWishlistCount() {
    const __data = wishlistState && wishlistState > 0 ? wishlistState - 1 : 0;
    dispatch(updateWishlist(__data));
  }

  const removeFromWishlist = async (pid) => {
    try {
      const data = {
        pid,
        id: session.user.id,
      };
      const response = await deleteData(`/api/wishlist`, data);
      response.success
        ? (toast.success("위시리스트에서 항목이 삭제되었습니다."),
          mutate(),
          updateWishlistCount())
        : toast.error("문제가 발생했습니다.");
    } catch (err) {
      toast.error(`오류: ${err.message}`);
    }
  };
  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          {wishlist.length === 0 && (
            <p className="text-center p-3">위시리스트에 항목이 없습니다.</p>
          )}
          {wishlist.length > 0 && (
            <div className={c.titleContainer}>
              <h3 className={c.wishlistTitle}>
                찜한 상품{" "}
                <span style={{ paddingLeft: "4px" }}>{wishlist.length}</span>
              </h3>
              <button className={c.deleteAllButton} onClick={() => {}}>
                전체 삭제
              </button>
            </div>
          )}
          <div className={c.wishlistContainer}>
            {Array.from({ length: 5 }).map((item, idx) => (
              <div className={c.itemWishlist} key={item + idx}>
                <div className={c.left}>
                  <div className={c.productImage}>
                    <img
                      src={"/images/product_ex.png"}
                      alt={"title"}
                      width={97}
                      height={97}
                    />
                  </div>
                  <div className={c.info}>
                    <p className={c.title}>
                      MLB 뉴욕양키스 볼캡 모자 32CPHL111-50L
                    </p>
                    <div className={c.priceBox}>
                      <p className={c.oldPrice}>110,002원</p>
                      <p className={c.discount}>
                        25%
                        <span className={c.newPrice}>89,002원</span>
                      </p>
                      <p className={c.truck}>
                        <TruckShippingIcon />
                        <span>무료배송</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className={c.right}>
                  <button
                    className={c.deleteButton}
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className={c.paginationMobile}>10개 더보기</div>

          <div className={c.pagination}>
            <PaginationCustom />
          </div>
        </div>
      )}
      <GlobalModal
        small={false}
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
      >
        {router.query.slug && (
          <ProductDetails productSlug={router.query.slug} />
        )}
      </GlobalModal>
    </>
  );
};

export default ManageWishList;
