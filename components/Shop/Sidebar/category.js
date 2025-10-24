import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ImageLoader from "~/components/Image";
import c from "./sidebar.module.css";

const SidebarCategoryList = (props) => {
  const [_c, setCatClicked] = useState("");
  const [subClicked, setSubClicked] = useState("");
  const [childClicked, setChildClicked] = useState("");
  const router = useRouter();

  //toggle category category
  const htc = (name) => {
    setSubClicked("");
    props.updateSubCategory("");
    props.updateChildCategory("");
    if (_c !== name) {
      setCatClicked(name);
      props.updateCategory(name);
      const { isSpecial, ...queryWithoutSpecial } = router.query;
      router.push({
        pathname: router.pathname,
        query: { ...queryWithoutSpecial, category: name },
      });
    }
  };

  //detect query change
  useEffect(() => {
    const { category, parent, child } = router.query;
    const query = category ? decodeURI(category) : "";
    const parentCategory = parent ? decodeURI(parent) : "";
    const childCategory = child ? decodeURI(child) : "";
    if (parentCategory.length > 1) {
      setCatClicked(parentCategory);
      setSubClicked(query);
      setChildClicked(childCategory);
      props.updateSubCategory(query);
      props.updateCategory(parentCategory);
      props.updateChildCategory(childCategory);
    } else if (query.length > 1) {
      setCatClicked(query);
      props.updateCategory(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.category]);

  //handle click subCategory
  const hcs = (name) => {
    if (subClicked === name) {
      props.updateSubCategory("");
      setSubClicked("");
      const { isSpecial, ...queryWithoutSpecial } = router.query;
      router.push({
        pathname: router.pathname,
        query: { ...queryWithoutSpecial, subcategory: "" },
      });
      return;
    }
    setSubClicked(name);
    props.updateSubCategory(name);
    props.updateChildCategory("");
    const { isSpecial, ...queryWithoutSpecial } = router.query;
    router.push({
      pathname: router.pathname,
      query: { ...queryWithoutSpecial, subcategory: name },
    });
  };

  //handle click Child Category
  const hcc = (name) => {
    if (childClicked === name) {
      props.updateChildCategory("");
      return setChildClicked("");
    }
    setChildClicked(name);
    props.updateChildCategory(name);
  };

  return (
    <ul className="list-unstyled ps-0">
      <li className={c.list}>
        <button
          className={`${_c === "" ? c.parent_button_active : c.parent_button}`}
          onClick={() => htc("")}
        >
          <ImageLoader
            src={process.env.NEXT_PUBLIC_URL + "/images/all-menu.png"}
            alt={"전체"}
            width={22}
            height={22}
          />
          전체
        </button>
      </li>
      {[...props.category].map((cat, i) => (
        <li className={c.list} key={cat._id + i}>
          <button
            className={`${
              _c === cat.slug ? c.parent_button_active : c.parent_button
            }`}
            onClick={() => htc(cat.slug)}
          >
            <ImageLoader
              src={cat.icon[0]?.url}
              alt={cat.name}
              width={22}
              height={22}
            />
            {cat.name}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default React.memo(SidebarCategoryList);
