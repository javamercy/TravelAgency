import { Header, TripCard } from "components";
import { parseTripData } from "lib/utils";
import { useSearchParams, type LoaderFunctionArgs } from "react-router";
import { getTripById, getAllTrips } from "~/appwrite/trips";
import type { Route } from "./+types/trips";
import { useState } from "react";
import { Pager, PagerComponent } from "@syncfusion/ej2-react-grids";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const limit = 8;
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const offset = (page - 1) * limit;

  const { allTrips, total } = await getAllTrips(limit, offset);

  return {
    trips: allTrips.map(({ $id, detail, imageUrls }) => ({
      id: $id,
      ...parseTripData(detail),
      imageUrls: imageUrls ?? [],
    })),
    total,
  };
};
export default function Trips({ loaderData }: Route.ComponentProps) {
  const { trips, total } = loaderData as unknown as {
    trips: Trip[];
    total: number;
  };

  const [searchParams] = useSearchParams();
  const initialPage = Number(searchParams.get("page")) || 1;

  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.location.search = `?page=${page}`;
  };

  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit AI-generated travel plans."
        ctaText="Create New Trip"
        ctaUrl="/trips/create"
      />
      <section>
        <h1 className="mb-5 p-24-semibold text-dark-100">
          Manage Created trips
        </h1>
        <div className="trip-grid mb-5">
          {trips.map(
            ({
              id,
              name,
              imageUrls,
              itinerary,
              interests,
              travelStyle,
              estimatedPrice,
            }: Trip) => (
              <TripCard
                id={id}
                name={name}
                key={id}
                location={itinerary[0]?.location || ""}
                imageUrl={imageUrls[0]}
                tags={[travelStyle, interests]}
                price={estimatedPrice}
              />
            )
          )}
        </div>
        <PagerComponent
          cssClass="!mb-4"
          totalRecordsCount={total}
          pageSize={8}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
        ></PagerComponent>
      </section>
    </main>
  );
}
