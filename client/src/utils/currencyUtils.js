import i18n from '../i18n';

/**
 * Returns the appropriate currency symbol based on the current language
 * @returns {string} Currency symbol (₹ for English, ৳ for Bengali)
 */
export const getCurrencySymbol = () => {
  return i18n.language === 'bn' ? '৳' : '₹';
};