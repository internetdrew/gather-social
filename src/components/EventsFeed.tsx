import { api } from "~/utils/api";

const EventsFeed = () => {
  const { data: events } = api.events.getAll.useQuery();

  return (
    <article className="flex w-[90%] flex-col space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold">Active Events</h2>
      </div>
      <div>
        <h3 className="text-lg text-slate-500">Hosting</h3>
        {events?.map((event) => (
          <div key={event.id}>{event.title}</div>
        ))}
        <h3 className="mt-6 text-lg text-slate-500">Attending</h3>
        {events?.map((event) => (
          <div key={event.id}>{event.title}</div>
        ))}
      </div>
    </article>
  );
};

export default EventsFeed;
