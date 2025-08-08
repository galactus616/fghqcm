import i18n from '../i18n';
import useStore from '../store/useStore';

/**
 * Converts English numerals to Bengali numerals
 * @param {string|number} value - The number to convert
 * @returns {string} Bengali numeral representation
 */
export const toBengaliNumerals = (value) => {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return value.toString().replace(/[0-9]/g, (digit) => bengaliNumerals[parseInt(digit)]);
};

/**
 * Converts Bengali numerals to English numerals
 * @param {string} value - The Bengali numeral string
 * @returns {string} English numeral representation
 */
export const fromBengaliNumerals = (value) => {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return value.toString().replace(/[০-৯]/g, (digit) => bengaliNumerals.indexOf(digit).toString());
};

/**
 * Formats a number according to the current language
 * @param {number} value - The number to format
 * @param {string} language - The language to format for ('en' or 'bn')
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, language = 'en') => {
  if (language === 'bn') {
    return toBengaliNumerals(value.toLocaleString('en-IN'));
  }
  return value.toLocaleString('en-IN');
};

/**
 * Formats a price with currency symbol and proper number formatting
 * @param {number} price - The price to format
 * @param {string} language - The language to format for ('en' or 'bn')
 * @param {boolean} showCurrency - Whether to show currency symbol (default: true)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, language = 'en', showCurrency = true) => {
  const formattedNumber = formatNumber(price, language);
  const currencySymbol = language === 'bn' ? '৳' : 'Tk';
  
  if (!showCurrency) {
    return formattedNumber;
  }
  
  // In Bengali, currency symbol typically comes after the number
  if (language === 'bn') {
    return `${formattedNumber} ${currencySymbol}`;
  }
  
  return `${currencySymbol} ${formattedNumber}`;
};

/**
 * Returns the appropriate currency symbol based on the current language
 * @returns {string} Currency symbol (৳ for Bengali, Tk for English)
 */
export const getCurrencySymbol = () => {
  // Get language from store to prevent unnecessary re-renders
  const language = useStore.getState().language;
  return language === 'bn' ? '৳' : 'Tk';
};

/**
 * React hook that returns the current currency symbol and updates when language changes
 * @returns {string} Currency symbol (৳ for Bengali, Tk for English)
 */
export const useCurrencySymbol = () => {
  // This hook can be used in React components for reactive updates
  const language = useStore(state => state.language);
  return language === 'bn' ? '৳' : 'Tk';
};

/**
 * React hook that formats prices according to current language
 * @param {number} price - The price to format
 * @param {boolean} showCurrency - Whether to show currency symbol (default: true)
 * @returns {string} Formatted price string
 */
export const useFormattedPrice = (price, showCurrency = true) => {
  const language = useStore(state => state.language);
  return formatPrice(price, language, showCurrency);
};

/**
 * React hook that formats numbers according to current language
 * @param {number} value - The number to format
 * @returns {string} Formatted number string
 */
export const useFormattedNumber = (value) => {
  const language = useStore(state => state.language);
  return formatNumber(value, language);
};