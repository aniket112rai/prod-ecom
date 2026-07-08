
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { ReviewProvider } from "./context/ReviewContext";
createRoot(document.getElementById('root')).render(
  <WishlistProvider>
    <CartProvider>
      <ReviewProvider>
        <App /> 
      </ReviewProvider>
    </CartProvider>
  </WishlistProvider>
    
  
)
