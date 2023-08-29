import { useState, useRef, useMemo } from "react";
import { EventCard, EventModal } from "~/components";
import type { EventModalRef } from "./EventModal";
import { api } from "~/utils/api";
import { type Event } from "./EventCard";

const EventsList = () => {
  const eventModalRef = useRef<EventModalRef | null>(null);
  const [eventToActivate, setEventToActivate] = useState<Event | null>(null);
  const memoizedEventModal = useMemo(
    () => <EventModal event={eventToActivate} ref={eventModalRef} />,
    [eventToActivate, eventModalRef]
  );
  const { data, isLoading, isError } =
    api.events.getCurrentUserEvents.useQuery();

  const hostEvents = data?.hostEvents ?? [];
  const guestCheckins = data?.guestCheckins ?? [];

  if (!hostEvents.length && !guestCheckins.length) return null;

  return (
    <article className="flex w-[95%] flex-col space-y-2 rounded-3xl bg-slate-100 p-6 shadow-2xl ring-1 ring-black sm:w-3/4">
      <div className="mb-2">
        <h2 className="text-2xl font-semibold">Your Events</h2>
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
                return (
                  <EventCard
                    key={hostEvent.id}
                    event={hostEvent}
                    setEvent={setEventToActivate}
                    eventModalRef={eventModalRef}
                  />
                );
            })}
            {guestCheckins.length ? (
              <h3 className="mb-2 mt-10 text-lg text-slate-500">Attending</h3>
            ) : null}
            {guestCheckins.map((guestCheckin) => {
              if (guestCheckin)
                return <EventCard key={guestCheckin.id} event={guestCheckin} />;
            })}
          </>
        )}
      </div>
      {memoizedEventModal}
    </article>
  );
};

export default EventsList;
