const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MIN_PASSWORD_LENGTH = 8;

export const validateEmail = (email: string) => {
  if (!email.trim()) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address.";
  return "";
};

export const validatePassword = (password: string) => {
  if (!password) return "Enter your password.";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return "";
};

export const validateRequired = (value: string, label: string) =>
  value.trim() ? "" : `Enter your ${label}.`;

export const validatePasswordMatch = (password: string, confirmation: string) => {
  if (!confirmation) return "Confirm your password.";
  return password === confirmation ? "" : "Passwords don't match.";
};
