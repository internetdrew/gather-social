import { EventCard } from "~/components";
import { api } from "~/utils/api";

const EventsList = () => {
  const { data, isLoading, isError } =
    api.events.getCurrentUserEvents.useQuery();

  const hostEvents = data?.hostEvents ?? [];
  const guestCheckins = data?.guestCheckins ?? [];

  if (!hostEvents.length && !guestCheckins.length) return null;

  return (
    <article className="flex w-[95%] flex-col space-y-2 rounded-3xl bg-slate-100 p-6 shadow-2xl ring-1 ring-black sm:w-3/4">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold">Active Events</h2>
      </div>
      <div>
        {isLoading ? (
          <p className="mt-4 text-center text-xl">Loading...</p>
        ) : isError ? (
          <p className="mt-4 text-center text-xl">Something went wrong...</p>
        ) : (
          <>
            {hostEvents.length ? (
              <h3 className="mb-2 text-lg text-slate-500">Hosting</h3>
            ) : null}
            {hostEvents.map((hostEvent) => {
              if (hostEvent)
                return <EventCard key={hostEvent.id} event={hostEvent} />;
            })}
            {guestCheckins.length ? (
              <h3 className="mb-2 text-lg text-slate-500">Attending</h3>
            ) : null}
            {guestCheckins.map((guestCheckin) => {
              if (guestCheckin)
                return <EventCard key={guestCheckin.id} event={guestCheckin} />;
            })}
          </>
        )}
      </div>
    </article>
  );
};

export default EventsList;
