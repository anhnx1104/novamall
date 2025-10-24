import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { deleteData, fetchData } from "~/lib/clientFunctions";
import { updateWishlist } from "~/redux/cart.slice";
import Spinner from "../../components/Ui/Spinner";
import c from "./vouchers.module.css";
import ImageLoader from "../Image";
import classes from "../Ui/Modal/modal.module.css";
import Modal from "react-modal";

const ManageVouchersList = (props) => {
  const router = useRouter();
  const url = `/api/profile?id=${props.id}&scope=favorite`;
  const specialUrl = `/api/profile/myspecial?id=${props.id}`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const { data: specialData } = useSWR(props.id ? specialUrl : null, fetchData);
  const productSpecial = useMemo(() => {
    if (specialData && specialData.data) {
      return specialData.data.find(
        (item) =>
          ((item.totalShoppingPoints + item.totalWithdrawablePoints) /
            item?.product?.pointLimit) *
            100 >
          10
      );
    }
    return undefined;
  }, [specialData]);

  const [wishlist, setWishlist] = useState([1, 2]);
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (productSpecial) {
      setIsOpen(true);
    }
  }, [productSpecial]);

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div className="row">
          {wishlist.length === 0 && (
            <p className="text-center p-3">You have no items on your voucher</p>
          )}
          {wishlist.length > 0 && (
            <h3
              style={{
                fontWeight: "600",
                fontSize: "28px",
                marginBottom: "40px",
              }}
            >
              내 상품권
            </h3>
          )}
          {[1, 2, 3, 4, 5, 6, 7].map((item, idx) => (
            <div className={c.itemWishlist} key={item._id + idx}>
              <div className={c.left}>
                <div className={c.productImage}>
                  <ImageLoader
                    src={`${process.env.NEXT_PUBLIC_URL}/images/voucher1.png`}
                    alt={"title"}
                    width={96}
                    height={96}
                  />
                </div>
                <div className={c.productDetails}>
                  <h5>문화상품권 5,000원</h5>
                  <p>개수 : 1</p>
                  <p>유효기간 : 유효기간 없음</p>
                </div>
              </div>
              <div className={c.right}>
                <button className="button_primary">자세히보기</button>
              </div>
            </div>
          ))}
          {/* <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
            closeTimeoutMS={400}
            className={`${classes.content_small} ${c.modalContent}`}
            overlayClassName={classes.overlay}
          >
            <div className={`${classes.body} ${c.modalBody}`}>
              <div className={c.voucherImage}></div>
              <h3 className={c.voucherTitle}>
                {((productSpecial?.totalShoppingPoints +
                  productSpecial?.totalWithdrawablePoints) /
                  productSpecial?.product?.pointLimit) *
                  100}
                % 달성
              </h3>
              <p className={c.voucherDescription}>
                {productSpecial?.product?.name}
              </p>
              <button
                className="button_primary"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/profile/points`);
                }}
              >
                자세히보기
              </button>
              <button className={c.closeModal} onClick={() => setIsOpen(false)}>
                괜찮습니다.
              </button>
            </div>
          </Modal> */}
        </div>
      )}
    </>
  );
};

export default ManageVouchersList;
