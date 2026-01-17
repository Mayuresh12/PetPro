import { Routes, Route, Navigate } from "react-router-dom";
import SupplierLogin from "./auth/SupplierLogin";
import SupplierDashboard from "./SupplierDashboard";
import CustomerLanding from "./CustomerLanding";
import { supabase } from "./lib/supabase";
import { useEffect, useState } from "react";

export default function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  console.log("----> AppRoutes render START");
  console.log("----> Current session:", session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("----> getSession:", data.session);
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("----> Auth change:", event);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    console.log("----> Loading routes");
    return <div>Loading…</div>;
  }

  console.log("----> Rendering ROUTES");

  return (
    <Routes>
      {/* CUSTOMER */}
      <Route path="/" element={<CustomerLanding />} />

      {/* SUPPLIER */}
      <Route
        path="/supplier/login"
        element={
          session ? (
            <Navigate to="/supplier/dashboard" replace />
          ) : (
            <SupplierLogin />
          )
        }
      />

      <Route
        path="/supplier/dashboard"
        element={
          session ? (
            <SupplierDashboard />
          ) : (
            <Navigate to="/supplier/login" replace />
          )
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}