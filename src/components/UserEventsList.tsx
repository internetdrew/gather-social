import { useSetRecoilState } from "recoil";
import { eventCountState } from "~/atoms/eventAtom";
import { EventCard } from "~/components";
import { api } from "~/utils/api";

const EventsList = () => {
  const setEventCount = useSetRecoilState(eventCountState);
  const { data, isLoading, isError } =
    api.events.getCurrentUserEvents.useQuery();

  const hostEvents = data?.hostEvents ?? [];
  const guestCheckins = data?.guestCheckins ?? [];
  setEventCount(hostEvents?.length + guestCheckins?.length);

  return (
    <article className="flex w-[90%] flex-col space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold">Active Events</h2>
      </div>
      <div>
        {isLoading ? (
          <div className="mt-4 text-center text-xl">Loading...</div>
        ) : isError ? (
          <div className="mt-4 text-center text-xl">
            Something went wrong...
          </div>
        ) : (
          <>
            {hostEvents.length ? (
              <h3 className="mb-2 text-lg text-slate-500">Hosting</h3>
            ) : null}
            {hostEvents?.map((hostEvent) => {
              if (hostEvent)
                return <EventCard key={hostEvent?.id} event={hostEvent} />;
            })}
            {guestCheckins.length ? (
              <h3 className="mb-2 text-lg text-slate-500">Attending</h3>
            ) : null}
            {guestCheckins.map((guestCheckin) => {
              if (guestCheckin)
                return (
                  <EventCard key={guestCheckin?.id} event={guestCheckin} />
                );
            })}
          </>
        )}
      </div>
    </article>
  );
};

export default EventsList;
