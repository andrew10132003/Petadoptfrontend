import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

type ProfileData = { name: string; email: string; phone: string; address: string };

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProfileData>({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    api.get("/profile/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        const user = data.user;
        setForm({ name: user.name || "", email: user.email || "", phone: user.phone || "", address: user.address || "" });
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load your profile."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setSuccess("");
    if (form.name.trim().length < 2) { setError("Name must contain at least 2 characters."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) { setError("Enter a valid email address."); return; }
    if (!/^[+\d][\d\s()-]{7,19}$/.test(form.phone.trim())) { setError("Enter a valid phone number."); return; }
    if (form.address.trim().length < 5) { setError("Address must contain at least 5 characters."); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.patch("/profile/me", form, { headers: { Authorization: `Bearer ${token}` } });
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChanged"));
      setSuccess(data.message || "Profile updated.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally { setSaving(false); }
  };

  if (loading) return <p className="py-20 text-center">Loading profile...</p>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Keep your contact details up to date.</p>
        {error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
        {success && <p role="status" className="mt-5 rounded-lg bg-green-50 p-3 text-green-700">{success}</p>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Full name
            <input required minLength={2} maxLength={80} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border p-3" />
          </label>
          <label className="block text-sm font-medium">Email
            <input required type="email" maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg border p-3" />
          </label>
          <label className="block text-sm font-medium">Phone
            <input required type="tel" minLength={8} maxLength={20} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-lg border p-3" />
          </label>
          <label className="block text-sm font-medium">Address
            <textarea required minLength={5} maxLength={300} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1 w-full rounded-lg border p-3" rows={3} />
          </label>
          <button disabled={saving} className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>
    </main>
  );
}
