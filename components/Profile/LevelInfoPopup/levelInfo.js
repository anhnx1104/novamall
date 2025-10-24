import { useState, useEffect, useRef } from "react";
import styles from "./levelInfo.module.css";
import Link from "next/link";
import { CloseIcon } from "~/components/Ui/Icons/icons";

export default function LevelInfo({ width }) {
  const [open, setOpen] = useState(false);

  const [position, setPosition] = useState({ top: "100%", left: "0" });
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const levels = [
    {
      level: "LV 1",
      title: "특별 상품 구매권\n총합 100만원 이상 구매 시",
      badge: "나의 등급",
      desc: [
        "At ac lobortis id nunc aliquam. At leo magna tortor turpis.",
        "At ac lobortis id nunc aliquam. At leo magna tortor turpis.",
      ],
    },
    {
      level: "LV 2",
      title: "정기 프로모션 참여\n최소 50만원 이상 구매 시",
      desc: [
        "Sed egestas, lacus sit amet efficitur vehicula, velit eros suscipit purus.",
        "Sed egestas, lacus sit amet efficitur vehicula, velit eros suscipit purus.",
      ],
    },
    {
      level: "LV 3",
      title: "친구 추천 할인\n추천 시 20% 할인 혜택 제공",
      desc: [
        "Quisque tincidunt augue vitae condimentum dapibus, lectus elit dignissim nunc.",
        "Quisque tincidunt augue vitae condimentum dapibus, lectus elit dignissim nunc.",
      ],
    },
    {
      level: "LV 4",
      title: "생일 기념 이벤트\n가입한 고객 모두에게 특별 쿠폰 발송",
      desc: [
        "Praesent volutpat, arcu non lobortis interdum, justo justo posuere ex.",
        "Praesent volutpat, arcu non lobortis interdum, justo justo posuere ex.",
      ],
    },
  ];

  const toggleDropdown = () => {
    setOpen(!open);
  };

  // Calculate dropdown position based on viewport
  const calculatePosition = () => {
    if (!dropdownRef.current || !menuRef.current) return;

    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = dropdownRect.bottom + 4; // Default: below dropdown
    let left = dropdownRect.left;
    let transformOrigin = "top";

    // Check if dropdown would go off bottom of screen
    if (dropdownRect.bottom + menuRect.height + 8 > viewportHeight) {
      top = dropdownRect.top - menuRect.height - 4; // Position above
      transformOrigin = "bottom";
    }

    // Check if dropdown would go off right side of screen
    if (dropdownRect.left + menuRect.width > viewportWidth - 8) {
      left = dropdownRect.right - menuRect.width; // Align right edge
    }

    // Check if dropdown would go off left side of screen
    if (left < 8) {
      left = 8; // Minimum left margin
    }

    // Ensure dropdown doesn't go off top of screen
    if (top < 8) {
      top = 8;
    }

    setPosition({
      top: `${top}px`,
      left: `${left}px`,
      position: "fixed",
      transformOrigin,
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      calculatePosition();
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("resize", calculatePosition);
      window.addEventListener("scroll", calculatePosition);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition);
    };
  }, [open]);

  return (
    <div
      className={styles.dropdown}
      style={{ width: width || "fit-content" }}
      ref={dropdownRef}
    >
      {/* Header */}
      <button className={styles.btn} onClick={toggleDropdown}>
        <InfoLevelIcon />
      </button>

      {/* Menu */}
      {open && (
        <div
          className={styles.menu}
          ref={menuRef}
          style={{
            position: position.position || "absolute",
            top: position.top,
            left: position.left,
            zIndex: 9999,
            minWidth: "284px",
            width: "284px",
          }}
        >
          <div className={styles.header}>
            <span className={styles.title}>회원 등급 안내</span>
            <button className={styles.closeBtn} onClick={toggleDropdown}>
              <CloseIcon />
            </button>
          </div>
          <div className={styles.levels}>
            {levels.map((lv, i) => (
              <div key={i} className={styles.card}>
                <div className={styles.levelHeader}>
                  <div className={styles.titleBox}>
                    <span className={styles.level}>{lv.level}</span>
                    <span className={styles.levelTitle}>
                      {lv.title.split("\n").map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </span>
                  </div>
                  {lv.badge && <span className={styles.badge}>{lv.badge}</span>}
                </div>
                <div className={styles.desc}>
                  {lv.desc.map((d, idx) => (
                    <p key={idx}>{d}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
const InfoLevelIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.5 2.46552C4.71953 2.46552 2.46552 4.71953 2.46552 7.5C2.46552 10.2805 4.71953 12.5345 7.5 12.5345C10.2805 12.5345 12.5345 10.2805 12.5345 7.5C12.5345 4.71953 10.2805 2.46552 7.5 2.46552ZM1.5 7.5C1.5 4.18629 4.18629 1.5 7.5 1.5C10.8137 1.5 13.5 4.18629 13.5 7.5C13.5 10.8137 10.8137 13.5 7.5 13.5C4.18629 13.5 1.5 10.8137 1.5 7.5Z"
      fill="var(--text-a6a6a6)"
    />
    <path
      d="M8.07692 7.5C8.07692 7.20262 7.83585 6.96154 7.53846 6.96154C7.24108 6.96154 7 7.20262 7 7.5V9.96154C7 10.2589 7.24108 10.5 7.53846 10.5C7.83585 10.5 8.07692 10.2589 8.07692 9.96154V7.5Z"
      fill="var(--text-3f3f3f)"
    />
    <path
      d="M7.53846 4.5C7.24108 4.5 7 4.74108 7 5.03846C7 5.33585 7.24108 5.57692 7.53846 5.57692H7.54462C7.842 5.57692 8.08308 5.33585 8.08308 5.03846C8.08308 4.74108 7.842 4.5 7.54462 4.5H7.53846Z"
      fill="var(--text-3f3f3f)"
    />
  </svg>
);
