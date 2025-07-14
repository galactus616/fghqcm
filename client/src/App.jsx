import { Routes, Route } from "react-router-dom";
import UserLayout from "./components/Layouts/UserLayout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
