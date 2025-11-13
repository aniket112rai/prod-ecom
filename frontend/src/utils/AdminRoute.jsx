// frontend/src/utils/AdminRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await axios.get("https://prod-ecom-backend.onrender.com/api/auth/me", {
          withCredentials: true, // send cookies automatically
        });

        if (data.role === "admin" || data.user?.role === "admin") {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return <Navigate to="/login" replace />;

  return children;
};
