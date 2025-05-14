import { Outlet } from "react-router";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      Mobile Sidebar {""}
      <aside className="hidden lg:block w-full max-w-[270px]">Sidebar</aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
}
