import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { Header } from "components";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "lib/utils";
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from "@syncfusion/ej2-react-maps";
import { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";

export const loader = async () => {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();
  return data.map((country: any) => ({
    name: country.name.common,
    coordinates: country.latlng,
    value: country.name.common,
    openStreetMap: country.maps?.openStreetMap,
  }));
};
export default function CreateTrip({ loaderData }: Route.ComponentProps) {
  const countries = loaderData as Country[];

  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || "",
    travelStyle: "",
    interest: "",
    budget: "",
    duration: 0,
    groupType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const countryData = countries.map((country) => ({
    name: country.name,
    value: country.value,
  }));

  const mapData = [
    {
      country: formData.country,
      color: "#EA382E",
      coordinates:
        countries.find((country) => country.name === formData.country)
          ?.coordinates || [],
    },
  ];

  function handleChange(key: keyof TripFormData, value: string | number) {
    setFormData({ ...formData, [key]: value });
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const { country, travelStyle, interest, budget, duration, groupType } =
      formData;

    if (!country || !travelStyle || !interest || !budget || !duration) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (duration < 1 || duration > 10) {
      setError("Duration must be between 1 and 10 days.");
      setLoading(false);
      return;
    }

    const user = await account.get();
    if (!user.$id) {
      console.log("user is not authenticated");
      setLoading(false);
      return;
    }

    try {
      console.log("user", user);
      console.log("form", formData);
    } catch (error) {
      console.error("Error creating trip:", error);
      setError("An error occurred while creating the trip.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Create New Trip"
        description="View and edit AI-generated travel plans."
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: "name", value: "value" }}
              placeholder="Select a country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange("country", e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();

                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query)
                    )
                    .map((country) => ({
                      name: country.name,
                      value: country.value,
                    }))
                );
              }}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              placeholder="Enter a number of days"
              className="placeholder:text-gray-100 form-input"
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id="{key}"
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: "text", value: "value" }}
                placeholder={`Select ${formatKey(key)}`}
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();

                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      }))
                  );
                }}
                className="combo-box"
              />
            </div>
          ))}
          <div>
            <label htmlFor="location">Location on the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  dataSource={mapData}
                  shapeData={world_map}
                  shapePropertyPath="name"
                  shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                  shapeDataPath="country"
                />
              </LayersDirective>
            </MapsComponent>
          </div>
          <div className="bg-gray-200 w-full h-px" />
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="!w-full !h-12 button-class"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${
                  loading ? "loader.svg" : "magic-star.svg"
                }`}
                alt="Generate trip"
                className={cn("size-5", { "animate-spin": loading })}
              />
              <span className="p-16-semibold text-white">
                {loading ? "Generating..." : "Generate Trip"}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
}
