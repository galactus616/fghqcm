import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-white border-t border-gray-100 py-12 w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="https://res.cloudinary.com/deepmitra/image/upload/v1753344029/qbd_logo_svg_onzssf.svg" alt="QBD Logo" className="h-[68px] object-contain p-1" draggable={false} />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {t('trusted_partner')}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-green-600 transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-600 transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-600 transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-600 transition-colors duration-200"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('quick_links')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('home')}
                </a>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('products')}
                </a>
              </li>
              <li>
                <a
                  href="/cart"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('my_cart')}
                </a>
              </li>
              <li>
                <a
                  href="/orders"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('my_orders')}
                </a>
              </li>
              <li>
                <a
                  href="/offers"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  Offers & Deals
                </a>
              </li>
            </ul>
          </div>

          {/* Partner With Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Partner With Us</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/store"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  Become a Store Partner
                </a>
              </li>
              <li>
                <a
                  href="/delivery-partner"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  Become a Delivery Partner
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('customer_service')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/help"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('help_center')}
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('contact_us')}
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('faq')}
                </a>
              </li>
              <li>
                <a
                  href="/returns"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('returns_refunds')}
                </a>
              </li>
              <li>
                <a
                  href="/track"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('track_order')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('contact_info')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-600" />
                <span className="text-gray-600 text-sm">
                  info@forgehivesolutions.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="text-gray-600 text-sm">+91 9073098038</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-gray-600 text-sm">
                  Dumdum, Kolkata
                </span>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-gray-500 text-xs">
                {t('available_24_7')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © 2025 QBD. {t('all_rights_reserved')}
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="/privacy"
                className="text-gray-500 hover:text-green-600 transition-colors duration-200 text-sm"
              >
                {t('privacy_policy')}
              </a>
              <a
                href="/terms"
                className="text-gray-500 hover:text-green-600 transition-colors duration-200 text-sm"
              >
                {t('terms_of_service')}
              </a>
              <a
                href="/cookies"
                className="text-gray-500 hover:text-green-600 transition-colors duration-200 text-sm"
              >
                {t('cookie_policy')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
