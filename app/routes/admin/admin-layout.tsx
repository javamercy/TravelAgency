import { Outlet, redirect } from "react-router";
import { MobileSidebar, NavItems } from "../../../components";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { account } from "~/appwrite/client";
import { addUser, getUser, logout } from "~/appwrite/auth";

export async function clientLoader() {
  try {
    const user = await account.get();

    const existingUser = await getUser(user.$id);
    return existingUser?.$id ? existingUser : await addUser();
  } catch (error) {
    console.error("Error during clientLoader:", error);
    return redirect("/sign-in");
  }
}

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
