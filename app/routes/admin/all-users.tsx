import { Header } from "components";
import { GridComponent } from "@syncfusion/ej2-react-grids";
import { ColumnDirective, ColumnsDirective } from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from "lib/utils";
import { getAllUsers } from "~/appwrite/auth";
import type { Route } from "./+types/admin-layout";

export const loader = async () => await getAllUsers();

export default function AllUsers({ loaderData }: Route.ComponentProps) {
  const users = loaderData ? (loaderData as unknown as UserData[]) : [];
  return (
    <main className="all-users wrapper">
      <Header
        title="Manage Users"
        description="Filter, sort, and access user data effortlessly."
      />
      <GridComponent dataSource={users} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            textAlign="Left"
            width={200}
            field="firstName"
            headerText="Full Name"
            template={(props: UserData) => (
              <div className="flex items-center gap-2 px-4">
                <img
                  src={props.imageUrl}
                  alt="user"
                  className="rounded-full size-8 aspect-square"
                />
                <span>
                  {props.firstName} {props.lastName}
                </span>
              </div>
            )}
          />
          <ColumnDirective
            width={200}
            field="email"
            headerText="Email Address"
            textAlign="Left"
          />
          <ColumnDirective
            field="status"
            headerText="Type"
            width={100}
            textAlign="Left"
            template={({ status }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  status === "user" ? "bg-success-50" : "bg-light-300"
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "user" ? "bg-success-500" : "bg-gray-500"
                  )}
                />
                <h3
                  className={cn(
                    "font-inter text-xs font-medium",
                    status === "user" ? "text-success-700" : "text-gray-500"
                  )}
                >
                  {status}
                </h3>
              </article>
            )}
          />
          <ColumnDirective
            field="createdDate"
            headerText="Created Date"
            width={120}
            textAlign="Left"
            template={({ createdDate }: UserData) => formatDate(createdDate)}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
}
