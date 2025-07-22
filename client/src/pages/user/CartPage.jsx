import React from 'react'
import { useTranslation } from 'react-i18next';

const CartPage = () => {
  const { t } = useTranslation();
  return (
    <div>{t('cart_page')}</div>
  )
}

export default CartPage