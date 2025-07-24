import React from 'react'
import { useTranslation } from 'react-i18next';

const CartPage = () => {
  const { t } = useTranslation();
  return (
    <div className="font-sans bg-[#0a614d]/5 min-h-screen pb-10">
      <div>{t('cart_page')}</div>
    </div>
  )
}

export default CartPage