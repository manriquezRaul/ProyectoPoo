import React, { useState } from "react";
import { toast } from "sonner";
import { 
  FileText, Trash2, Mail
} from "lucide-react";
import { t } from "../../translations";

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

export function SettingsMain() {
  const [localEmailRemind, setLocalEmailRemind] = useState(() => {
    const saved = localStorage.getItem("settings_emailReminders");
    return saved ? JSON.parse(saved) : true;
  });
  
  const [notificationEmail, setNotificationEmail] = useState(() => {
    return localStorage.getItem("settings_notificationEmail") || "";
  });

  const language = "Español";

  const handleSaveSettings = () => {
    if (localEmailRemind && (!notificationEmail.trim() || !notificationEmail.includes("@"))) {
      toast.error(t("Por favor ingresa un correo válido.", language));
      return;
    }

    localStorage.setItem("settings_emailReminders", JSON.stringify(localEmailRemind));
    localStorage.setItem("settings_notificationEmail", notificationEmail);

    toast.success("¡Configuración guardada con éxito!");
  };

  const handleResetData = () => {
    localStorage.removeItem("dashboard_stats");
    toast.success("Las estadísticas de estudio se han reiniciado.");
  };

  return (
    <main className="flex-1 min-w-0 overflow-y-auto px-8 py-8">
      {/* Header */}
      <section className="mb-8">
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">{t("Preferencia", language)}</p>
        <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{t("Configuración del Proyecto", language)}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("Personaliza el comportamiento de la IA y el entorno de estudio.", language)}</p>
      </section>

      <div className="max-w-2xl space-y-6">
        {/* Section: System settings */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-foreground">{t("Preferencias del Sistema", language)}</h2>
          </div>

          <div className="space-y-4">
            {/* Email reminders */}
            <div className="flex flex-col py-2 gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t("Recordatorios Diarios", language)}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t("Recibir alertas diarias en tu correo", language)}</p>
                  </div>
                </div>
                <Toggle on={localEmailRemind} onToggle={() => setLocalEmailRemind(!localEmailRemind)} />
              </div>
              
              {localEmailRemind && (
                <div className="mt-2 pl-6 animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("Correo electrónico para notificaciones", language)}
                  </label>
                  <input
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder={t("ejemplo@correo.com", language)}
                    className="w-full px-3 py-2.5 text-xs bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition font-medium"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Section: Reset Stats */}
        <section className="bg-card border border-destructive/20 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold text-destructive uppercase tracking-widest">{t("Zona de Peligro", language)}</h2>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {t("Si restableces las estadísticas, se borrarán todos los registros mock de tus sesiones de estudio y precisión del panel principal. Esta acción no se puede deshacer.", language)}
          </p>
          <button
            onClick={handleResetData}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive bg-destructive/5 text-xs font-bold hover:bg-destructive hover:text-white transition-all active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" /> {t("Restablecer Estadísticas", language)}
          </button>
        </section>

        {/* Save Button */}
        <button
          onClick={handleSaveSettings}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/95 active:scale-[0.98] transition-all"
        >
          {t("Guardar Configuración", language)}
        </button>
      </div>
    </main>
  );
}
