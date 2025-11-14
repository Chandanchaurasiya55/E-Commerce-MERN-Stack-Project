import './App.css'
import AppRoute from "./Routes/AppRoutes.jsx";  
import { CartProvider } from "./Context/CartContext.jsx";
import Footer from "./Components/Footer.jsx";


function App() {
 
  return (
    <div>
      <CartProvider>
        <AppRoute />
        <Footer />
      </CartProvider>
      
    </div>
  )
}

export default App
