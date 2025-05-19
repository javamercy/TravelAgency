import { Header, StatsCard, TripCard } from "components";
import { getAllUsers, getUser } from "~/appwrite/auth";
import type { Route } from "./+types/admin-layout";
import {
  getTripsByTravelStyle,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { cn, parseTripData } from "lib/utils";
import {
  Category,
  ChartComponent,
  ColumnsDirective,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants";
import { ColumnDirective, GridComponent } from "@syncfusion/ej2-react-grids";

export const clientLoader = async () => {
  const [user, dashboardStats, trips, userGrowth, tripsByStyle, allUsers] =
    await Promise.all([
      await getUser(),
      await getUsersAndTripsStats(),
      await getAllTrips(4, 0),
      await getUserGrowthPerDay(),
      await getTripsByTravelStyle(),
      await getAllUsers(),
    ]);

  const allTrips = trips.allTrips.map(({ $id, detail, imageUrls }) => ({
    id: $id,
    ...parseTripData(detail),
    imageUrls: imageUrls ?? [],
  }));

  const mappedUsers: UsersItineraryCount[] = allUsers!.map((user) => ({
    imageUrl: user.imageUrl,
    name: `${user.firstName} ${user.lastName}`,
    count: 1,
  }));

  return {
    user,
    dashboardStats,
    allTrips,
    userGrowth,
    tripsByStyle,
    allUsers: mappedUsers,
  };
};

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { user, dashboardStats, allUsers, allTrips, tripsByStyle, userGrowth } =
    loaderData as unknown as {
      user: User | null;
      dashboardStats: DashboardStats;
      allUsers: UsersItineraryCount[];
      allTrips: Trip[];
      tripsByStyle: Record<string, Trip[]>;
      userGrowth: Record<string, number>;
    };

  const trips = allTrips.map((trip) => ({
    imageUrl: trip.imageUrls[0],
    name: trip.name,
    interest: trip.interests,
  }));

  const usersAndTrips = [
    {
      title: "Latest user signups",
      dataSource: allUsers,
      field: "count",
      headerText: "Trips Created",
    },
    {
      title: "Trips based on interests",
      dataSource: trips,
      field: "interest",
      headerText: "Interests",
    },
  ];

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
            total={dashboardStats.totalUsers}
            currentMonthCount={dashboardStats.usersJoined.currentMonth}
            previousMonthCount={dashboardStats.usersJoined.lastMonth}
          />
          <StatsCard
            headerTitle="Total Trips"
            total={dashboardStats.totalTrips}
            currentMonthCount={dashboardStats.tripsCreated.currentMonth}
            previousMonthCount={dashboardStats.tripsCreated.lastMonth}
          />
          <StatsCard
            headerTitle="Active Users"
            total={dashboardStats.userRole.total}
            currentMonthCount={dashboardStats.userRole.currentMonth}
            previousMonthCount={dashboardStats.userRole.lastMonth}
          />
        </div>
      </section>
      <section className="container">
        <h1 className="font-semibold text-dark-100 text-xl">Created Trips</h1>
        <div className="trip-grid">
          {allTrips.map(
            ({
              id,
              name,
              imageUrls,
              itinerary,
              interests,
              travelStyle,
              estimatedPrice,
            }) => (
              <TripCard
                key={id.toString()}
                name={name}
                imageUrl={imageUrls[0]}
                location={itinerary?.[0]?.location ?? ""}
                tags={[interests, travelStyle]}
                price={estimatedPrice}
                id={id.toString()}
              />
            )
          )}
        </div>
      </section>
      <section className="gap-5 grid grid-cols-1 lg:grid-cols-2">
        <ChartComponent
          id="chart-1"
          primaryXAxis={userXAxis}
          primaryYAxis={useryAxis}
          title="User Growth"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="Column"
              name="Column"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
            <SeriesDirective
              dataSource={userGrowth}
              xName="day"
              yName="count"
              type="SplineArea"
              name="Wave"
              fill="rgba(71,132,238,0.3)"
              border={{ width: 2, color: "#4784ee" }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
        <ChartComponent
          id="chart-2"
          primaryXAxis={tripXAxis}
          primaryYAxis={tripyAxis}
          title="Trip Trends"
          tooltip={{ enable: true }}
        >
          <Inject
            services={[
              ColumnSeries,
              SplineAreaSeries,
              Category,
              DataLabel,
              Tooltip,
            ]}
          />
          <SeriesCollectionDirective>
            <SeriesDirective
              dataSource={tripsByStyle}
              xName="travelStyle"
              yName="count"
              type="Column"
              name="Day"
              columnWidth={0.3}
              cornerRadius={{ topLeft: 10, topRight: 10 }}
            />
          </SeriesCollectionDirective>
        </ChartComponent>
      </section>
      <div className="user-trip wrapper">
        {usersAndTrips.map(
          ({ title, dataSource, field, headerText }, index) => (
            <div key={index} className="flex flex-col gap-5">
              <h3 className="p-20-semibold text-dark-100">{title}</h3>
              <GridComponent dataSource={dataSource} gridLines="None">
                <ColumnsDirective>
                  <ColumnDirective
                    field={field}
                    headerText={headerText}
                    width={200}
                    textAlign="Left"
                    template={(props) => (
                      <div className="flex items-center gap-2 px-4">
                        <img
                          src={props.imageUrl}
                          alt="user"
                          className="rounded-full size-8 aspect-square"
                        />
                        <span>{props.name}</span>
                      </div>
                    )}
                  />
                  <ColumnDirective
                    field={field}
                    headerText={headerText}
                    width={150}
                    textAlign="Left"
                  />
                </ColumnsDirective>
              </GridComponent>
            </div>
          )
        )}
      </div>
    </main>
  );
}
