import { validateEmail } from "@/lib/validators";

type PostalRule = {
  pattern: RegExp;
  maxLength: number;
  example: string;
  numeric: boolean;
  sanitize: (value: string) => string;
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const formatUsZip = (value: string) => {
  const digits = digitsOnly(value).slice(0, 9);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
};

const upperAlphanumeric = (value: string) => value.toUpperCase().replace(/[^A-Z0-9 ]/g, "");

const postalRules: Record<string, PostalRule> = {
  US: { pattern: /^\d{5}(-\d{4})?$/, maxLength: 10, example: "12345", numeric: true, sanitize: formatUsZip },
  CA: { pattern: /^[A-Z]\d[A-Z] ?\d[A-Z]\d$/, maxLength: 7, example: "K1A 0B1", numeric: false, sanitize: upperAlphanumeric },
  UK: { pattern: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/, maxLength: 8, example: "SW1A 1AA", numeric: false, sanitize: upperAlphanumeric },
  AU: { pattern: /^\d{4}$/, maxLength: 4, example: "2000", numeric: true, sanitize: digitsOnly },
  PK: { pattern: /^\d{5}$/, maxLength: 5, example: "54000", numeric: true, sanitize: digitsOnly },
};

const defaultPostalRule: PostalRule = {
  pattern: /^[A-Z0-9 -]{3,10}$/,
  maxLength: 10,
  example: "",
  numeric: false,
  sanitize: (value) => value.toUpperCase().replace(/[^A-Z0-9 -]/g, ""),
};

const COUNTRIES_WITHOUT_POSTAL_CODES = ["UAE"];

export const isPostalCodeRequired = (country: string) => !COUNTRIES_WITHOUT_POSTAL_CODES.includes(country);

export const getPostalRule = (country: string) => postalRules[country] ?? defaultPostalRule;

export const fieldLimits = {
  name: 50,
  street: 100,
  apartment: 60,
  city: 60,
  phone: 20,
  email: 254,
};

export const sanitizers = {
  name: (value: string) => value.replace(/[^\p{L}\s'.-]/gu, "").slice(0, fieldLimits.name),
  street: (value: string) => value.replace(/[^\p{L}\d\s,.#/'-]/gu, "").slice(0, fieldLimits.street),
  apartment: (value: string) => value.replace(/[^\p{L}\d\s,.#/'-]/gu, "").slice(0, fieldLimits.apartment),
  city: (value: string) => value.replace(/[^\p{L}\s'.-]/gu, "").slice(0, fieldLimits.city),
  phone: (value: string) => value.replace(/[^\d+\s()-]/g, "").slice(0, fieldLimits.phone),
  email: (value: string) => value.replace(/\s/g, "").slice(0, fieldLimits.email),
  postalCode: (value: string, country: string) => {
    const rule = getPostalRule(country);
    return rule.sanitize(value).slice(0, rule.maxLength);
  },
};

const MIN_STREET_LENGTH = 5;
const MIN_PHONE_DIGITS = 7;

export const addressValidators = {
  name: (value: string, label: string) => (value.trim().length >= 2 ? "" : `Enter your ${label}.`),
  email: validateEmail,
  phone: (value: string) =>
    digitsOnly(value).length >= MIN_PHONE_DIGITS ? "" : "Enter a valid phone number.",
  street: (value: string) =>
    value.trim().length >= MIN_STREET_LENGTH && /\d/.test(value) && /\p{L}/u.test(value)
      ? ""
      : "Enter a street address with a house or building number.",
  city: (value: string) => (value.trim().length >= 2 ? "" : "Enter your city."),
  state: (value: string, hasStates: boolean) => (!hasStates || value ? "" : "Choose your state or province."),
  postalCode: (value: string, country: string) => {
    if (!isPostalCodeRequired(country)) return "";
    const rule = getPostalRule(country);
    if (!value.trim()) return "Enter your ZIP or postal code.";
    return rule.pattern.test(value.trim()) ? "" : `Enter a valid postal code${rule.example ? `, like ${rule.example}` : ""}.`;
  },
};
