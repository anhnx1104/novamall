import React, { useState, useEffect } from "react";
import { ThreeDots, Eye, Trash } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import classes from "~/components/tableFilter/table.module.css";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import { deleteData, fetchData } from "~/lib/clientFunctions";
import { formatNumberWithCommaAndFloor } from "~/utils/number";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));

const ProductManagement = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ id: "", name: "" });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  const fetchProducts = async () => {
    try {
      const res = await fetchData(`/api/group/product/list?groupId=${slug}`);
      if (res.success) {
        setProducts(res.data);
      } else {
        setProducts([]);
        toast.error("상품 목록을 불러오는 중 오류가 발생했습니다.");
      }
    } catch (err) {
      toast.error("상품 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const openDeleteModal = (id, name) => {
    setSelectedProduct({ id, name });
    setIsDeleteModalOpen(true);
    setActiveDropdown(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteProduct = async () => {
    // In a real app, this would call an API endpoint to delete the product
    try {
      // Call API to delete product
      const res = await deleteData(
        `/api/product/special?id=${selectedProduct.id}`
      );
      if (res.success) {
        toast.success("상품이 삭제되었습니다.");
        fetchProducts(); // Refresh the product list after deletion
      } else {
        toast.error("상품 삭제에 실패했습니다.");
      }
    } catch (error) {
      toast.error("상품 삭제에 실패했습니다.");
    }
    // For now, just close the modal
    setIsDeleteModalOpen(false);
  };

  const handleAddProduct = () => {
    router.push(`/dashboard/product/create?group=${slug}`);
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h5 className="fw-bold mb-0">상품 목록</h5>
        <button
          className="btn btn-dark"
          style={{
            background: "var(--primary)",
            borderColor: "var(--primary)",
          }}
          onClick={handleAddProduct}
        >
          상품 추가
        </button>
      </div>

      <div className="table-responsive" style={{ overflowX: "auto" }}>
        <table
          className="table"
          style={{ fontSize: "14px", minWidth: "900px" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa", fontWeight: "600" }}>
              <th
                className="ps-3 py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                이미지
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                상품명
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                가격
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                리베이트 비율
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                구매 인원수
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                상위 유저 한도
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                상위 유저 수
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                진행 완료수
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                진행 대기수
              </th>
              <th
                className="py-3"
                style={{
                  borderTop: "1px solid #dee2e6",
                  borderBottom: "1px solid #dee2e6",
                  whiteSpace: "nowrap",
                }}
              >
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="align-middle"
                style={{ height: "70px", borderBottom: "1px solid #dee2e6" }}
              >
                <td className="ps-3">
                  <div
                    className="bg-light d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "4px",
                    }}
                  >
                    <span style={{ fontSize: "10px", color: "#999" }}>
                      <img
                        src={product.image[0].url}
                        alt="이미지"
                        width="40"
                        height="40"
                      />
                    </span>
                  </div>
                </td>
                <td style={{ fontWeight: "500" }}>{product.name}</td>
                <td>{formatNumberWithCommaAndFloor(product.price)}</td>
                <td>{product.rebateRate}%</td>
                <td>
                  {product.productOrderCount}({product.productOrderUserCount})
                </td>
                <td>{product.group.user_limit}</td>
                <td>{product.groupRankingUserProgressCount}</td>
                <td>{product.groupRankingUserDoneCount}</td>
                <td>{product.groupRankingUserWaitingCount}</td>
                <td>
                  <div className="position-relative dropdown-container">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleDropdown(product._id)}
                    >
                      <ThreeDots width={18} height={18} title="조회 옵션" />
                    </div>

                    {activeDropdown === product._id && (
                      <div
                        className="position-fixed bg-white shadow rounded py-1 px-2"
                        style={{
                          right: "2%",
                          zIndex: 10,
                          minWidth: "100px",
                          border: "1px solid #dee2e6",
                        }}
                      >
                        <Link href={`/dashboard/product/${product.slug}`}>
                          <div
                            className="d-flex align-items-center py-1 px-2"
                            style={{ cursor: "pointer" }}
                          >
                            <Eye width={16} height={16} className="me-2" />
                            <span>보기</span>
                          </div>
                        </Link>
                        <div
                          className="d-flex align-items-center py-1 px-2 text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            openDeleteModal(product._id, product.name)
                          }
                        >
                          <Trash width={16} height={16} className="me-2" />
                          <span>삭제</span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Product Modal using GlobalModal */}
      <GlobalModal
        isOpen={isDeleteModalOpen}
        handleCloseModal={closeDeleteModal}
        small={true}
      >
        <div className="text-center p-4 position-relative">
          <div className="mt-4">
            <h5 className="mb-3 fw-normal" style={{ fontSize: "18px" }}>
              &ldquo;{selectedProduct.name}&rdquo;을 삭제 하시겠습니까?
            </h5>
            <p className="text-muted mb-4" style={{ fontSize: "14px" }}>
              삭제 시 해당 상품에 대한 모든 데이터가 삭제됩니다.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button
                className="btn px-4 py-2"
                onClick={closeDeleteModal}
                style={{
                  background: "#222",
                  color: "white",
                  borderRadius: "4px",
                  width: "90px",
                }}
              >
                취소
              </button>
              <button
                className="btn px-4 py-2"
                onClick={deleteProduct}
                style={{
                  background: "#dc3545",
                  color: "white",
                  borderRadius: "4px",
                  width: "90px",
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

export default ProductManagement;
