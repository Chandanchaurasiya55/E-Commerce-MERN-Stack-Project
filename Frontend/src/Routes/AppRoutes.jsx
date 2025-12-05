import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CartPage from "../pages/CartPage";
import AuthForm from "../pages/AuthForm";
import UserProfile from "../pages/UserProfile";
import SellerUpload from "../pages/SellerUpload";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedAdminRoute from "../Components/ProtectedAdminRoute";



const AppRoutes = () => { 
  return (
    <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/seller" element={<ProtectedAdminRoute><SellerUpload /></ProtectedAdminRoute>} />
            <Route path="/admin-dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
          </Routes>
      </Router>
    </div>
  )
}

export default AppRoutes