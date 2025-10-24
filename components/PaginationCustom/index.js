import c from "./pagination.module.css";
const PaginationCustom = ({ type = "list", mode = "light" }) => {
  return type === "list" ? (
    <div
      className={`${c.paginationList} ${mode === "dark" ? c.dark : c.light}`}
    >
      <button className={`${c.paginationButton} ${c.paginationButtonPrev}`}>
        <ArrowIcon />
      </button>
      <button className={`${c.paginationItem} ${c.paginationItemActive}`}>
        1
      </button>
      <button className={c.paginationItem}>2</button>
      <button className={c.paginationItem}>3</button>
      <button className={c.paginationItem}>4</button>
      <button className={c.paginationItem}>5</button>
      <button className={c.paginationItem}>...</button>
      <button className={c.paginationItem}>14</button>
      <button className={`${c.paginationButton} ${c.paginationButtonNext}`}>
        <ArrowIcon />
      </button>
    </div>
  ) : (
    <div
      className={`${c.paginationPage} ${mode === "dark" ? c.dark : c.light}`}
    >
      <button className={`${c.paginationButton} ${c.paginationButtonPrev}`}>
        <ArrowIcon />
      </button>
      <div className={c.paginationInfoPage}>
        <span>1</span>
        /2
      </div>
      <button className={`${c.paginationButton} ${c.paginationButtonNext}`}>
        <ArrowIcon />
      </button>
    </div>
  );
};

export default PaginationCustom;
export const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.53342 8.37862C5.43952 8.26345 5.39169 8.11754 5.39921 7.96913C5.40672 7.82072 5.46903 7.68038 5.57409 7.57529L9.57409 3.57529L9.62009 3.53462C9.7353 3.44106 9.88109 3.39353 10.0293 3.40119C10.1775 3.40886 10.3176 3.47118 10.4226 3.57613C10.5275 3.68107 10.5898 3.82118 10.5975 3.9694C10.6052 4.11761 10.5576 4.26341 10.4641 4.37862L10.4234 4.42462L6.84742 7.99995L10.4234 11.5753C10.536 11.6879 10.5993 11.8407 10.5993 12C10.5993 12.1592 10.536 12.312 10.4234 12.4246C10.3108 12.5372 10.158 12.6005 9.99875 12.6005C9.83947 12.6005 9.68672 12.5372 9.57409 12.4246L5.57409 8.42462L5.53342 8.37862Z"
      fill="currentColor"
    />
  </svg>
);
