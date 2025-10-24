import { ArrowLeft } from "@styled-icons/bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import classes from "~/components/tableFilter/table.module.css";
import useSWR from "swr";
import {
  deleteData,
  postData,
  fetchData,
  updateData,
} from "~/lib/clientFunctions";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditSpecialGroup = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data, error, mutate } = useSWR(`/api/group?id=${slug}`, fetchData);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await updateData(`/api/group/edit?id=${slug}`, {
        ...data,
      });
      response.success
        ? (toast.success("You Have Update Group Successfully"), mutate())
        : toast.error("문제가 발생했습니다.");
      reset();

      router.push(`/dashboard/special-group/${slug}`);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (data && data.data) {
      setValue("name", data.data.name);
      setValue("price", data.data.price);
      setValue("user_limit", data.data.user_limit);
    }
  }, [slug, data]);

  if (!watch("name")) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container-fluid px-4">
      {/* Header with back button and group name */}
      <div className="d-flex align-items-center my-3">
        <Link href={`/dashboard/special-group/${slug}`}>
          <button className="btn bg-transparent border-0 p-0 me-2">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h4 className="mb-0">그룹 수정</h4>
      </div>

      <div
        className={classes.container}
        style={{ padding: "15px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h5 className="mb-4 fw-bold">그룹 정보 수정</h5>

          <div className="mb-4">
            <label htmlFor="groupName" className="form-label text-secondary">
              그룹명
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              required
              {...register("name", { required: true })}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="groupPrice" className="form-label text-secondary">
              그룹 가격
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id="price"
                name="price"
                required
                {...register("price", { required: true })}
              />
              <span className="input-group-text">원</span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="memberCount" className="form-label text-secondary">
              유저 한도 수
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id="user_limit"
                name="user_limit"
                required
                {...register("user_limit", { required: true })}
              />
              <span className="input-group-text">명</span>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="usageCount" className="form-label text-secondary">
              등록된 상품 수
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                id="usageCount"
                disabled
                defaultValue={watch("productCount") || 0}
              />
              <span className="input-group-text">개</span>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-2 mt-5">
            <button
              type="submit"
              className="btn btn-primary px-4"
              style={{
                background: "var(--primary)",
                borderColor: "var(--primary)",
              }}
            >
              저장하기
            </button>
            <Link href={`/dashboard/special-group/${slug}`}>
              <button type="button" className="btn btn-outline-secondary px-4">
                취소
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

EditSpecialGroup.requireAuthAdmin = true;
EditSpecialGroup.dashboard = true;

export default EditSpecialGroup;
