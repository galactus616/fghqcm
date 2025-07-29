import { Routes, Route } from "react-router-dom";
import UserLayout from "./Layouts/UserLayout";
import HomePage from "./pages/user/HomePage";
// import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import CategoryPage from "./pages/user/CategoryPage";
import SearchResultPage from "./pages/user/SearchResultPage";
import OrdersPage from "./pages/user/OrdersPage";
import OrderSuccessPage from "./pages/user/OrderSuccessPage";
import ScrollToTop from "./components/user/ScrollToTop";
import ProductDetailsPage from "./pages/user/ProductDetailsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AccountPage from "./pages/user/AccountPage";
import React, { useEffect } from "react";
import useStore from "./store/useStore";
import useStoreOwner from "./store/useStoreOwner";
import AddressModal from "./components/common/AddressModal";

// Store onboarding imports
import LandingPage from "./pages/store/LandingPage";
import StoreLayout from "./Layouts/StoreLayout";
import MultiStepKycForm from "./components/store/MultiStepKycForm";
import StoreOwnerProtectedRoute from "./components/common/StoreOwnerProtectedRoute";
import StoreProducts from "./components/store/Store_Components/StoreProducts";
import Inventory from "./components/store/Store_Components/Inventory";
import StoreOrder from "./components/store/Store_Components/StoreOrder";
import StoreFinances from "./components/store/Store_Components/StoreFinances";
import StoreAccount from "./components/store/Store_Components/StoreAccount";
import StoreDashboard from "./components/store/Store_Components/StoreDashboard";
// Placeholder components for other sections

function App() {
  const { fetchProfile } = useStore();
  const { fetchStoreOwnerProfile } = useStoreOwner();
  useEffect(() => {
    fetchProfile();
    fetchStoreOwnerProfile();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* User routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          {/* <Route path="cart" element={<CartPage />} /> */}
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="product/:productId" element={<ProductDetailsPage />} />
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Store onboarding/flow routes */}
        <Route path="/store" element={<LandingPage />} />
        {/* KYC route is separate and not inside StoreLayout */}
        <Route
          path="/store/dashboard/kyc"
          element={
            <StoreOwnerProtectedRoute>
              <MultiStepKycForm />
            </StoreOwnerProtectedRoute>
          }
        />
        {/* All other dashboard routes use StoreLayout and are protected */}
        <Route path="/store/dashboard" element={<StoreLayout />}>
          <Route path="dashboard" element={<StoreDashboard />} />
          <Route path="store_products" element={<StoreProducts />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="store_orders" element={<StoreOrder />} />
          <Route path="finances" element={<StoreFinances />} />
          <Route path="store_account" element={<StoreAccount />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;