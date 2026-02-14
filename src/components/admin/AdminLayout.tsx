import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0f0f23] text-ivory">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen p-6 pt-16 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
}
