import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

// Import Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageParams, setPageParams] = useState({});
  const { loading: authLoading } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    if (page === "home" && params.searchQuery) {
      setSearchQuery(params.searchQuery);
    }
  };

  useEffect(() => {
    const navHandler = (e) => {
      if (e.detail && e.detail.page) {
        setCurrentPage(e.detail.page);
        setPageParams({});
      }
    };
    const searchHandler = (e) => {
      if (e.detail && e.detail.query !== undefined) {
        setCurrentPage("home");
        setPageParams({ searchQuery: e.detail.query });
        setSearchQuery(e.detail.query);
      }
    };
    window.addEventListener("navigate", navHandler);
    window.addEventListener("search", searchHandler);
    return () => {
      window.removeEventListener("navigate", navHandler);
      window.removeEventListener("search", searchHandler);
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-700 text-xl font-inter">
        Loading SwiftCart...
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            navigate={navigate}
            searchQuery={searchQuery || pageParams.searchQuery}
          />
        );
      case "login":
        return <LoginPage navigate={navigate} />;
      case "register":
        return <RegisterPage navigate={navigate} />;
      case "productDetail":
        return <ProductDetailPage navigate={navigate} params={pageParams} />;
      case "cart":
        return <CartPage navigate={navigate} />;
      case "checkout":
        return <CheckoutPage navigate={navigate} />;
      case "orderConfirmation":
        return (
          <OrderConfirmationPage navigate={navigate} params={pageParams} />
        );
      case "categoryProducts":
        return <CategoryProductsPage navigate={navigate} params={pageParams} />;
      case "dashboard":
        return <UserDashboardPage navigate={navigate} />;
      case "orderHistory":
        return <OrderHistoryPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <div className="bg-transparent min-h-screen font-inter">{renderPage()}</div>
  );
};

export default App;
