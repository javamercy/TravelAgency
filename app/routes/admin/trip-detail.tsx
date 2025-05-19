import React from "react";
import type { LoaderFunctionArgs } from "react-router";
import { getAllTrips, getTripById } from "~/appwrite/trips";
import type { Route } from "./+types/trip-detail";
import { cn, getFirstWord, parseTripData } from "lib/utils";
import { Header, TripCard } from "components";
import InfoPill from "components/InfoPill";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { tripId } = params;
  if (!tripId) {
    throw new Error("Trip ID is required");
  }

  const [trip, trips] = await Promise.all([
    getTripById(tripId),
    getAllTrips(4, 0),
  ]);

  return {
    trip,
    allTrips: trips.allTrips.map(({ $id, detail, imageUrls }) => ({
      id: $id,
      ...parseTripData(detail),
      imageUrls,
    })),
  };
};
export default function TripDetail({ loaderData }: Route.ComponentProps) {
  const tripData = parseTripData(loaderData?.trip.detail);
  const { imageUrls } = loaderData?.trip as unknown as Trip;
  const {
    name,
    duration,
    itinerary,
    travelStyle,
    groupType,
    budget,
    interests,
    estimatedPrice,
    description,
    bestTimeToVisit,
    weatherInfo,
    country,
  } = tripData || {};

  const allTrips = loaderData?.allTrips || [];
  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-500" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-500" },
    { text: budget, bg: "!bg-success-50 !text-success-500" },
    { text: interests, bg: "!bg-navy-50 !text-navy-500" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit", items: bestTimeToVisit },
    { title: "Weather", items: weatherInfo },
  ];
  return (
    <main className="travel-detail wrapper">
      <Header
        title="Trip Details"
        description="View and edit AI-generated travel plans"
      />
      <section className="container wrapper-md">
        <header className="p-40-semibold text-dark-100">
          {name}
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day plan`}
              image="/assets/icons/calendar.svg"
            />
            <InfoPill
              text={
                itinerary
                  ?.slice(0, 3)
                  .map((item) => item.location)
                  .join(", ") || ""
              }
              image="/assets/icons/location-mark.svg"
            />
          </div>
        </header>
        <section className="gallery">
          {imageUrls.map((url: string, index: number) => (
            <img
              src={url}
              key={index}
              className={cn(
                "w-full rounded-xl object-cover",
                index === 0
                  ? "md:col-span-2 md:row-span-2 h-[330px]"
                  : "md:row-span-1 h-[150px]"
              )}
            />
          ))}
        </section>
        <section className="flex items-center gap-3 md:gap-5">
          <ChipListComponent>
            <ChipsDirective>
              {pillItems.map((pill, index) => (
                <ChipDirective
                  key={index}
                  text={getFirstWord(pill.text)}
                  cssClass={`${pill.bg} !text-base !font-medium !px-4`}
                />
              ))}
            </ChipsDirective>
          </ChipListComponent>
          <ul className="flex items-center gap-1">
            {Array(5)
              .fill("null")
              .map((_, index) => (
                <li key={index}>
                  <img
                    src="/assets/icons/star.svg"
                    alt="star"
                    className="size-5"
                  />
                </li>
              ))}
            <li className="ml-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.9"
                    cssClass="!bg-yellow-50 !text-yellow-700"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>
        <section className="title">
          <article>
            <h3>
              {duration}-Day {country} {travelStyle} Trip
            </h3>
            <p>
              {budget}, {groupType}, {interests}
            </p>
            <h2>{estimatedPrice}</h2>
          </article>
        </section>
        <p className="font-normal text-dark-400 text-sm md:text-lg">
          {description}
        </p>
        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, index) => (
            <li key={index}>
              <h3>
                Day {dayPlan.day}: {dayPlan.location}
              </h3>
              <ul>
                {dayPlan.activities.map((activity, index) => (
                  <li key={index}>
                    <span className="flex-shrink-0 p-18-semibold">
                      {activity.time}
                    </span>
                    <p className="flex-grow">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        {visitTimeAndWeatherInfo.map((item, index) => (
          <section key={index} className="visit">
            <div>
              <h3>{item.title}</h3>
              <ul>
                {item.items?.map((item, index) => (
                  <li key={index}>
                    <p className="flex-grow">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold">Popular Trips</h2>
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
      </section>
    </main>
  );
}
