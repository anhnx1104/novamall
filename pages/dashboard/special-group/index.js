import { Trash, ThreeDots, Eye } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import classes from "~/components/tableFilter/table.module.css";
import { deleteData, postData, fetchData } from "~/lib/clientFunctions";
import Link from "next/link";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import { formatNumberWithCommaAndFloor } from "~/utils/number";
import {
  Box,
  InputAdornment,
  Button,
  TextField
} from "@mui/material"
import { Iconify } from "~/components/iconify";
import { Switch } from "@mui/material";
const DataTable = dynamic(() => import("react-data-table-component"));
const DeleteGroupDialog = dynamic(() => import("~/components/Dialog"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));

const SpecialGroupList = () => {
  const [groupList, setGroupList] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { t } = useTranslation();
  const [active, setActive] = useState("전체");

  const filters = ["전체", "노출", "비노출"];

  const { data, error, mutate } = useSWR("/api/group", fetchData);
  const [searchQuery, setSearchQuery] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const openModal = (id, name) => {
    setSelectedGroup(id);
    setSelectedGroupName(name);
    setIsOpen(true);
    setActiveDropdown(null);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
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

  const deleteGroup = async () => {
    try {
      const response = await deleteData("/api/group/delete", {
        id: selectedGroup,
      });
      response.success
        ? (toast.success("성공적으로 삭제되었습니다."), mutate())
        : toast.error("문제가 발생했습니다.");
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

  const filteredItems = groupList
    ? groupList?.filter(
      (item) =>
        item.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())
    )
    : [];

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      const response = await postData("/api/group/create", {
        ...data,
        user_limit: +data.user_limit,
        price: +data.price,
      });
      response.success
        ? (toast.success("그룹이 성공적으로 생성되었습니다."), mutate())
        : toast.error("문제가 발생했습니다.");
      setIsCreateModalOpen(false);
      reset();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (data && data.data) {
      setGroupList(data.data);
    }
  }, [data]);

  const subHeaderComponentMemo = React.useMemo(() => {

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {filters.map((label, index) => (
            <Box key={label} sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() => setActive(label)}
                sx={{
                  minWidth: "auto",
                  p: 0,
                  textTransform: "none",
                  color: active === label ? "#1976d2" : "#333",
                  fontWeight: active === label ? 600 : 400,
                  background: "none",
                  border: "none",
                  "&:hover": {
                    background: "transparent",
                    color: "#1976d2",
                  },
                }}
              >
                {label}
              </Button>
              {index < filters.length - 1 && (
                <Box component="span" sx={{ mx: 1, color: "#999" }}>
                  |
                </Box>
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
          <TextField
            placeholder="상품명 or 코드 입력"
            variant="outlined"
            size="small"
            value={searchQuery}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}

            onChange={(e) => setSearchQuery(e.target.value)}

            sx={{ width: 250 }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#666",
              "&:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            검색
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={openCreateModal}
          sx={{
            backgroundColor: "var(--primary)",
            borderColor: "var(--primary)",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#145bb2",
            },
          }}
        >
          + 새 그룹 생성
        </Button>
      </Box>

    );
  }, [active]);

  const columns = [
    {
      name: "그룹 명",
      cell: (row) => (
        "새로운 그룹"
      ),
      sortable: false,
    },
    {
      name: "가격",
      selector: (row) => row?.productId,
      sortable: true,
      cell: (row) => (
        "100,000원"
      ),
    },
    {
      name: "상품 수",
      selector: (row) => (
        "5개"
      ),
      cell: (row) => (
        "5개"
      ),
    },
    {
      name: "상위 유저 수",
      selector: (row) => row?.name,
      sortable: true,
      cell: (row) => (
        "5명"
      ),
    },


    {
      name: "최대 적립 한도",
      selector: (row) => row?.category,
      cell: (row) => (
        "최대 적립 한도"
      ),
    },
    {
      name: "배분 비율",
      selector: (row) => `${row?.supplyPrice?.toLocaleString()}원`,
      right: true,
      cell: (row) => (
        "10,40% / 60%"
      ),
    },
    {
      name: "구매자 수",
      selector: (row) => `${row?.salePrice?.toLocaleString()}원`,
      right: true,
      cell: (row) => (
        "1,000명"
      ),
    },
    {
      name: "판매 수량",
      selector: (row) => row?.stock,
      right: true,
      cell: (row) => (
        "1,0000개"
      ),
    },
    {
      name: "액션",
      selector: (row) => `${row?.shippingFee?.toLocaleString()}원`,
      center: true,
      cell: (row) => (
        <Box sx={{ cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 1 }}>
          <span onClick={() => openModal(true)}>삭제 </span>
          <span>수정 </span>
        </Box>
      ),
    },
    {
      name: "노출",
      selector: (row) => row?._id,
      center: true,

      cell: (row) => (
        <Switch
          onChange={(e) => {
            const newStatus = e.target.checked ? "판매중" : "숨김";
            console.log("Toggle:", newStatus, "for row:", row);
          }}
          color="primary"
        />
      ),

    },

  ];
  const customStyles = {
    table: {
      style: {
        minWidth: "100%",
      },
    },
    rows: {
      style: {
        minHeight: "60px",
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "bold",
        padding: "8px",
      },
    },
    cells: {
      style: {
        padding: "8px",
      },
    },
  };

  return (
    <div className="container-fluid px-2 px-md-4">
      <h4 className="text-center pt-3 pb-4 pb-md-5">특별 그룹 목록</h4>
      <div className={classes.container}>
        <DataTable
          columns={columns}
          data={filteredItems}
          pagination
          paginationResetDefaultPage={resetPaginationToggle}
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          customStyles={customStyles}
          responsive
          noHeader
        />
        {/* <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
          <div className="text-center p-3 p-md-4 position-relative">
            <div className="mt-3 mt-md-4">
              <h5 className="mb-3 fw-normal" style={{ fontSize: "18px" }}>
                &ldquo;{selectedGroupName}&rdquo;을 삭제 하시겠습니까?
              </h5>
              <p
                className="text-muted mb-3 mb-md-4"
                style={{ fontSize: "14px" }}
              >
                삭제 시 그룹내의 모든 상품이 삭제됩니다.
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  className="btn px-3 px-md-4 py-2"
                  onClick={() => closeModal()}
                  style={{
                    background: "#222",
                    color: "white",
                    borderRadius: "4px",
                    width: "80px",
                    width: "90px",
                  }}
                >
                  취소
                </button>
                <button
                  className="btn px-3 px-md-4 py-2"
                  onClick={() => deleteGroup()}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    borderRadius: "4px",
                    width: "80px",
                    width: "90px",
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </GlobalModal> */}
        <DeleteGroupDialog
          open={isOpen}
          onClose={() => closeModal()}
          onConfirm={() => deleteGroup()}
          title="[그룹명]' 그룹을 정말 삭제하시겠습니까?"
          subs="이 그룹에 속한 모든 상품 정보가 함께 삭제되며, 이 작업은 복구할 수 없습니다"
        />
        {/* Create Group Modal */}
        <GlobalModal
          isOpen={isCreateModalOpen}
          handleCloseModal={closeCreateModal}
          small
          width="500px"

        >
          <div className="p-3 p-md-4">
            <h5 className="text-center fw-bold mb-3 mb-md-4">특별 그룹 생성</h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="groupName" className="form-label">
                  그룹명
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="텍스트 입력, 중복 불가"
                  id="groupName"
                  style={{
                    border: "1px solid #16316f",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                  required
                  {...register("name", { required: true })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="period" className="form-label">
                  가격
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  style={{
                    border: "1px solid #16316f",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                  placeholder="숫자 입력, 중복 가능"
                  required
                  {...register("price", { required: true })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="memberCount" className="form-label">
                  상위 유저 수
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="user_limit"
                  style={{
                    border: "1px solid #16316f",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                  name="user_limit"
                  placeholder="숫자 입력, 최소 1이상"
                  required
                  {...register("user_limit", { required: true })}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="memberCount" className="form-label">
                  포인트 적립 한도 금액 입력
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="user_limit"
                  style={{
                    border: "1px solid #16316f",
                    borderRadius: "4px",
                    padding: "8px 12px",
                  }}
                  name="user_limit"
                  placeholder="숫자 입력, 금액 기준"
                  required
                  {...register("user_1", { required: true })}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="pointRatio" className="form-label" >
                  포인트 지급 분배 비율 입력(합산 100%)
                </label>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  <input
                    type="number"
                    className="form-control"
                    id="withdraw_point"
                    name="withdraw_point"
                    placeholder="출금 가능 포인트"
                    style={{
                      border: "1px solid #000",
                      borderRadius: "2px",
                      padding: "6px 10px",
                      fontSize: "14px",
                    }}
                    {...register("withdraw_point", { required: true })}
                  />

                  <span style={{ fontWeight: 600, fontSize: "24px" }}>/</span>

                  <input
                    type="number"
                    className="form-control"
                    id="shopping_point"
                    name="shopping_point"
                    placeholder="쇼핑 포인트"
                    style={{
                      border: "1px solid #000",
                      borderRadius: "2px",
                      padding: "6px 10px",
                      fontSize: "14px",
                    }}
                    {...register("shopping_point", { required: true })}
                  />
                </div>
              </div>

              <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mt-3 mt-md-4 pt-2 pt-md-4">
                <button
                  type="button"
                  className="btn btn-outline w-100"
                  onClick={closeCreateModal}
                  style={{
                    borderRadius: "4px",
                    padding: "8px",
                    border: "1px solid #16316f",
                    color: "#16316f",
                  }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  style={{
                    borderRadius: "4px",
                    padding: "8px",
                    backgroundColor: "#27ae60",
                    border: "none",
                  }}
                >
                  생성
                </button>
              </div>
            </form>
          </div>
        </GlobalModal>
      </div>
    </div>
  );
};

SpecialGroupList.requireAuthAdmin = true;
SpecialGroupList.dashboard = true;

export default SpecialGroupList;
