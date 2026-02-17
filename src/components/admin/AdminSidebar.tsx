import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, Image, FolderTree, Globe, Upload, FileText, Menu, X, CreditCard, UserCog,
} from "lucide-react";
import { useState } from "react";
import logoImg from "@/assets/logo-mariageafro.png";

const links = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/vendors", label: "Prestataires", icon: Users },
  { to: "/admin/users", label: "Utilisateurs", icon: UserCog },
  { to: "/admin/subscriptions", label: "Abonnements", icon: CreditCard },
  { to: "/admin/media", label: "Médias", icon: Image },
  { to: "/admin/categories", label: "Catégories", icon: FolderTree },
  { to: "/admin/countries", label: "Pays", icon: Globe },
  { to: "/admin/import", label: "Import CSV", icon: Upload },
  { to: "/admin/pages", label: "Pages", icon: FileText },
];

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-10 h-10 rounded-lg bg-[#1a1a2e] border border-champagne/20 flex items-center justify-center text-champagne"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-[55]" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1a1a2e] border-r border-champagne/10 z-[56] transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-champagne/10">
          <img src={logoImg} alt="MariageAfro" className="h-8 brightness-0 invert" />
          <p className="text-champagne/60 text-xs mt-1 font-body">Administration</p>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition-colors ${
                  isActive
                    ? "bg-champagne/10 text-champagne font-semibold"
                    : "text-ivory/60 hover:text-ivory hover:bg-white/5"
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
