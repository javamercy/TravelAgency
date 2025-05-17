import { calculateTrendPercentage, cn } from "lib/utils";

export default function StatsCard({
  headerTitle,
  total,
  currentMonthCount,
  previousMonthCount,
}: StatsCard) {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    previousMonthCount
  );

  const isDecrement = trend === "decrement";
  return (
    <article className="stats-card">
      <h3 className="font-medium text-base">{headerTitle}</h3>
      <div className="content">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl">{total}</h2>
          <div className="flex items-center gap-2">
            <figure className="flex items-center gap-1">
              <img
                src={`/assets/icons/${
                  isDecrement ? "arrow-down-red.svg" : "arrow-up-green.svg"
                }`}
                alt=""
              />
              <figcaption
                className={cn(
                  "text-small font-medium",
                  isDecrement ? "text-red-500" : "text-success-500"
                )}
              >
                {Math.round(percentage)}%{" "}
              </figcaption>
            </figure>
            <div className="font-medium text-gray-100 text-sm truncate">
              vs previous month
            </div>
          </div>
        </div>

        <img
          src={`/assets/icons/${
            isDecrement ? "decrement.svg" : "increment.svg"
          }`}
          className="w-full xl:w-32 h-full md:h-32 xl:h-full"
          alt="trend graph"
        />
      </div>
    </article>
  );
}
