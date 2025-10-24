import DefaultErrorPage from "next/error";
import { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData, postData } from "~/lib/clientFunctions";
import FileUpload from "../FileUpload/fileUpload";
import TextEditor from "../TextEditor";
import LoadingButton from "../Ui/Button";
import Spinner from "../Ui/Spinner";
import classes from "./productForm.module.css";
import CustomSelect from "../CustomSelect";
import { useTranslation } from "react-i18next";

const ProductEditForm = (props) => {
  const url = `/api/product/edit?slug=${props.slug}`;
  const { data, error } = useSWR(url, fetchData);
  const urlSpecialGroup = `/api/group`;
  const { data: specialGroup, error: specialGroupError } = useSWR(
    urlSpecialGroup,
    fetchData
  );
  const product_type = useRef();
  const seo_title = useRef("");
  const seo_desc = useRef("");
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedAttr, setSelectedAttr] = useState([]);
  const [attrItemList, setAttrItemList] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubcategory] = useState("");
  const [selectedChildcategory, setSelectedChildcategory] = useState("");
  const [subcategoryOption, setSubcategoryOption] = useState([]);
  const [childCategoryOption, setChildcategoryOption] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [variantInputList, setVariantInputList] = useState([]);
  const [displayImage, setDisplayImage] = useState([]);
  const [galleryImage, setGalleryImage] = useState([]);
  const [seoImage, setSeoImage] = useState([]);
  const [editorState, setEditorState] = useState("");
  const [buttonState, setButtonState] = useState("");
  const [isSpecial, setIsSpecial] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [withdrawablePointRate, setWithdrawablePointRate] = useState("");
  const [shoppingPointRate, setShoppingPointRate] = useState("");
  const [mainPrice, setMainPrice] = useState("");
  const [rebateRate, setRebateRate] = useState("");
  const [pointLimitRate, setPointLimitRate] = useState("");
  const [productOptions, setProductOptions] = useState([]);
  const [noticeInfos, setNoticeInfos] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.product) {
      const preSelectedColor = [];
      data.product.colors.forEach((color) =>
        preSelectedColor.push({ label: color.label, value: color.value })
      );

      const preSelectedAttribute = [];
      data.product.attributes.forEach((attr) =>
        preSelectedAttribute.push({
          label: attr.label,
          value: attr.value,
          for: attr.for,
        })
      );
      setSelectedColor(preSelectedColor);
      setSelectedAttr(
        data.product.attributeIndex ? data.product.attributeIndex : ""
      );
      setAttrItemList(preSelectedAttribute);
      setSelectedType(data.product.type);
      setVariantInputList(data.product.variants);
      setDisplayImage(data.product.image);
      setGalleryImage(data.product.gallery);
      setSeoImage(data.product.seo.image);
      setEditorState(data.product.description);
      if (data.product.categories[0]) {
        setSelectedSubcategory(data.product.subcategories[0]);
        setSelectedChildcategory(data.product.childCategories[0]);
        const category = data.category.find(
          (x) => x.slug === data.product.categories[0]
        );
        setSelectedCategory(category._id);
        const subcategory = [];
        const childCategory = [];
        category.subCategories.forEach((sub) => {
          subcategory.push({ name: sub.name, slug: sub.slug });
          sub.child?.forEach((child) => {
            childCategory.push({ name: child.name, slug: child.slug });
          });
        });
        setSubcategoryOption(subcategory);
        setChildcategoryOption(childCategory);
      }
      setIsSpecial(data.product.isSpecial || false);
      setSelectedGroup(data.product.group || "");
      setWithdrawablePointRate(data.product.withdrawablePointRate || "");
      setShoppingPointRate(data.product.shoppingPointRate || "");
      setRebateRate(data.product.rebateRate || "");
      setPointLimitRate(data.product.pointLimitRate || "");
      setProductOptions(data.product.option || []);
      setNoticeInfos(data.product.noticeInfo || []);
      setMainPrice(data.product.price || "");
    }
  }, [data]);

  useEffect(() => {
    const itemList = (selectedColor.length || 1) * (attrItemList.length || 1);
    if (variantInputList.length !== itemList) {
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
    }
  }, [selectedColor, attrItemList, variantInputList.length]);

  if (error) return <div>failed to load</div>;
  if (!data) return <Spinner />;
  if (!data.product) return <DefaultErrorPage statusCode={404} />;

  const colorOption = [];
  data.color &&
    data.color.map((color) =>
      colorOption.push({ label: color.name, value: color.value })
    );

  const multiList = (item) => {
    const data = [];
    item.map((x) => data.push(x.value));
    return JSON.stringify(data);
  };

  const attributeIndex = data.product.attributeIndex
    ? data.product.attributeIndex
    : "";

  const updatedValueCb = (data) => {
    setEditorState(data);
  };

  const changeAttr = (e) => {
    setSelectedAttr(e);
    setAttrItemList([]);
  };

  const attrItemOption = (index) => {
    const item = [];
    data.attribute[index] &&
      data.attribute[index].values.map((attr) =>
        item.push({
          label: attr.name,
          value: attr.name,
          for: data.attribute[index].name,
        })
      );
    return item;
  };

  const handleInputChange = (e, i) => {
    const { name, value } = e.target;
    const items = [...variantInputList];
    items[i][name] = value;
    setVariantInputList(items);
  };

  const updateDisplayImage = (files) => setDisplayImage(files);
  const updateGalleryImage = (files) => setGalleryImage(files);

  const getEditorStateData = (editorData) => {
    const textOnly = editorData.replace(/(<([^>]+)>)/gi, "").trim();
    const hasImage = /<img\s[^>]*src=["']?([^>"']+)["']?[^>]*>/i.test(
      editorData
    );
    return textOnly.length > 0 || hasImage ? editorData : "";
  };

  function updateBrand(e) {
    setSelectedBrand(e.target.value);
  }

  function updateCategory(e) {
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

  const formHandler = async (e) => {
    e.preventDefault();
    if (displayImage.length === 0 || galleryImage.length === 0) {
      return toast.warn("모든 필수 항목을 입력해주세요!");
    }
    setButtonState("loading");
    const form = document.querySelector("#product_form");
    const formData = new FormData(form);

    // Clean up form data
    const cleanFormData = new FormData();

    // Add basic form fields
    for (let [key, value] of formData.entries()) {
      if (
        key === "trending" ||
        key === "best_selling" ||
        key === "new_product" ||
        key === "special_product"
      ) {
        cleanFormData.append(key, value === "on");
      } else {
        cleanFormData.append(key, value);
      }
    }

    // Add processed data
    cleanFormData.append("displayImage", JSON.stringify(displayImage));
    cleanFormData.append("galleryImages", JSON.stringify(galleryImage));
    cleanFormData.append("type", selectedType);
    cleanFormData.append("category", selectedCategory);
    cleanFormData.append("subcategory", selectedSubCategory);
    cleanFormData.append("childCategory", selectedChildcategory);
    cleanFormData.append("brand", selectedBrand);
    cleanFormData.append("color", JSON.stringify(selectedColor));
    cleanFormData.append("attribute", JSON.stringify(attrItemList));
    cleanFormData.append("selectedAttribute", selectedAttr);
    cleanFormData.append("variant", JSON.stringify(variantInputList));

    // Add special product fields
    cleanFormData.append("isSpecial", isSpecial);
    if (isSpecial) {
      cleanFormData.append("group", selectedGroup);
      cleanFormData.append("withdrawablePointRate", withdrawablePointRate);
      cleanFormData.append("shoppingPointRate", shoppingPointRate);
      cleanFormData.append("rebateRate", rebateRate);
      cleanFormData.append("pointLimitRate", pointLimitRate);
    }

    // Add product options
    cleanFormData.append("option", JSON.stringify(productOptions));
    cleanFormData.append("noticeInfo", JSON.stringify(noticeInfos));

    // Add SEO data
    const seo = {
      title: seo_title.current.value.trim(),
      description: seo_desc.current.value.trim(),
      image: seoImage,
    };
    cleanFormData.append("seo", JSON.stringify(seo));

    // Add description and special fields
    cleanFormData.append("description", getEditorStateData(editorState));

    try {
      const response = await postData("/api/product/edit", cleanFormData);

      if (response.success) {
        toast.success("제품이 성공적으로 업데이트되었습니다.");
      } else {
        toast.error("문제가 발생했습니다.");
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("문제가 발생했습니다.");
    } finally {
      setButtonState("");
    }
  };

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
      <h4 className="text-center pt-3 pb-5">{t("Edit Product")}</h4>
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
            {productTypeInput()}
            {productNoticeInfo()}
            {seoInput()}
          </div>
          <div className="col-lg-4">
            {priceSelection()}
            {isSpecial && rebateSection()}
            {/* {vatTaxSelection()} */}
          </div>
        </div>
        <input type="hidden" name="pid" defaultValue={data.product._id} />
        <div className="my-4">
          <LoadingButton
            type="submit"
            text={t("Update Product")}
            state={buttonState}
          />
        </div>
      </form>
    </>
  );

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
              className={classes.input + " form-control"}
              name="short_description"
              defaultValue={data.product.shortDescription}
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
                      className={classes.input + " form-control"}
                      name="qty"
                      defaultValue={data.product.quantity}
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
                      className={classes.input + " form-control"}
                      name="sku"
                      defaultValue={data.product.sku}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedType === "variable" && (
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
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
                  className={classes.input + " form-control"}
                  defaultValue={attributeIndex}
                  onChange={(evt) => changeAttr(evt.target.value)}
                >
                  <option value="" disabled>
                    {t("Select Attribute")}
                  </option>
                  {data.attribute &&
                    data.attribute.map((attr, idx) => (
                      <option value={idx} key={idx}>
                        {attr.name}
                      </option>
                    ))}
                </select>
              </div>
              {selectedAttr.length > 0 && data.attribute && (
                <div className="row py-3">
                  <label className="form-label">
                    {data.attribute[selectedAttr] &&
                      data.attribute[selectedAttr].name}
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
                              className={classes.input + " form-control"}
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
                              className={classes.input + " form-control"}
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
                              value={variant.qty > -2 ? variant.qty : ""}
                              className={classes.input + " form-control"}
                              name="qty"
                              required
                              onChange={(evt) => handleInputChange(evt, index)}
                              onWheel={(e) => e.target.blur()}
                            />
                            <div className="small text-primary">
                              S{t("et -1 to make it unlimited")}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <CustomSelect
                              list={galleryImage || []}
                              dataChange={handleInputChange}
                              rootIndex={index}
                              preIndex={variant.imageIndex || 0}
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
                    defaultChecked={data.product.new}
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
                    defaultChecked={data.product.trending}
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
                    defaultChecked={data.product.bestSelling}
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
                    name="special_product"
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
                defaultValue={data.product.type}
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
              defaultValue={data.product.categories[0]}
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
                defaultValue={mainPrice}
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
                defaultValue={
                  data.product.discountType === "amount"
                    ? data.product.price - data.product.discount
                    : Math.round(
                        (100 -
                          (data.product.discount * 100) / data.product.price) *
                          10
                      ) / 10
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function vatTaxSelection() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold text-center">
          {t("Vat & Tax Information")}
        </div>
        <div className="card-body">
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-4" className="form-label">
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
                defaultValue={data.product.vat}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-5" className="form-label">
                {t("Tax in Percentage")}*
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                id="inp-57"
                placeholder="0%"
                className="form-control"
                name="tax"
                required
                onWheel={(e) => e.target.blur()}
                defaultValue={data.product.tax}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  function categorySelection() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Category")}
        </div>
        <div className="card-body">
          <div className="col-12">
            <div className="py-3">
              <label className="form-label">{t("categories")}*</label>
              <select
                className="form-select"
                onChange={updateCategory}
                defaultValue={data.product.categories[0]}
                key={data.product.categories[0]}
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
          </div>
          <div className="col-12">
            <div className="py-3">
              <label className="form-label">{t("Subcategories")}*</label>
              <select
                className="form-select"
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                value={selectedSubCategory}
                required
              >
                <option value="">Select Sub Category</option>
                {subcategoryOption.map((x, i) => (
                  <option key={i} value={x.slug}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label className="form-label">{t("Child Categories")}</label>
              <select
                className="form-select"
                onChange={(e) => setSelectedChildcategory(e.target.value)}
                value={selectedChildcategory}
              >
                <option value="">Select Child Category</option>
                {childCategoryOption.map((x, i) => (
                  <option key={i} value={x.slug}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="py-3">
            <label className="form-label">{t("Brands")}</label>
            <select
              className="form-control"
              onChange={updateBrand}
              defaultValue={data.product.brand}
              key={data.product.brand}
            >
              <option value="">None</option>
              {data.brand &&
                data.brand.map((x) => (
                  <option value={x.slug} key={x._id}>
                    {x.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  function productInformation() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold text-center">
          {t("Product Description")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-1" className="form-label">
              {t("name")}*
            </label>
            <input
              type="text"
              id="inp-1"
              className={classes.input + " form-control"}
              name="name"
              defaultValue={data.product.name}
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
                  className={classes.input + " form-control"}
                  name="unit"
                  defaultValue={data.product.unit}
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
                  className={classes.input + " form-control"}
                  name="unit_val"
                  defaultValue={data.product.unitValue}
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
            preSelectedFiles={data.product.image}
          />

          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Gallery Images")}
            multiple
            updateFilesCb={updateGalleryImage}
            preSelectedFiles={data.product.gallery}
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
              defaultValue={data.product.seo.title}
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-222" className="form-label">
              {t("Meta Description")}
            </label>
            <textarea
              ref={seo_desc}
              id="inp-222"
              className="form-control"
              defaultValue={data.product.seo.description}
            />
          </div>
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Meta Image")}
            updateFilesCb={setSeoImage}
            preSelectedFiles={data.product.seo.image}
          />
        </div>
      </div>
    );
  }

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
                value={rebateRate}
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
                value={pointLimitRate}
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
                  value={withdrawablePointRate}
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
                  value={shoppingPointRate}
                  onChange={(e) => setShoppingPointRate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductEditForm;
