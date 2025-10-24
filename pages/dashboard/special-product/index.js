import { PencilSquare, Trash, Files } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, deleteData, fetchData, updateData } from "~/lib/clientFunctions";
import { formatNumberWithCommaAndFloor } from "~/utils/number";
import { Button, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const ImageLoader = dynamic(() => import("~/components/Image"));
const Link = dynamic(() => import("next/link"));

const ProductList = () => {
  const url = `/api/product`;
  const { data, error, mutate } = useSWR(url, fetchData);
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    if (data && data.product) {
      setProductList(data.product);
    }
  }, [data]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const { t } = useTranslation();

  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "product"));
  }, [session]);

  const openModal = (id) => {
    setSelectedProduct(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteProduct = async () => {
    setIsOpen(false);
    await deleteData(`/api/product/delete/${selectedProduct}`)
      .then((data) =>
        data.success
          ? (toast.success("상품이 성공적으로 삭제되었습니다."), mutate())
          : toast.error("문제가 발생했습니다.")
      )
      .catch((err) => {
        console.log(err);
        toast.error("문제가 발생했습니다.");
      });
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = productList
    .filter((item) => item.isSpecial)
    .filter(
      (item) =>
        item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
    );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e)}
        onClear={handleClear}
        filterText={filterText}
        isSpecialProduct={"special-product"}
      />
    );
  }, [filterText, resetPaginationToggle]);

  async function cloneDoc(id) {
    try {
      const resp = await updateData("/api/product", { id });
      resp.success
        ? (toast.success(resp.message), mutate())
        : toast.error(resp.message);
    } catch (err) {
      console.log(err.message);
    }
  }
  const [selectedRows, setSelectedRows] = useState([]);
  const allChecked =
    selectedRows.length === data?.product?.length && data?.product?.length > 0;
  const someChecked =
    selectedRows.length > 0 && selectedRows.length < data?.product?.length;

  const handleSelectAll = (checked) => {
    if (checked) setSelectedRows(data?.product?.map((item) => item._id));
    else setSelectedRows([]);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const columns = [
    {
      name: (
        <Checkbox
          indeterminate={someChecked}
          checked={allChecked}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      cell: (row) => (
        <Checkbox
          checked={selectedRows.includes(row._id)}
          onChange={() => handleSelectRow(row._id)}
        />
      ),
      width: "70px",
      sortable: false,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "상품 코드",
      selector: (row) => row?.productId,
      sortable: true,
      cell: (row) => "k2139ds123",
    },
    {
      name: "대표 이미지",
      selector: (row) => (
        <ImageLoader
          src={row?.image[0]?.url}
          alt={data.name}
          width={80}
          height={80}
        />
      ),
      cell: (row) => "이미지",
    },
    {
      name: "이름",
      selector: (row) => row?.name,
      sortable: true,
      cell: (row) => "상품 이름",
    },
    {
      name: "상품군",
      selector: (row) => row?.category,
      cell: (row) => "의류",
    },

    {
      name: "공급가",
      selector: (row) => `${row?.supplyPrice?.toLocaleString()}원`,
      right: true,
      cell: (row) => "10,000원",
    },

    {
      name: "판매가",
      selector: (row) => `${row?.salePrice?.toLocaleString()}원`,
      right: true,
      cell: (row) => "15,000원",
    },

    {
      name: "재고",
      selector: (row) => row?.stock,
      right: true,
      cell: (row) => "999",
    },

    {
      name: "배송비",
      selector: (row) => `${row?.shippingFee?.toLocaleString()}원`,
      right: true,
      cell: (row) => "5,000원",
    },
    {
      name: "판매 상태",
      selector: (row) => row?.status,
      cell: (row) => "판매중",
    },
    {
      name: "액션",
      cell: (row) => (
        <Button onClick={() => openModal(true)}>숨기기 수정 </Button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "92px",
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <Typography variant="h4" fontWeight="bold" mb={4} align="left">
            특별 상품 목록
          </Typography>
          <div className={classes.container}>
            <DataTable
              columns={columns}
              data={productList}
              keyField="_id"
              pagination
              paginationResetDefaultPage={resetPaginationToggle}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              customStyles={customStyles}
            />
            <GlobalModal
              isOpen={isOpen}
              handleCloseModal={closeModal}
              small={true}
            >
              <div
                style={{
                  borderRadius: "12px",
                  padding: "24px",
                  textAlign: "left",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                  동기화
                </h3>
                <p
                  style={{
                    color: "#555",
                    marginTop: "8px",
                    marginBottom: "20px",
                  }}
                >
                  도매몰의 상품과 동기화 하시겠습니까?
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    paddingRight: "8px",
                  }}
                >
                  <Button
                    onClick={() => deleteProduct()}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#f44336",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    확인
                  </Button>
                  <Button
                    onClick={() => closeModal()}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      background: "#fff",
                      color: "#333",
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    취소
                  </Button>
                </div>
              </div>
            </GlobalModal>
          </div>
        </div>
      )}
    </>
  );
};

ProductList.requireAuthAdmin = true;
ProductList.dashboard = true;

export default ProductList;
