import { ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "../../constants";
import { t } from "../../translations";

export interface SidebarProps {
  activeNav: string;
  onNavChange: (label: string) => void;
  language: string;
}

export function Sidebar({ activeNav, onNavChange, language }: SidebarProps) {
  return (
    <aside className="flex flex-col w-64 shrink-0 bg-card border-r border-border h-full overflow-y-auto">
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1" aria-label="Main navigation">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
          {t("Main Menu", language)}
        </p>
        {NAV_ITEMS.map(({ icon: Icon, label }) => {
          const isActive = activeNav === label;
          const displayLabel = t(label, language);
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
              {displayLabel}
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/70" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
