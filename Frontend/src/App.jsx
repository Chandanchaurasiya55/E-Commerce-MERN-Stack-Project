import './App.css'
import AppRoute from "./Routes/AppRoutes.jsx";  
import { CartProvider } from "./Context/CartContext.jsx";


function App() {
 
  return (
    <div>
      <CartProvider>
        <AppRoute />
      </CartProvider>
      
    </div>
  )
}

export default App
