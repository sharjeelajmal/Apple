export type CardBrandId =
  | "visa"
  | "mastercard"
  | "amex"
  | "discover"
  | "diners"
  | "jcb"
  | "unionpay"
  | "maestro"
  | "mir"
  | "unknown";

export type CardBrand = {
  id: CardBrandId;
  name: string;
  pattern: RegExp;
  lengths: number[];
  gaps: number[];
  gapsByLength?: Partial<Record<number, number[]>>;
  cvcLength: number;
  usesLuhn: boolean;
};

const STANDARD_GAPS = [4, 8, 12, 16];

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);

const cardBrands: CardBrand[] = [
  { id: "amex", name: "American Express", pattern: /^3[47]/, lengths: [15], gaps: [4, 10], cvcLength: 4, usesLuhn: true },
  {
    id: "diners",
    name: "Diners Club",
    pattern: /^3(0[0-5]|[689])/,
    lengths: [14, 16, 19],
    gaps: STANDARD_GAPS,
    gapsByLength: { 14: [4, 10] },
    cvcLength: 3,
    usesLuhn: true,
  },
  { id: "jcb", name: "JCB", pattern: /^35/, lengths: range(16, 19), gaps: STANDARD_GAPS, cvcLength: 3, usesLuhn: true },
  {
    id: "discover",
    name: "Discover",
    pattern: /^(6011|65|64[4-9])/,
    lengths: [16, 19],
    gaps: STANDARD_GAPS,
    cvcLength: 3,
    usesLuhn: true,
  },
  { id: "unionpay", name: "UnionPay", pattern: /^(62|81)/, lengths: range(14, 19), gaps: STANDARD_GAPS, cvcLength: 3, usesLuhn: false },
  {
    id: "maestro",
    name: "Maestro",
    pattern: /^(5018|5020|5038|5[6-9]|6304|6759|676[1-3])/,
    lengths: range(12, 19),
    gaps: STANDARD_GAPS,
    cvcLength: 3,
    usesLuhn: true,
  },
  { id: "mir", name: "Mir", pattern: /^220[0-4]/, lengths: range(16, 19), gaps: STANDARD_GAPS, cvcLength: 3, usesLuhn: true },
  {
    id: "mastercard",
    name: "Mastercard",
    pattern: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/,
    lengths: [16],
    gaps: STANDARD_GAPS,
    cvcLength: 3,
    usesLuhn: true,
  },
  { id: "visa", name: "Visa", pattern: /^4/, lengths: [13, 16, 18, 19], gaps: STANDARD_GAPS, cvcLength: 3, usesLuhn: true },
];

const unknownBrand: CardBrand = {
  id: "unknown",
  name: "Card",
  pattern: /^/,
  lengths: range(12, 19),
  gaps: STANDARD_GAPS,
  cvcLength: 3,
  usesLuhn: true,
};

const describeLengths = (lengths: number[]) => {
  if (lengths.length === 1) return `${lengths[0]}`;
  const isRange = lengths.every((length, index) => index === 0 || length === lengths[index - 1] + 1);
  return isRange ? `${lengths[0]} to ${lengths[lengths.length - 1]}` : `${lengths.slice(0, -1).join(", ")} or ${lengths[lengths.length - 1]}`;
};

export const cardBrandNames = [...cardBrands, unknownBrand].map((brand) => brand.name);

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export const detectCardBrand = (digits: string) => cardBrands.find((brand) => brand.pattern.test(digits)) ?? unknownBrand;

export const getMaxCardLength = (brand: CardBrand) => Math.max(...brand.lengths);

const getGaps = (brand: CardBrand, length: number) => brand.gapsByLength?.[length] ?? brand.gaps;

export const formatCardNumber = (digits: string, brand: CardBrand) => {
  const gaps = getGaps(brand, digits.length);
  return digits
    .split("")
    .map((digit, index) => (gaps.includes(index) ? ` ${digit}` : digit))
    .join("");
};

export const getFormattedCardLength = (brand: CardBrand) => {
  const maxLength = getMaxCardLength(brand);
  return maxLength + getGaps(brand, maxLength).filter((gap) => gap < maxLength).length;
};

const passesLuhn = (digits: string) => {
  let sum = 0;
  for (let index = 0; index < digits.length; index++) {
    let digit = Number(digits[digits.length - 1 - index]);
    if (index % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

export const validateCardNumber = (digits: string) => {
  const brand = detectCardBrand(digits);
  if (!digits) return "Enter your card number.";
  if (!brand.lengths.includes(digits.length)) {
    return `${brand.name} numbers must be ${describeLengths(brand.lengths)} digits long.`;
  }
  if (brand.usesLuhn && !passesLuhn(digits)) {
    return "This card number isn't valid. Please check the digits and try again.";
  }
  return "";
};

export const validateExpiry = (value: string) => {
  const [month, year] = value.split("/").map(Number);
  if (!month || !year) return "Choose the expiration month and year.";

  const today = new Date();
  const expiresAt = new Date(2000 + year, month, 1);
  return expiresAt > new Date(today.getFullYear(), today.getMonth(), 1) ? "" : "This card has expired.";
};

export const validateCvc = (cvc: string, brand: CardBrand) =>
  cvc.length === brand.cvcLength ? "" : `Enter the ${brand.cvcLength}-digit security code.`;

export const validateCardForm = ({ number, expiry, cvc }: { number: string; expiry: string; cvc: string }) => {
  const errors = {
    number: validateCardNumber(number),
    expiry: validateExpiry(expiry),
    cvc: validateCvc(cvc, detectCardBrand(number)),
  };
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message)) as Partial<typeof errors>;
};
