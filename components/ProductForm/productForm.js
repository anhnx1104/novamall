import { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData, postData } from "~/lib/clientFunctions";
import FileUpload from "../FileUpload/fileUpload";
import TextEditor from "../TextEditor";
import LoadingButton from "../Ui/Button";
import Spinner from "../Ui/Spinner";
import CustomSelect from "../CustomSelect";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const ProductForm = () => {
  const url = `/api/product/create`;
  const router = useRouter();
  const { group } = router.query;
  const { data, error } = useSWR(url, fetchData);
  const urlSpecialGroup = `/api/group`;
  const { data: specialGroup, error: specialGroupError } = useSWR(
    urlSpecialGroup,
    fetchData
  );
  const product_type = useRef();
  const seo_title = useRef("");
  const seo_desc = useRef("");
  const [selectedType, setSelectedType] = useState("");
  const [subcategoryOption, setSubcategoryOption] = useState([]);
  const [childCategoryOption, setChildcategoryOption] = useState([]);
  const [isSpecial, setIsSpecial] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedChildcategory, setSelectedChildcategory] = useState("");
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedAttr, setSelectedAttr] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [attrItemList, setAttrItemList] = useState([]);
  const [displayImage, setDisplayImage] = useState([]);
  const [galleryImage, setGalleryImage] = useState([]);
  const [seoImage, setSeoImage] = useState([]);
  const [variantInputList, setVariantInputList] = useState([]);
  const [resetImageInput, setResetImageInput] = useState("");
  const [editorState, setEditorState] = useState("");
  const [buttonState, setButtonState] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [withdrawablePointRate, setWithdrawablePointRate] = useState("");
  const [shoppingPointRate, setShoppingPointRate] = useState("");
  const [mainPrice, setMainPrice] = useState("");
  const [rebateRate, setRebateRate] = useState("");
  const [pointLimitRate, setPointLimitRate] = useState("");
  const [options, setOptions] = useState([]);
  const [noticeInfos, setNoticeInfos] = useState([]);
  const { t } = useTranslation();
  useEffect(() => {
    const arrList = [];
    if (selectedColor.length && attrItemList.length) {
      selectedColor.map((color) => {
        attrItemList.map((attr) => {
          const combination = {
            color: color.label,
            attr: attr.label,
            price: "",
            sku: "",
            qty: "",
            imageIndex: 0,
          };
          arrList.push(combination);
        });
      });
    } else if (selectedColor.length && !attrItemList.length) {
      selectedColor.map((color) => {
        const combination = {
          color: color.label,
          attr: null,
          price: "",
          sku: "",
          qty: "",
          imageIndex: 0,
        };
        arrList.push(combination);
      });
    } else if (!selectedColor.length && attrItemList.length) {
      attrItemList.map((attr) => {
        const combination = {
          color: null,
          attr: attr.label,
          price: "",
          sku: "",
          qty: "",
          imageIndex: 0,
        };
        arrList.push(combination);
      });
    }
    setVariantInputList(arrList);
    return () => {
      setVariantInputList([]);
    };
  }, [selectedColor, attrItemList]);

  useEffect(() => {
    if (!isSpecial) {
      setMainPrice("");
      setSelectedGroup("");
    }
  }, [isSpecial]);

  useEffect(() => {
    if (group && specialGroup?.data) {
      setIsSpecial(true);
      const groupId = Array.isArray(group) ? group[0] : group;
      setSelectedGroup(groupId);

      const groupObj = specialGroup.data.find((g) => g._id === groupId);
      setMainPrice(groupObj && groupObj.price ? groupObj.price : "");
    }
  }, [group, specialGroup]);

  const updatedValueCb = (data) => {
    setEditorState(data);
  };

  const changeAttr = (e) => {
    setSelectedAttr(e);
    setAttrItemList([]);
  };

  const updateDisplayImage = (files) => setDisplayImage(files);
  const updateGalleryImage = (files) => setGalleryImage(files);

  const handleInputChange = (e, i) => {
    const { name, value } = e.target;
    const items = [...variantInputList];
    items[i][name] = value;
    setVariantInputList(items);
  };
  const getEditorStateData = (editorData) => {
    const textOnly = editorData.replace(/(<([^>]+)>)/gi, "").trim();
    const hasImage = /<img\s[^>]*src=["']?([^>"']+)["']?[^>]*>/i.test(
      editorData
    );
    return textOnly.length > 0 || hasImage ? editorData : "";
  };
  const formHandler = async (e) => {
    e.preventDefault();
    if (displayImage.length === 0 || galleryImage.length === 0) {
      return toast.warn("모든 필수 항목을 입력해주세요!");
    }
    setButtonState("loading");
    const form = document.querySelector("#product_form");
    const formData = new FormData(form);
    const displayImg = JSON.stringify(displayImage);
    const galleryImg = JSON.stringify(galleryImage);
    const seo = {
      title: seo_title.current.value.trim(),
      description: seo_desc.current.value.trim(),
      image: seoImage,
    };
    formData.append("displayImage", displayImg);
    formData.append("galleryImages", galleryImg);
    formData.append("type", selectedType);
    formData.append("category", selectedCategory);
    formData.append("subcategory", JSON.stringify([selectedSubcategory]));
    formData.append("childCategory", JSON.stringify([selectedChildcategory]));
    formData.append("brand", selectedBrand);
    formData.append("color", JSON.stringify(selectedColor));
    formData.append("attribute", JSON.stringify(attrItemList));
    formData.append("selectedAttribute", selectedAttr);
    formData.append("variant", JSON.stringify(variantInputList));
    formData.append("seo", JSON.stringify(seo));
    formData.append("description", getEditorStateData(editorState));
    formData.append("isSpecial", isSpecial);

    if (isSpecial) {
      formData.append("group", selectedGroup);
      formData.append("withdrawablePointRate", withdrawablePointRate);
      formData.append("shoppingPointRate", shoppingPointRate);
      formData.append("rebateRate", rebateRate);
      formData.append("pointLimitRate", pointLimitRate);
    }
    formData.append("noticeInfo", JSON.stringify(noticeInfos));
    formData.append("option", JSON.stringify(options));

    await postData("/api/product/create", formData)
      .then((status) => {
        status.success
          ? (toast.success("제품이 성공적으로 추가되었습니다."),
            form.reset(),
            setSelectedCategory(""),
            setSelectedSubcategory([]),
            setSelectedChildcategory([]),
            setVariantInputList([]),
            setSelectedType(""),
            setSelectedColor([]),
            setSelectedAttr([]),
            setResetImageInput("reset"),
            setEditorState(""))
          : toast.error("문제가 발생했습니다.");
      })
      .catch((err) => {
        console.log(err);
        toast.error("문제가 발생했습니다.");
      });
    setButtonState("");
  };

  if (error) return <div>failed to load</div>;
  if (!data) return <Spinner />;
  if (!data.success) return <div>문제가 발생했습니다...</div>;

  const colorOption = [];
  data.color.map((color) =>
    colorOption.push({ label: color.name, value: color.value })
  );

  const attrItemOption = (index) => {
    const item = [];
    data.attribute[index].values.map((attr) =>
      item.push({
        label: attr.name,
        value: attr.name,
        for: data.attribute[index].name,
      })
    );
    return item;
  };

  function updateBrand(e) {
    setSelectedBrand(e.target.value);
  }

  function updateCategory(e) {
    setSelectedSubcategory("");
    setSelectedChildcategory("");
    const category = data.category.find((x) => x.slug === e.target.value);
    if (category) {
      const subcategory = [];
      const childCategory = [];
      category.subCategories.forEach((sub) => {
        subcategory.push({ name: sub.name, slug: sub.slug });
        sub.child?.forEach((child) => {
          childCategory.push({ name: child.name, slug: child.slug });
        });
      });
      setSelectedCategory(category._id);
      setSubcategoryOption(subcategory);
      setChildcategoryOption(childCategory);
    }
  }

  function handleGroupChange(e) {
    const groupId = e.target.value;
    setSelectedGroup(groupId);
    if (specialGroup?.data) {
      const groupObj = specialGroup.data.find((g) => g._id === groupId);
      setMainPrice(groupObj && groupObj.price ? groupObj.price : "");
    }
  }

  const addNoticeInfo = () => {
    setNoticeInfos([...noticeInfos, { title: "", description: "" }]);
  };

  const handleNoticeChange = (index, field, value) => {
    const updatedNotices = [...noticeInfos];
    updatedNotices[index][field] = value;
    setNoticeInfos(updatedNotices);
  };

  const removeNotice = (index) => {
    const updatedNotices = noticeInfos.filter((_, i) => i !== index);
    setNoticeInfos(updatedNotices);
  };

  return (
    <>
      <h4 className="text-center pt-3 pb-5">{t("Create New Product")}</h4>
      <form
        id="product_form"
        encType="multipart/form-data"
        onSubmit={formHandler}
      >
        <div className="row">
          <div className="col-lg-8">
            {productType()}
            {imageInput()}
            {productInformation()}
            {productDescription()}
            {productNoticeInfo()}
            {productTypeInput()}
            {seoInput()}
          </div>
          <div className="col-lg-4">
            {priceSelection()}
            {isSpecial && rebateSection()}
            {/* {vatTaxSelection()} */}
          </div>
        </div>
        <div className="my-4">
          <LoadingButton
            type="submit"
            text={t("Add Product")}
            state={buttonState}
          />
        </div>
      </form>
    </>
  );

  function productNoticeInfo() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Notice Info")}
        </div>
        <div className="card-body">
          {noticeInfos.map((notice, index) => (
            <div key={index} className="mb-3 p-3 border rounded">
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeNotice(index)}
                >
                  {t("Remove")}
                </button>
              </div>
              <div className="mb-3">
                <label className="form-label">{t("Title")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={notice.title}
                  onChange={(e) =>
                    handleNoticeChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">{t("콘텐츠")}</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={notice.description}
                  onChange={(e) =>
                    handleNoticeChange(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-success"
            onClick={addNoticeInfo}
          >
            {t("값 추가")}
          </button>
        </div>
      </div>
    );
  }

  function productDescription() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Description")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-7" className="form-label">
              {t("Short Description")}*
            </label>
            <textarea
              id="inp-7"
              className="form-control"
              name="short_description"
            />
          </div>
          <div className="py-3">
            <label className="form-label">{t("description")}</label>
            <TextEditor
              previousValue={editorState}
              updatedValue={updatedValueCb}
              height={300}
            />
          </div>
        </div>
      </div>
    );
  }

  function vatTaxSelection() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Vat & Tax Information")}
        </div>
        <div className="card-body">
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-47" className="form-label">
                {t("Vat in Percentage")}*
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="inp-47"
                className="form-control"
                name="vat"
                placeholder="0%"
                required
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-48" className="form-label">
                {t("Tax in Percentage")}*
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="inp-48"
                placeholder="0%"
                className="form-control"
                name="tax"
                required
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function rebateSection() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("리베이트 설정")}
        </div>
        <div className="card-body">
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-4" className="form-label">
                {t("리베이트 비율 입력(%)")}*
              </label>
              <input
                type="number"
                step="0.01"
                id="inp-4"
                className="form-control"
                name="rebate"
                placeholder="비율을 입력하세요."
                required
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setRebateRate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-4" className="form-label">
                {t("포인트 적립 한도 입력(%)")}*
              </label>
              <input
                type="number"
                step="0.01"
                id="inp-4"
                className="form-control"
                name="point"
                placeholder="한도를 입력하세요."
                required
                onWheel={(e) => e.target.blur()}
                onChange={(e) => setPointLimitRate(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-4" className="form-label">
                {t("포인트 지급 비율 입력(포인트 적립한도의 분배 비율 %)")}*
              </label>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <input
                  type="number"
                  step="0.01"
                  id="inp-4"
                  className="form-control"
                  name="export_point"
                  placeholder="출금 가능 포인트"
                  required
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setWithdrawablePointRate(e.target.value)}
                />
                <span>/</span>
                <input
                  type="number"
                  step="0.01"
                  id="inp-4"
                  className="form-control"
                  name="import_point"
                  placeholder="쇼핑몰 포인트"
                  required
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => setShoppingPointRate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function priceSelection() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Price Information")}
        </div>
        <div className="card-body">
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-4" className="form-label">
                {t("price")}*
              </label>
              <input
                type="number"
                step="0.01"
                id="inp-4"
                className="form-control"
                name="main_price"
                required
                onWheel={(e) => e.target.blur()}
                value={isSpecial ? mainPrice : mainPrice || ""}
                readOnly={isSpecial}
                onChange={(e) => !isSpecial && setMainPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-5" className="form-label">
                {t("Discount in Percentage")}*
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="inp-5"
                placeholder="0%"
                className="form-control"
                name="sale_price"
                required
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function productTypeInput() {
    return (
      <div>
        {selectedType === "simple" && (
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              {t("Product Information")}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="py-3">
                    <label htmlFor="inp-6" className="form-label">
                      {t("Item Quantity")}*({t("Set -1 to make it unlimited")})
                    </label>
                    <input
                      type="number"
                      min="-1"
                      id="inp-6"
                      className="form-control"
                      name="qty"
                      defaultValue={1}
                      required
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="py-3">
                    <label className="form-label">{t("sku")}*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sku"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedType === "variable" && (
          <div className="card mb-5 border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              {t("Product Variation")}
            </div>
            <div className="card-body">
              {/* <div className="row py-3">
                <label className="form-label">{t("Colors")}</label>
                <MultiSelect
                  options={colorOption}
                  onChange={(e) => {
                    setSelectedColor(e);
                  }}
                  value={selectedColor}
                  labelledBy="Select Color"
                />
              </div> */}
              <div className="py-3">
                <label className="form-label">{t("Attributes")}</label>
                <select
                  className="form-control"
                  defaultValue=""
                  onChange={(evt) => changeAttr(evt.target.value)}
                >
                  <option value="" disabled>
                    {t("Select Attribute")}
                  </option>
                  {data.attribute.map((attr, idx) => (
                    <option value={idx} key={idx}>
                      {attr.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAttr.length > 0 && (
                <div className="row py-3">
                  <label className="form-label">
                    {data.attribute[selectedAttr].name}
                  </label>
                  <MultiSelect
                    options={attrItemOption(selectedAttr)}
                    onChange={(e) => {
                      setAttrItemList(e);
                    }}
                    value={attrItemList}
                    labelledBy="Select Item"
                  />
                </div>
              )}
              {variantInputList.length > 0 &&
                variantInputList.map((variant, index) => {
                  return (
                    <div key={index}>
                      <hr />
                      <h6>
                        {t("Variant")}:{" "}
                        {`${variant.color ? variant.color : ""} ${
                          variant.color && variant.attr ? "+" : ""
                        } ${variant.attr ? variant.attr : ""}`}
                      </h6>
                      <div className="row">
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">
                              {t("Additional Price")}*
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="form-control"
                              name="price"
                              required
                              value={variant.price || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                              onWheel={(e) => e.target.blur()}
                            />
                            <div className="small text-primary">
                              {t("Set 0 to make it free")}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">{t("sku")}*</label>
                            <input
                              type="text"
                              className="form-control"
                              name="sku"
                              required
                              value={variant.sku || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">
                              {t("Item Quantity")}*
                            </label>
                            <input
                              type="number"
                              min="-1"
                              className="form-control"
                              name="qty"
                              required
                              value={variant.qty || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                              onWheel={(e) => e.target.blur()}
                            />
                            <div className="small text-primary">
                              {t("Set -1 to make it unlimited")}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <CustomSelect
                              list={galleryImage || []}
                              dataChange={handleInputChange}
                              rootIndex={index}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  function productType() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Type")}
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <div className="py-3">
                <label htmlFor="inp-110" className="form-label">
                  {t("new_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-110"
                    name="new_product"
                  />
                  <label className="form-check-label" htmlFor="inp-110">
                    {t("Status")}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="py-3">
                <label htmlFor="inp-11" className="form-label">
                  {t("trending_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-11"
                    name="trending"
                  />
                  <label className="form-check-label" htmlFor="inp-11">
                    {t("Status")}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="py-3">
                <label htmlFor="inp-111" className="form-label">
                  {t("best_selling_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-111"
                    name="best_selling"
                  />
                  <label className="form-check-label" htmlFor="inp-111">
                    {t("Status")}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="py-3">
                <label htmlFor="inp-112" className="form-label">
                  {t("특별 상품")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-112"
                    checked={isSpecial}
                    onChange={(e) => setIsSpecial(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="inp-112">
                    {t("Status")}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-type" className="form-label">
                {t("Product Type")}*
              </label>
              <select
                id="inp-type"
                ref={product_type}
                className="form-control"
                required
                onChange={() => setSelectedType(product_type.current.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  {t("Select Product Type")}
                </option>
                <option value="simple">기본 상품</option>
                <option value="variable">옵션 상품</option>
              </select>
            </div>
          </div>
          <div className="py-3">
            <label className="form-label">{t("상품군")}*</label>
            <select
              className="form-select"
              onChange={updateCategory}
              defaultValue=""
              required
            >
              <option value="">Select Category</option>
              {data?.category?.map((x, i) => (
                <option key={i} value={x.slug}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
          {isSpecial && (
            <div className="py-3">
              <label className="form-label">{t("특별 그룹")}*</label>
              <select
                className="form-select"
                onChange={handleGroupChange}
                value={selectedGroup}
                required
              >
                <option value="">Select Special Group</option>
                {specialGroup?.data?.map((x, i) => (
                  <option key={i} value={x._id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    );
  }

  function productInformation() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Information")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-1" className="form-label">
              {t("name")}*
            </label>
            <input
              type="text"
              id="inp-1"
              className="form-control"
              name="name"
              required
            />
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-2" className="form-label">
                  {t("Unit")}*
                </label>
                <input
                  type="text"
                  id="inp-2"
                  className="form-control"
                  name="unit"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-3" className="form-label">
                  {t("Unit Value")}*
                </label>
                <input
                  type="text"
                  id="inp-3"
                  className="form-control"
                  name="unit_val"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function imageInput() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Image")}
        </div>
        <div className="card-body">
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Display Image")}
            updateFilesCb={updateDisplayImage}
            resetCb={resetImageInput}
          />

          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Gallery Images")}
            multiple
            updateFilesCb={updateGalleryImage}
            resetCb={resetImageInput}
          />
        </div>
      </div>
    );
  }

  function seoInput() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("SEO Meta Tags")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-122" className="form-label">
              {t("Meta Title")}
            </label>
            <input
              type="text"
              ref={seo_title}
              id="inp-122"
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-222" className="form-label">
              {t("Meta Description")}
            </label>
            <textarea ref={seo_desc} id="inp-222" className="form-control" />
          </div>
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Meta Image")}
            updateFilesCb={setSeoImage}
            resetCb={resetImageInput}
          />
        </div>
      </div>
    );
  }
};

export default ProductForm;
