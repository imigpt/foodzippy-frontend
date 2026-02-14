export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateMobileNumber = (mobile: string): boolean => {
  const cleanedMobile = mobile.replace(/\D/g, '');
  return cleanedMobile.length === 10 && /^\d{10}$/.test(cleanedMobile);
};

export const validateGSTNumber = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.toUpperCase());
};

export const validateFSSAINumber = (fssai: string): boolean => {
  const cleanedFSSAI = fssai.replace(/\D/g, '');
  return cleanedFSSAI.length === 14 && /^\d{14}$/.test(cleanedFSSAI);
};

export const validateRequiredField = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateYear = (year: string): boolean => {
  if (!year.trim()) return false;
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  return yearNum >= 1900 && yearNum <= currentYear;
};

export const validateNumber = (value: string): boolean => {
  if (!value.trim()) return false;
  return /^\d+$/.test(value.trim());
};

export const validateDate = (date: string): boolean => {
  return date.trim().length > 0;
};

export const validateDropdown = (value: string): boolean => {
  return value.trim().length > 0;
};
