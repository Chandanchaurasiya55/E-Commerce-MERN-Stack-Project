import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CartPage from "../Pages/CartPage";
import UserAuth from "../Pages/UserAuthForm";
import SellerDashboard from "../pages/SellerDashbord";
import UserProfile from "../pages/UserProfile";
import SellerAuthForm from "../pages/SellerAuthForm";

const AppRoutes = () => { 
  return (
    <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth" element={<UserAuth />} />
            <Route path="/seller-auth" element={<SellerAuthForm />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
          </Routes>
      </Router>
    </div>
  )
}

export default AppRoutes