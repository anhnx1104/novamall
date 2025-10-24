import { memo, useRef } from "react";
import { toast } from "react-toastify";
import { postData } from "~/lib/clientFunctions";
import classes from "./newsletter.module.css";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

const Newsletter = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await postData("/api/subscribers/new", data);
      response.success
        ? toast.success("성공적으로 제출되었습니다.")
        : toast.error("문제가 발생했습니다.");
      reset();
    } catch (err) {
      console.log(err);
      toast.error("문제가 발생했습니다.");
    }
  };

  return (
    <div className={classes.content}>
      <div className={classes.content_container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className={classes.custom_input}
            type="text"
            name="username"
            placeholder={t("이름 *")}
            required
            {...register("username", { required: true })}
          />
          <input
            className={classes.custom_input}
            type="email"
            name="email"
            placeholder={t("이메일 *")}
            required
            {...register("email", { required: true })}
          />
          <input
            className={classes.custom_input}
            type="number"
            name="phone"
            placeholder={t("전화번호 *")}
            required
            {...register("phone", { required: true })}
          />
          <textarea
            className={classes.custom_input}
            name="message"
            placeholder={t("메세지를 작성해주세요...")}
            required
            rows="4"
            {...register("message", { required: true })}
          />
          <button className={classes.button} type="submit">
            {t("보내기")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(Newsletter);
