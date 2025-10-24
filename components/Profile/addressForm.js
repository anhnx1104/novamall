import LoadingButton from "../Ui/Button";
import countryData from "~/data";
import { useState } from "react";
import { formField, postData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";

export default function NewCustomer({ onSuccess }) {
  const [buttonState, setButtonState] = useState("");
  const [isMainAddress, setIsMainAddress] = useState(false);
  async function handleInfo(e) {
    try {
      e.preventDefault();
      setButtonState("loading");
      const data = formField(e.target.elements);
      const resp = await postData("/api/profile/address", data);
      resp.success
        ? (toast.success("주소가 성공적으로 추가되었습니다."),
          e.target.reset(),
          onSuccess && onSuccess())
        : toast.error("문제가 발생했습니다.");
    } catch (err) {
      console.log(err);
      toast.error(`오류: ${err.message}`);
    }
    setButtonState("");
  }
  return (
    <form onSubmit={handleInfo}>
      <div className="mb-3 p-4">
        <label className="mb-3">주소 추가</label>
        <div className="mb-3">
          <input
            type="text"
            placeholder="성명*"
            name="name"
            required
            className="form-control"
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="tel"
                placeholder="전화번호*"
                name="phone"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="email"
                placeholder="이메일*"
                name="email"
                required
                className="form-control"
              />
            </div>
          </div>
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="주소 (도로명/지번)*"
            name="house"
            required
            rows="2"
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                placeholder="시/군/구*"
                name="city"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                placeholder="도/시*"
                name="state"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                placeholder="우편번호*"
                name="zipCode"
                required
                className="form-control"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <input
                type="text"
                placeholder="저장 이름 (예: 집 주소, 회사 주소 등)*"
                className="form-control"
                required
                name="addressTitle"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-2 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isMainAddress}
                  onChange={(e) => setIsMainAddress(e.target.checked)}
                  id="flexCheckDefault"
                  name="addressType"
                  value={isMainAddress ? "main address" : "address"}
                />
                <label className="form-check-label" htmlFor="flexCheckDefault">
                  기본 주소
                </label>
              </div>
              <small>여기서 변경하면 기존 기본 주소 설정이 대체됩니다.</small>
            </div>
          </div>
        </div>
      </div>
      <LoadingButton text="제출" type="submit" state={buttonState} />
    </form>
  );
}
