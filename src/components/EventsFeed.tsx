interface Events {
  events: string[];
}

const EventsFeed = ({ events }: Events) => {
  return (
    <article className="flex w-[90%] flex-col space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold">Active Events</h2>
      </div>
      <div>
        <h3 className="text-lg text-slate-500">Hosting</h3>
        {events?.map((event, idx) => (
          <div key={idx}>{event}</div>
        ))}
        <h3 className="mt-6 text-lg text-slate-500">Attending</h3>
        {events?.map((event, idx) => (
          <div key={idx}>{event}</div>
        ))}
      </div>
    </article>
  );
};

export default EventsFeed;
