import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/homePage";
import ShoppingCart from "../pages/shoppingCart";
import CollectionPage from "../pages/collectionPage";
import SalePage from "../pages/salePage";
import ProductPage from "../pages/ProductPage";
// import LoginPage from "../pages/loginPage";
// import RegisterPage from "../pages/registerPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          <Route path="/" element={<Home />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />

          <Route path="/product/:id" element={<ProductPage />} />
          <Route
            path="/women"
            element={
              <CollectionPage
                gender="women"
                title="Women"
                subtitle="High-performance women's sportswear — engineered for every move."
              />
            }
          />
          <Route
            path="/men"
            element={
              <CollectionPage
                gender="men"
                title="Men"
                subtitle="Built tough, designed sharp — gear up and push your limits."
              />
            }
          />
          <Route
            path="/running"
            element={
              <CollectionPage
                category="Running"
                title="Running"
                subtitle="Lightweight, breathable, built for every kilometre."
              />
            }
          />
          <Route
            path="/basketball"
            element={
              <CollectionPage
                category="Basketball"
                title="Basketball"
                subtitle="Own the court. Every step counts."
              />
            }
          />
          <Route
            path="/football"
            element={
              <CollectionPage
                category="Football"
                title="Football"
                subtitle="Speed. Skill. Passion — the pitch is yours."
              />
            }
          />
          <Route
            path="/gym"
            element={
              <CollectionPage
                category="Gym"
                title="Gym & Training"
                subtitle="Elite training gear — level up every session."
              />
            }
          />
          <Route
            path="/apparel"
            element={
              <CollectionPage
                category="Apparel"
                title="Apparel"
                subtitle="Sport apparel for every activity, every style."
              />
            }
          />
          <Route
            path="/footwear"
            element={
              <CollectionPage
                category="Footwear"
                title="Footwear"
                subtitle="Athletic footwear — the foundation of every victory."
              />
            }
          />
          <Route
            path="/gear"
            element={
              <CollectionPage
                category="Gear"
                title="Gear & Equipment"
                subtitle="Pro-grade equipment for serious athletes."
              />
            }
          />

          <Route path="/sale" element={<SalePage />} />

        </Route>
        {/* <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;