import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Camera, User, Mail, Building, ChevronDown } from "lucide-react";

export const SUBJECT_DEFAULTS = [
  "None", "OOP", "Databases", "Calculus", "Data Structures", "Linear Algebra", "Discrete Math",
];

export function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex w-10 h-5.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 ${on ? "bg-primary" : "bg-muted"}`}
      style={{ height: "22px", width: "40px" }}
    >
      <span
        className={`pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-[18px]" : "translate-x-0"}`}
      />
    </button>
  );
}

export interface SettingsMainProps {
  currentUser: any;
  onUpdateUser: (u: any) => void;
}

export function SettingsMain({ currentUser, onUpdateUser }: SettingsMainProps) {
  const [name, setName] = useState(currentUser?.fullName || "Raúl Andrade");
  const [email, setEmail] = useState(currentUser?.email || "r.andrade@ufrontera.cl");
  const [institution, setInstitution] = useState("Universidad de La Frontera");

  const [emailRemind, setEmailRemind] = useState(true);
  const [defaultSubj, setDefaultSubj] = useState("OOP");

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.fullName || "");
      setEmail(currentUser.email || "");
    }
  }, [currentUser]);

  const initials = name
    ? (() => {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      })()
    : "US";

  const handleSaveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Por favor completa los campos de nombre y correo.");
      return;
    }
    try {
      const res = await fetch('/api/usuarios/actualizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser?.id,
          fullName: name,
          email: email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar el perfil.");
      }

      onUpdateUser(data);
      toast.success("¡Perfil actualizado con éxito!");
    } catch (error: any) {
      console.error("Save profile error", error);
      toast.error(error.message || "Error al actualizar el perfil.");
    }
  };

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8">
      {/* Header */}
      <section className="mb-8">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">Account</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Settings & Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account info and AI preferences.</p>
      </section>

      <div className="grid grid-cols-5 gap-6 items-start">
        {/* Left: Profile Card */}
        <section aria-label="User profile" className="col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-foreground">Profile</h2>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-md">
                <span className="text-2xl font-extrabold text-white">{initials}</span>
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-card border border-border rounded-full shadow hover:bg-muted transition">
                <Camera className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            <button className="text-xs font-semibold text-muted-foreground border border-border rounded-xl px-3 py-1.5 hover:bg-muted transition">
              Update Profile Photo
            </button>
          </div>

          <div className="h-px bg-border" />

          {/* Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                <User className="w-3 h-3" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                <Mail className="w-3 h-3" /> University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                <Building className="w-3 h-3" /> Academic Institution
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>
          </div>

          <button onClick={handleSaveProfile} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all">
            Save Changes
          </button>
        </section>

        {/* Right: Config Card */}
        <section aria-label="App configurations" className="col-span-3 space-y-4">
          {/* Section B: Preferences */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-foreground">Preferences</h2>

            {/* Toggle rows */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">Email Quiz Reminders</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Receive daily study reminder emails</p>
                </div>
                <Toggle on={emailRemind} onToggle={() => setEmailRemind(!emailRemind)} />
              </div>

              {/* Default subject dropdown */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Default Notes Subject</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Pre-select subject when creating a note</p>
                </div>
                <div className="relative">
                  <select
                    value={defaultSubj}
                    onChange={(e) => setDefaultSubj(e.target.value)}
                    className="pl-3 pr-7 py-2 text-sm bg-muted border border-border rounded-xl text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer font-medium transition"
                  >
                    {SUBJECT_DEFAULTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all">
              Save Preferences
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
