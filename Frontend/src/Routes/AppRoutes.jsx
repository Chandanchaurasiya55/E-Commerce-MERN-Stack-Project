import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Home from "../pages/Home";
import CartPage from "../pages/CartPage";
import AuthForm from "../pages/AuthForm";
import UserProfile from "../pages/UserProfile";
import SellerUpload from "../pages/SellerUpload";
import AdminDashboard from "../pages/AdminDashboard";
import AdminOrders from "../pages/AdminOrders";
import Orders from "../pages/Orders";
import CheckoutPage from "../pages/CheckoutPage";
import ProtectedAdminRoute from "../Components/ProtectedAdminRoute";



import Footer from "../Components/Footer.jsx";
import { useLocation } from 'react-router-dom';

const AppRoutes = () => {
  // FooterOnHome must read location inside Router context
  const FooterOnHome = () => {
    const location = useLocation();
    return location.pathname === '/' ? <Footer /> : null;
  };

  return (
    <div className="app-root">
      <Router>
        <Routes>
          {/* Full-width home route (renders outside the centered site-container) */}
          <Route path="/" element={<Home />} />

          {/* All other routes use a centered container layout */}
          <Route element={<div className="site-container"><Outlet /></div>}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/seller" element={<ProtectedAdminRoute><SellerUpload /></ProtectedAdminRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
            <Route path="/admin-orders" element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Routes>

        {/* show global site footer only on Home page */}
        <FooterOnHome />
      </Router>
    </div>
  )
}

export default AppRoutes