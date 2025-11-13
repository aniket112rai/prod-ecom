// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/admin/AdminDashBoard";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageOrders from "./pages/admin/ManageOrders";
import ManageUsers from "./pages/admin/ManageUsers";
import { AdminRoute } from "./utils/AdminRoute";
import WishlistPage from "./pages/WishlistPage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import AddressPage from "./pages/AddressPage";
import OrdersPage from "./pages//orders/OrdersPage";
import OrderDetails from "./pages/orders/OrderDetails";
import PlaceOrder from "./pages//orders/PlaceOrder";
import UpdateOrderStatus from "./pages/orders/UpdateOrderStatus";
import CheckoutPage from "./pages/CheckoutPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentDetailsPage from "./pages/PaymentDetailsPage";

function App() {
  return (
    
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/addresses" element={<AddressPage />} />

        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/admin/order-status" element={<UpdateOrderStatus />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/:id" element={<PaymentDetailsPage />} />
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <ManageCategories />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
