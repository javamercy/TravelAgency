import { Outlet } from "react-router";
import { MobileSidebar, NavItems } from "../../../components";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <MobileSidebar />
      <aside className="hidden lg:block w-full max-w-[270px]">
        <SidebarComponent width={270} className="h-full" enableGestures={false}>
          <NavItems />
        </SidebarComponent>
      </aside>
      <aside className="children">
        <Outlet />
      </aside>
    </div>
  );
}
