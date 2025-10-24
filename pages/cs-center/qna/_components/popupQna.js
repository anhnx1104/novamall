import styles from "../qna.module.css";
import Popup from "~/components/Popup/popup";
import CheckboxCustom from "~/components/Ui/CheckboxCustom/checkboxCustom";
import ButtonCustom from "~/components/ButtonCustom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function PopupQna({ openQna, setOpenQna }) {
  const { t } = useTranslation();
  const [files, setFiles] = useState([
    "어쩌구저쩌구1",
    "어쩌구저쩌구2",
    "어쩌구저쩌구3",
    "어쩌구저쩌구4",
    "어쩌구저쩌구5",
  ]);
  const [isPrivate, setIsPrivate] = useState(true);
  const [isMail, setIsMail] = useState(true);

  // 파일 업로드 핸들러
  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length + files.length > 5) {
      alert("최대 5개의 파일만 업로드 가능합니다.");
      return;
    }

    setFiles((prevFiles) => [
      ...prevFiles,
      ...validFiles.map((file) => file.name),
    ]);
  };
  const handleFileSelect = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/jpg,image/gif,image/png";
    fileInput.multiple = true;
    fileInput.onchange = handleFileUpload;
    fileInput.click();
  };

  return (
    <Popup
      open={openQna}
      onClose={() => setOpenQna(false)}
      title={t("Q&A 작성하기")}
      content={
        <div className={styles.popupContainer}>
          <div className={styles.popupSection}>
            <p className={styles.popupSectionTitle}>{t("제목")}</p>
            <input
              placeholder={t("제목을 작성해주세요.")}
              className={styles.popupInput}
            />
          </div>
          <div className={styles.popupSection}>
            <p className={styles.popupSectionTitle}>{t("주문번호")}</p>
            <input
              placeholder={t(
                "입력 특정 상품에 대해 질문하실 경우 주문번호를 입력해주세요."
              )}
              className={styles.popupInput}
            />
          </div>

          {/* 파일 첨부 */}
          <div style={{}}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div>
                <div>
                  <label
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "var(--text-121212)",
                      marginBottom: "8px",
                    }}
                  >
                    파일 첨부
                  </label>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "var(--text-757575)",
                      marginBottom: "0",
                    }}
                  >
                    참고할 수 있는 사진이 있으면 등록해 주십시오.(jpg gif png
                    파일만 가능, 10MB이하)
                  </p>
                </div>
              </div>
              <ButtonCustom
                text={"파일 선택"}
                style={{
                  height: "30px",
                  width: "85px",
                  fontSize: "14px",
                }}
                onClick={handleFileSelect}
              />
            </div>

            {/* file tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                padding: "12px",
                background: "#F3F5F7",
              }}
            >
              {files.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    border: "1px solid var(--stroke-button)",
                    padding: "4px 8px",
                    fontSize: "11px",
                  }}
                >
                  <span style={{ marginRight: "6px" }}>{file}</span>
                  <button
                    style={{
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      padding: 0,
                      margin: 0,
                    }}
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                  >
                    {/* Icon X */}
                    <svg
                      width="8"
                      height="9"
                      viewBox="0 0 8 9"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.6 7.5L1 6.9L3.4 4.5L1 2.1L1.6 1.5L4 3.9L6.4 1.5L7 2.1L4.6 4.5L7 6.9L6.4 7.5L4 5.1L1.6 7.5Z"
                        fill="#121212"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.popupSection}></div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 0,
                fontSize: "14px",
              }}
            >
              {t("내용 입력")}
            </p>
            <p
              style={{
                marginBottom: 0,
                fontSize: "11px",
              }}
            >
              0 / 500
            </p>
          </div>
          <textarea
            placeholder={t("Q&A를 작성해주세요.")}
            style={{ marginBottom: "24px" }}
          ></textarea>
          <div className={styles.popupCheckboxs}>
            <CheckboxCustom
              label={t("비공개")}
              name="private"
              value="private"
              checked={isPrivate}
              onChange={() => {
                setIsPrivate(!isPrivate);
              }}
            />
            <CheckboxCustom
              label={t("메일로 답변받기")}
              name="mail"
              value="mail"
              checked={isMail}
              onChange={() => {
                setIsMail(!isMail);
              }}
            />
          </div>
        </div>
      }
      styleAction={{
        background: "#fff",
      }}
      action={
        <div>
          <p
            style={{
              display: "flex",
              alignItems: "start",
              gap: "4px",
              fontSize: "11px",
              color: "#949494",
            }}
          >
            <span>
              <IconInfo />
            </span>
            {`문의하신 내용에 대한 답변은 해당 상품의 상세페이지 또는 'CS Center > Q&A'에서 확인하실 수 있습니다.`}
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <ButtonCustom text={t("취소")} onClick={() => setOpenQna(false)} />
            <ButtonCustom
              variant={"primary"}
              text={t("등록하기")}
              onClick={() => setOpenQna(false)}
            />
          </div>
        </div>
      }
    />
  );
}
const IconInfo = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.00167 2.24603C4.824 2.24603 2.24798 4.82204 2.24798 7.99972C2.24798 11.1774 4.824 13.7534 8.00167 13.7534C11.1794 13.7534 13.7554 11.1774 13.7554 7.99972C13.7554 4.82204 11.1794 2.24603 8.00167 2.24603ZM1.14453 7.99972C1.14453 4.21263 4.21458 1.14258 8.00167 1.14258C11.7888 1.14258 14.8588 4.21263 14.8588 7.99972C14.8588 11.7868 11.7888 14.8569 8.00167 14.8569C4.21458 14.8569 1.14453 11.7868 1.14453 7.99972Z"
      fill="#A6A6A6"
    />
    <path
      d="M8.66046 7.99986C8.66046 7.65999 8.38494 7.38448 8.04507 7.38448C7.7052 7.38448 7.42969 7.65999 7.42969 7.99986V10.813C7.42969 11.1529 7.7052 11.4284 8.04507 11.4284C8.38494 11.4284 8.66046 11.1529 8.66046 10.813V7.99986Z"
      fill="#3F3F3F"
    />
    <path
      d="M8.04507 4.57129C7.7052 4.57129 7.42969 4.84681 7.42969 5.18667C7.42969 5.52654 7.7052 5.80206 8.04507 5.80206H8.05211C8.39197 5.80206 8.66749 5.52654 8.66749 5.18667C8.66749 4.84681 8.39197 4.57129 8.05211 4.57129H8.04507Z"
      fill="#3F3F3F"
    />
  </svg>
);
