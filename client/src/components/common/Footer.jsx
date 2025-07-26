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
import { Link } from "react-router-dom";
import Modal from "./Modal";
import { useState } from "react";

const Footer = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
  });

  const openModal = (titleKey, contentKey) => {
    setModalContent({
      title: t(titleKey),
      content: t(contentKey),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({ title: "", content: "" });
  };
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
              {/* <li>
                <a
                  href="/products"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('products')}
                </a>
              </li> */}
              <li>
                <Link
                  to="/checkout"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('my_cart')}
                </Link>
              </li>
              <li>
                <Link
                  to="/orders"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('my_orders')}
                </Link>
              </li>
              {/* <li>
                <a
                  href="/offers"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  Offers & Deals
                </a>
              </li> */}
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
                <button
                  onClick={() => openModal('help_center', 'help_center_content')}
                  className=" cursor-pointer text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm text-left w-full"
                >
                  {t('help_center')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('contact_us', 'contact_us_content')}
                  className=" cursor-pointer text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm text-left w-full"
                >
                  {t('contact_us')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('faq', 'faq_content')}
                  className=" cursor-pointer text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm text-left w-full"
                >
                  {t('faq')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('returns_refunds', 'returns_refunds_content')}
                  className=" cursor-pointer text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm text-left w-full"
                >
                  {t('returns_refunds')}
                </button>
              </li>
              {/* <li>
                <a
                  href="/track"
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 text-sm"
                >
                  {t('track_order')}
                </a>
              </li> */}
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
                
                <a href="mailto:info@forgehivesolutions.com" className="text-gray-600 text-sm hover:text-green-600 transition-colors duration-200">info@forgehivesolutions.com</a>  
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

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalContent.title}
        >
          <div className="space-y-4">
            <div className="prose prose-sm max-w-none">
              {modalContent.content.split('\n').map((line, index) => {
                if (line.trim().startsWith('•')) {
                  return (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{line.substring(1).trim()}</span>
                    </div>
                  );
                } else if (line.trim().startsWith('✅') || line.trim().startsWith('⏰') || line.trim().startsWith('📋') || line.trim().startsWith('💰') || line.trim().startsWith('❌')) {
                  return (
                    <div key={index} className="font-semibold text-gray-800 mt-4">
                      {line}
                    </div>
                  );
                } else if (line.trim().startsWith('Q:') || line.trim().startsWith('প্র:')) {
                  return (
                    <div key={index} className="font-semibold text-gray-800 mt-4">
                      {line}
                    </div>
                  );
                } else if (line.trim().startsWith('A:') || line.trim().startsWith('উ:')) {
                  return (
                    <div key={index} className="ml-4 text-gray-600 mb-2">
                      {line}
                    </div>
                  );
                } else if (line.trim().startsWith('📧') || line.trim().startsWith('📞') || line.trim().startsWith('📍')) {
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <span>{line.substring(0, 2)}</span>
                      <span>{line.substring(2)}</span>
                    </div>
                  );
                } else if (line.trim() === '') {
                  return <div key={index} className="h-2"></div>;
                } else {
                  return <div key={index}>{line}</div>;
                }
              })}
            </div>
          </div>
        </Modal>

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
