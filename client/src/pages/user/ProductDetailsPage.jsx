import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProductsByCategory } from "../../api/user/products";
import { Star, ShieldCheck, Truck, MessageSquareQuote } from "lucide-react";
import toast from "react-hot-toast";
import useStore from "../../store/useStore";
import { useTranslation } from "react-i18next";
import ProductImageGallery from "../../components/user/ProductImageGallery";
import ProductInfo from "../../components/user/ProductInfo";
import RelatedProducts from "../../components/user/RelatedProducts";
import Breadcrumbs from "../../components/common/Breadcrumbs";
import ProductDetailsGrid from "../../components/user/ProductDetailsGrid";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [related, setRelated] = useState([]);
  const {
    addToCart,
    hydratedItems: cartItems,
    updateCartItem,
    removeFromCart,
  } = useStore();
  const { t } = useTranslation();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProduct(null);
    setSelectedVariantIdx(0);
    setSelectedImageIdx(0);

    getProductById(productId)
      .then((data) => {
        setProduct(data);
        if (data.category && (data.category.id || data.category._id)) {
          getProductsByCategory(data.category.id || data.category._id).then(
            (rel) => {
              setRelated(
                rel
                  .filter((p) => (p.id || p._id) !== (data.id || data._id))
                  .slice(0, 10)
              );
            }
          );
        }
      })
      .catch(() => setError(t("product_not_found")))
      .finally(() => setLoading(false));
  }, [productId, t]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center text-gray-500">
        {t("loading")}
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        {error}
      </div>
    );
  }
  if (!product) {
    return null;
  }

  const breadcrumbItems = [
    { name: t("home"), link: "/" },
    {
      name: product.mainCategory?.name || product.category?.name || t("categories"),
      link: product.mainCategory?.id || product.mainCategory?._id || product.category?.id || product.category?._id
        ? `/category/${product.mainCategory?.id || product.mainCategory?._id || product.category?.id || product.category?._id}`
        : "/#categories",
    },
    { name: product.name },
  ];

  const cartItem = cartItems.find(
    (item) =>
      item.productId === (product.id || product._id) &&
      item.variantIndex === selectedVariantIdx
  );

  const handleAddToCart = () => {
    try {
      addToCart({
        productId: product.id || product._id,
        variantIndex: selectedVariantIdx,
        quantity: 1,
      });
      toast.success(t("added_to_cart"));
    } catch {
      toast.error(t("failed_to_add_to_cart"));
    }
  };

  const handleIncrease = () => {
    if (cartItem) {
      updateCartItem(
        cartItem.productId,
        cartItem.variantIndex,
        cartItem.quantity + 1
      );
    }
  };

  const handleDecrease = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateCartItem(
          cartItem.productId,
          cartItem.variantIndex,
          cartItem.quantity - 1
        );
      } else {
        removeFromCart(cartItem.productId, cartItem.variantIndex);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white p-8 rounded-xl shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ProductImageGallery
              images={product.images || [product.imageUrl]}
              productName={product.name}
              selectedImageIdx={selectedImageIdx}
              setSelectedImageIdx={setSelectedImageIdx}
            />
            <ProductInfo
              product={product}
              selectedVariantIdx={selectedVariantIdx}
              setSelectedVariantIdx={setSelectedVariantIdx}
              cartItem={cartItem}
              handleAddToCart={handleAddToCart}
              handleIncrease={handleIncrease}
              handleDecrease={handleDecrease}
            />
          </div>
        </div>
        <ProductDetailsGrid product={product} />
        <RelatedProducts products={related} />
      </div>
    </div>
  );
};

export default ProductDetailsPage;
