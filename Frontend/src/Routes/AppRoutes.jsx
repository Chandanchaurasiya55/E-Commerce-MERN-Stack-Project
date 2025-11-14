import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CartPage from "../Pages/CartPage";
import UserAuth from "../pages/UserAuthForm";
import UserProfile from "../pages/UserProfile";



const AppRoutes = () => { 
  return (
    <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/auth" element={<UserAuth />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
      </Router>
    </div>
  )
}

export default AppRoutes