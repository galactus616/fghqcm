import { Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layouts/UserLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CategoryPage from "./pages/CategoryPage";
import SearchResultPage from './pages/SearchResultPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="category/:categoryId" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResultPage />} />
      </Route>
    </Routes>
  );
}

export default App;
