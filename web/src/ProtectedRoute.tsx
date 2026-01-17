import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("----> ProtectedRoute session:", data.session);
      setIsAuthed(!!data.session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-10">Checking session...</div>;
  }

  if (!isAuthed) {
    console.log("----> No session, redirecting to login");
    return <Navigate to="/supplier/login" replace />;
  }

  return children;
}