import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/homePage";
import ShoppingCart from "../pages/shoppingCart";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;