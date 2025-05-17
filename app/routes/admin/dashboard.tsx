import { Header, StatsCard, TripCard } from "components";
import { redirect } from "react-router";
import { getUser } from "~/appwrite/auth";
import { account } from "~/appwrite/client";
import { dashboardStats, user, allTrips } from "~/constants";
import type { Route } from "./+types/admin-layout";

export const clientLoader = async () => getUser();

const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } =
  dashboardStats;
export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const user = loaderData as User | null;

  return (
    <main className="dashboard wrapper">
      <Header
        title={`Welcome ${user?.firstName} ${user?.lastName} 👻`}
        description="Track activity, trends and popular destinations in real time"
      />
      <section className="flex flex-col gap-6">
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3 w-full">
          <StatsCard
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            previousMonthCount={usersJoined.previousMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            previousMonthCount={tripsCreated.previousMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={userRole.total}
            currentMonthCount={userRole.currentMonth}
            previousMonthCount={userRole.previousMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="font-semibold text-dark-100 text-xl">Created Trips</h1>
        <div className="trip-grid">
          {allTrips
            .slice(0, 4)
            .map(({ id, name, imageUrls, itinerary, tags, estimatedPrice }) => (
              <TripCard
                key={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location ?? ""}
                tags={tags}
                price={estimatedPrice}
                id={id.toString()}
              />
            ))}
        </div>
      </section>
    </main>
  );
}
