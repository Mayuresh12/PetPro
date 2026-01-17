import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

/* ================= TYPES ================= */

type BookingStatus = "pending" | "accepted";

interface Booking {
  id: string;
  service_type: string;
  customer_name: string; // ✅ ADD THIS
  address: string;
  city: string;
  phone: string;
  status: BookingStatus;
  supplier_id: string | null;
  created_at: string;
}

/* ================= COMPONENT ================= */

export default function SupplierDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [supplierId, setSupplierId] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<BookingStatus>("pending");
  const [pendingCount, setPendingCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return setLoading(false);

      const { data: supplier } = await supabase
        .from("providers")
        .select("id, name")
        .eq("user_id", auth.user.id)
        .single();

      if (!supplier) return setLoading(false);

      setSupplierId(supplier.id);
      setSupplierName(supplier.name);

      // ✅ Fetch pending + my accepted
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .or(`status.eq.pending,and(status.eq.accepted,supplier_id.eq.${supplier.id})`)
        .order("created_at", { ascending: false });

      setBookings(data ?? []);
      setPendingCount(
        data?.filter((b) => b.status === "pending").length ?? 0
      );

      setLoading(false);
    };

    load();
  }, []);

  /* ================= ACCEPT ================= */

  const acceptBooking = async (id: string) => {
    if (!supplierId) return;

    const { error } = await supabase
      .from("bookings")
      .update({
        status: "accepted",
        supplier_id: supplierId,
      })
      .eq("id", id)
      .eq("status", "pending"); // race-safe

    if (error) {
      alert("Booking already taken by another supplier");
      return;
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: "accepted", supplier_id: supplierId }
          : b
      )
    );

    setPendingCount((c) => Math.max(c - 1, 0));
  };

  /* ================= FILTER ================= */

  const filteredBookings = useMemo(() => {
    if (activeTab === "pending") {
      return bookings.filter((b) => b.status === "pending");
    }
    return bookings.filter(
      (b) => b.status === "accepted" && b.supplier_id === supplierId
    );
  }, [bookings, activeTab, supplierId]);

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-100">
{/* ================= HEADER ================= */}
<header className="bg-white border-b sticky top-0 z-50">
  <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
    
    {/* Left: Title */}
    <h1 className="text-xl font-extrabold text-purple-700">
      PetPro · Supplier Dashboard
    </h1>

    {/* Right: Bell + User */}
    <div className="flex items-center gap-6">

      {/* 🔔 Pending Count */}
      <div className="relative text-xl cursor-pointer">
        🔔
        {pendingCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            {pendingCount}
          </span>
        )}
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu((v) => !v)}
          className="text-sm font-medium"
        >
          Welcome,&nbsp;
          <span className="font-bold text-purple-700">
            {supplierName}
          </span>{" "}
          👋
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow border">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </div>
  </div>
</header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {(["pending", "accepted"] as BookingStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-purple-700 text-white"
                  : "bg-white border"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && <p>Loading…</p>}
        {!loading && filteredBookings.length === 0 && (
          <p>No {activeTab} bookings.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((b) => (
            <div key={b.id} className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-purple-700">{b.service_type}</h3>
              <p className="mt-1 font-semibold text-slate-800">👤 {b.customer_name}</p>
              <p>📍 {b.address}, {b.city}</p>
              <p>📞 {b.phone}</p>

              {b.status === "pending" && (
                <button
                  onClick={() => acceptBooking(b.id)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded"
                >
                  Accept
                </button>
              )}

              {b.status === "accepted" && (
                <p className="mt-4 text-green-600 font-semibold">
                  ✅ Accepted
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}