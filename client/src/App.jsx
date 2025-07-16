import { Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layouts/UserLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CategoryPage from "./pages/CategoryPage";
import SearchResultPage from './pages/SearchResultPage';
import OrdersPage from "./pages/OrdersPage";
import OrderSuccessPage from './pages/OrderSuccessPage';
import ScrollToTop from './components/ScrollToTop';
import ProductDetailsPage from "./pages/ProductDetailsPage";
import { useEffect } from "react";
import useStore from "./store/useStore";

function App() {
  const { fetchProfile } = useStore();
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetailsPage/>}/>
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="category/:categoryId" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
