import i18n from '../i18n';
import useStore from '../store/useStore';

/**
 * Returns the appropriate currency symbol based on the current language
 * @returns {string} Currency symbol (₹ for English, ৳ for Bengali)
 */
export const getCurrencySymbol = () => {
  // Get language from store to prevent unnecessary re-renders
  const language = useStore.getState().language;
  return language === 'bn' ? '৳' : 'Tk';
};

/**
 * React hook that returns the current currency symbol and updates when language changes
 * @returns {string} Currency symbol (₹ for English, ৳ for Bengali)
 */
export const useCurrencySymbol = () => {
  // This hook can be used in React components for reactive updates
  const language = useStore(state => state.language);
  return language === 'bn' ? '৳' : 'Tk';
};