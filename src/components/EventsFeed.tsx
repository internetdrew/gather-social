import { api } from "~/utils/api";

const EventsFeed = () => {
  const { data, isLoading, isError } = api.events.getAll.useQuery();

  if (isError) return <div>Something went wrong...</div>;

  const hostEvents = data?.hostEvents ?? [];
  const guestEvents = data?.guestEvents ?? [];

  return (
    <article className="flex w-[90%] flex-col space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold">Active Events</h2>
      </div>
      <div>
        {isLoading ? (
          <div className="mt-4 text-center text-xl">Loading...</div>
        ) : (
          <>
            <h3 className="text-lg text-slate-500">Hosting</h3>
            {hostEvents?.map((hostEvent) => (
              <div key={hostEvent.id}>{hostEvent.title}</div>
            ))}
            <h3 className="mt-6 text-lg text-slate-500">Attending</h3>
            {guestEvents?.map((guestEvent) => (
              <div key={guestEvent.id}>{guestEvent.event.title}</div>
            ))}
          </>
        )}
      </div>
    </article>
  );
};

export default EventsFeed;
