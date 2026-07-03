import { useState } from "react";
import { ChevronRight, UserPlus, LogOut, MoreHorizontal } from "lucide-react";
import { NAV_ITEMS } from "../../constants";

export interface SidebarProps {
  activeNav: string;
  onNavChange: (label: string) => void;
  currentUser: any;
  onLogout: () => void;
}

export function Sidebar({ activeNav, onNavChange, currentUser, onLogout }: SidebarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = currentUser?.fullName || "";
  const displayEmail = currentUser?.email || "";
  const displayInitials = currentUser?.fullName
    ? (() => {
        const parts = currentUser.fullName.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      })()
    : "US";

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-card border-r border-border h-full overflow-y-auto">
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1" aria-label="Main navigation">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
          Main Menu
        </p>
        {NAV_ITEMS.map(({ icon: Icon, label }) => {
          const isActive = activeNav === label;
          return (
            <button
              key={label}
              onClick={() => onNavChange(label)}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full text-left ${isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
            </button>
          );
        })}
      </nav>

      {/* User card + dropdown */}
      <div className="mx-3 mb-4 relative">

        {/* Dropdown popover */}
        {menuOpen && (
          <>
            {/* Invisible backdrop to close on outside click */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            {/* Floating card */}
            <div
              className="absolute bottom-full mb-2 left-0 right-0 z-20 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
              role="menu"
              aria-label="Profile actions"
            >
              {/* Row 1 — Add account */}
              <button
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <UserPlus className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                Add another account
              </button>

              {/* Divider */}
              <div className="mx-4 h-px bg-border" />

              {/* Row 2 — Log out */}
              <button
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                </div>
                Log out
              </button>
            </div>
          </>
        )}

        {/* Profile trigger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${menuOpen
            ? "bg-muted border-primary/30 shadow-sm"
            : "bg-muted border-border hover:border-primary/20 hover:shadow-sm"
            }`}
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">{displayInitials}</span>
          </div>
          <div className="min-w-0 text-left">
            <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-[10px] text-muted-foreground truncate">{displayEmail}</p>
          </div>
          <MoreHorizontal className={`w-4 h-4 shrink-0 ml-auto transition-colors ${menuOpen ? "text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>
    </aside>
  );
}
