import Link from "next/link";
import { useSetRecoilState } from "recoil";
import { eventCountState } from "~/atoms/eventAtom";
import { EventCard } from "~/components";
import { api } from "~/utils/api";

const EventsList = () => {
  const setEventCount = useSetRecoilState(eventCountState);
  const { data, isLoading, isError } = api.events.getAll.useQuery();

  const hostEvents = data?.hostEvents ?? [];
  const guestEvents = data?.guestEvents ?? [];
  setEventCount(hostEvents?.length + guestEvents?.length);

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
            <h3 className="text-lg text-slate-500">Hosting</h3>
            {hostEvents?.map((hostEvent) => (
              <EventCard key={hostEvent?.id} event={hostEvent} />
            ))}
            <h3 className="mt-6 text-lg text-slate-500">Attending</h3>
            {[...guestEvents, ...guestEvents]?.map((guestEvent) => (
              <EventCard key={guestEvent?.id} event={guestEvent} />
            ))}
          </>
        )}
      </div>
    </article>
  );
};

export default EventsList;
