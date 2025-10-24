import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { useState, useRef } from "react";
import axios from "axios";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

const TextEditor = ({ previousValue = "a", updatedValue, height }) => {
  const [isUploading, setIsUploading] = useState(false);
  const editorRef = useRef(null);

  const handleChange = (content) => {
    updatedValue(content);
  };

  // SunEditor의 ref를 가져오는 함수
  const getSunEditorInstance = (sunEditor) => {
    editorRef.current = sunEditor;
  };

  // 파일 업로드 핸들러 함수
  const handleImageUploadBefore = async (files, info, uploadHandler) => {
    try {
      setIsUploading(true);

      // 파일 정보 가져오기
      const file = files[0];

      // S3에 업로드하기 위한 서명된 URL 받아오기
      const { name, url } = await axios({
        method: "post",
        url: `/api/fileupload/s3?name=${file.name}&type=${file.type}`,
      }).then((res) => res.data);

      // 파일을 직접 S3 버킷에 업로드
      await axios({
        method: "put",
        url,
        headers: {
          "Content-Type": file.type,
        },
        data: file,
      });

      // 실제 이미지 URL (쿼리 파라미터 제거)
      const imageUrl = url.split("?")[0];

      if (imageUrl && imageUrl.length) {
        // 업로드 성공 처리 - 파일 URL을 에디터에 삽입
        const response = {
          result: [
            {
              url: imageUrl,
              name: name,
              size: file.size,
            },
          ],
        };

        // 다른 속성도 포함하여 응답을 전달
        uploadHandler(response);

        setIsUploading(false);
        return false; // 기본 업로드 처리 중지
      } else {
        // 업로드 실패 처리
        setIsUploading(false);
        return {
          errorMessage: "업로드에 실패했습니다.",
          result: false,
        };
      }
    } catch (error) {
      console.error("File upload error:", error);
      setIsUploading(false);
      return {
        errorMessage: "파일 업로드 중 오류가 발생했습니다.",
        result: false,
      };
    }
  };

  return (
    <>
      {isUploading && (
        <div
          style={{
            position: "absolute",
            padding: "5px 10px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          업로드 중...
        </div>
      )}
      <SunEditor
        getSunEditorInstance={getSunEditorInstance}
        setContents={previousValue}
        onChange={handleChange}
        onImageUploadBefore={handleImageUploadBefore}
        setOptions={{
          height: height || 500,
          buttonList: [
            ["undo", "redo", "font", "fontSize", "formatBlock", "align"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript",
              "removeFormat",
            ],
            [
              "fontColor",
              "hiliteColor",
              "outdent",
              "indent",
              "align",
              "horizontalRule",
              "list",
              "table",
            ],
            [
              "link",
              "image",
              "video",
              "fullScreen",
              "showBlocks",
              "codeView",
              "preview",
              "print",
              "save",
            ],
          ],
        }}
      />
    </>
  );
};

export default TextEditor;
