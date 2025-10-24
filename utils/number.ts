/**
 * 숫자를 금액 형식 문자열로 변환
 * @param {number} number - 변환할 숫자
 * @param {number} decimalPlaces - 소수점 자리수 (기본값: 0)
 * @returns {string} 금액 형식의 문자열
 */
export const formatNumberWithCommaAndFloor = (
  number: number,
  decimalPlaces?: number
) => {
  if (typeof number !== "number" || isNaN(number)) return "Invalid number";
  if (typeof decimalPlaces !== "number" || decimalPlaces < 0) decimalPlaces = 0;

  return number.toFixed(decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
