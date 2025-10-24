import LoadingButton from "../Ui/Button";
import countryData from "~/data";
import { useState } from "react";
import { formField, updateData } from "~/lib/clientFunctions";
import { toast } from "react-toastify";

export default function EditCustomer({ data, close }) {
  const [buttonState, setButtonState] = useState("");
  async function handleInfo(e) {
    try {
      e.preventDefault();
      setButtonState("loading");
      const data = formField(e.target.elements);
      const resp = await updateData("/api/profile/address", data);
      resp.success
        ? (toast.success("주소가 성공적으로 업데이트되었습니다."), close())
        : toast.error("데이터에 변경 사항이 없습니다.");
    } catch (err) {
      console.log(err);
      toast.error(`오류가 발생했습니다 : ${err.message}`);
    }
    setButtonState("");
  }
  return (
    <form onSubmit={handleInfo}>
      <input type="hidden" name="_id" defaultValue={data._id} />
      <div className="mb-3 p-4">
        <label className="mb-3">주소 수정</label>
        <div className="mb-3">
          <input
            type="text"
            placeholder="성명*"
            name="name"
            required
            className="form-control"
            defaultValue={data.name}
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
                defaultValue={data.phone}
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
                defaultValue={data.email}
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
            defaultValue={data.house}
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
                defaultValue={data.city}
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
                defaultValue={data.state}
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
                defaultValue={data.zipCode}
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
                defaultValue={data.addressTitle}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-2 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="main address"
                  id="flexCheckDefault"
                  name="addressType"
                  defaultChecked={data.addressType === "main address"}
                  key={data.addressType === "main address"}
                />
                <label className="form-check-label" for="flexCheckDefault">
                  기본 주소
                </label>
              </div>
              <small>기존 기본 주소 설정이 여기서 변경하면 대체됩니다.</small>
            </div>
          </div>
        </div>
      </div>
      <LoadingButton text="제출" type="submit" state={buttonState} />
    </form>
  );
}
