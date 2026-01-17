import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [selectedService, setSelectedService] = useState("Dog Grooming");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const city = "Nagpur";
  const [loading, setLoading] = useState(false);

  /* 🔒 Lock background scroll */
  useEffect(() => {
    document.body.style.overflow = isBookingOpen ? "hidden" : "auto";
  }, [isBookingOpen]);

  /* ✨ Fade-in animation */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("show")
        ),
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* 🚀 Open booking directly (NO LOGIN) */
  const openBookingFlow = () => {
    setIsBookingOpen(true);
  };

  /* ✅ Confirm booking (guest) */
  const handleConfirmBooking = async () => {
if (!firstName || !lastName || !address || !phone || !date) {
  alert("Please fill all fields");
  return;
}

    setLoading(true);

    const { error } = await supabase.from("bookings").insert({
        service_type: selectedService,
        customer_name: `${firstName} ${lastName}`,
        phone,
        address,
        city,
        preferred_date: date,
        status: "pending",
      });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Booking failed. Try again.");
      return;
    }

    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen font-sans bg-yellow-100 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/favicon/petpro-icon.png" className="w-7 h-7" />
            <span className="text-xl font-extrabold text-purple-700">PetPro</span>
          </div>

          <button
            onClick={openBookingFlow}
            className="px-6 py-2 bg-purple-700 text-white rounded-lg font-semibold
            hover:bg-purple-800 hover:scale-[1.02] transition"
          >
            Book Now
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="bg-yellow-200 py-32 text-center fade-in">
        <div className="max-w-3xl mx-auto px-6">
          <img
            src="/favicon/petpro-icon.png"
            className="mx-auto mb-6 w-16 h-16 opacity-90"
          />

          <h2 className="text-5xl md:text-6xl font-extrabold">
            Stress-Free Pet Grooming
            <span className="block mt-3 text-purple-700">
              At Your Doorstep
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-700">
            Professional at-home grooming for dogs and cats.
            <br />
            No travel. No cages. No stress.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={openBookingFlow}
              className="px-8 py-4 bg-purple-700 text-white rounded-xl font-bold shadow
              hover:bg-purple-800 hover:scale-[1.02] transition"
            >
              Book a Grooming
            </button>

            <button
              onClick={() =>
                document.getElementById("services")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="px-8 py-4 bg-white text-purple-700 border-2 border-purple-600 rounded-xl font-bold
              hover:bg-purple-50 hover:scale-[1.02] transition"
            >
              View Services
            </button>
          </div>
        </div>
      </section>

            {/* ================= SERVICES ================= */}
            <section id="services" className="bg-yellow-100 py-24 fade-in">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center">Our Services</h3>
          <p className="mt-3 text-center text-slate-600">
            Grooming & training designed for comfort, hygiene, and happiness.
          </p>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ["🐶 Dog Grooming", "Complete grooming for dogs of all breeds and sizes."],
              ["🐱 Cat Grooming", "Gentle grooming tailored for feline comfort."],
              ["🛁 Bath & Trim", "Quick refresh with bath, nails, and coat trim."],
              ["🐕 Pet Training", "Basic obedience and behavior training at home."]
            ].map(([title, desc]) => (
              <div
                key={title}
                onClick={() => {
                  setSelectedService(title.replace(/^[^ ]+ /, ""));
                  setIsBookingOpen(true);
                }}
                className="bg-white rounded-2xl p-8 shadow cursor-pointer
                hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]
                transition transform"
              >
                <h4 className="text-xl font-bold text-purple-700">{title}</h4>
                <p className="mt-3 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-white py-24 fade-in">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-center">How It Works</h3>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              ["01", "Choose Date", "Pick a convenient grooming date."],
              ["02", "Select Service", "Dog, cat, or bath & trim."],
              ["03", "We Come Home", "A groomer arrives at your doorstep."],
            ].map(([step, title, desc]) => (
              <div key={step} className="bg-yellow-100 rounded-2xl p-8 text-center">
                <div className="text-4xl font-extrabold text-purple-600">
                  {step}
                </div>
                <h4 className="mt-3 font-bold">{title}</h4>
                <p className="mt-2 text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-purple-700 py-20 text-center text-white fade-in">
        <h3 className="text-4xl font-extrabold">Ready to Book?</h3>
        <p className="mt-4 text-purple-100">We’ll take care of your pet.</p>
        <button
          onClick={openBookingFlow}
          className="mt-8 px-12 py-4 bg-white text-purple-700 rounded-xl font-bold"
        >
          Book Now
        </button>
      </section>

      {/* ================= BOOKING MODAL ================= */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">

            <button
onClick={() => {
    setIsBookingOpen(false);
    setBookingSuccess(false);
    setFirstName("");
    setLastName("");
    setAddress("");
    setPhone("");
    setDate("");
  }}
              className="absolute top-4 right-4 text-xl"
            >
              ×
            </button>

            {bookingSuccess ? (
              <div className="text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-extrabold text-purple-700">
                  Booking Confirmed
                </h3>
                <p className="mt-2 text-slate-600">
                  A provider will contact you shortly.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-extrabold text-purple-700 mb-4">
                  Book a Grooming
                </h3>

                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full mb-4 p-3 border rounded-lg"
                >
                  <option>Dog Grooming</option>
                  <option>Cat Grooming</option>
                  <option>Bath & Trim</option>
                  <option>Pet Training</option>
                </select>

                <input
  className="w-full mb-4 p-3 border rounded-lg"
  placeholder="First Name"
  value={firstName}
  onChange={(e) => setFirstName(e.target.value)}
/>

<input
  className="w-full mb-4 p-3 border rounded-lg"
  placeholder="Last Name"
  value={lastName}
  onChange={(e) => setLastName(e.target.value)}
/>

                <input
                  type="date"
                  className="w-full mb-4 p-3 border rounded-lg"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <input
                  className="w-full mb-4 p-3 border rounded-lg"
                  placeholder="Your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <input
                  className="w-full mb-4 p-3 border rounded-lg"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="w-full mt-4 py-4 bg-purple-700 text-white rounded-xl font-bold"
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
        © 2026 PetPro · At-home pet grooming
      </footer>
    </div>
  );
}