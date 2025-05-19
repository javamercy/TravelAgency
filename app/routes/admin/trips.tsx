import { Header } from "components";

export default function Trips() {
  return (
    <main className="all-users wrapper">
      <Header
        title="Trips"
        description="View and edit AI-generated travel plans."
        ctaText="Create New Trip"
        ctaUrl="/trips/create"
      />
    </main>
  );
}
