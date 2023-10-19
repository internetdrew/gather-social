import { useState, useRef } from "react";
import { EventCard, EventModal, InviteModal } from "~/components";
import type { EventModalRef } from "./EventModal";
import type { InviteModalRef } from "./InviteModal";
import { api } from "~/utils/api";
import { type Event } from "./EventCard";

interface NoEventsMessageProps {
  message: string;
}

export interface EventInviteAssets {
  qrCodeImageUrl: string;
  joinEventUrl: string;
}

const NoEventsMessage: React.FC<NoEventsMessageProps> = ({ message }) => {
  return (
    <div className="py-2 text-center text-lg font-semibold">{message}</div>
  );
};

const EventsList = () => {
  const eventModalRef = useRef<EventModalRef | null>(null);
  const inviteModalRef = useRef<InviteModalRef | null>(null);
  const [modalEvent, setModalEvent] = useState<Event | null>(null);
  const [eventInviteAssets, setEventInviteAssets] =
    useState<EventInviteAssets | null>(null);

  const { data } = api.events.getCurrentUserEvents.useQuery();

  const hostEvents = data?.hostEvents ?? [];
  const guestCheckins = data?.guestCheckins ?? [];

  return (
    <article className="flex w-[95%] flex-col space-y-2 rounded-3xl bg-famous-white p-6 shadow-lg shadow-pink-400/40 ring-1 ring-black sm:w-3/4">
      <h2 className="text-2xl font-semibold">Your Events</h2>
      <div>
        <h3 className="mb-2 text-lg text-slate-500">Hosting</h3>
        {hostEvents.length ? (
          hostEvents.map((hostEvent) => {
            if (hostEvent)
              return (
                <EventCard
                  key={hostEvent.id}
                  event={hostEvent}
                  setEvent={setModalEvent}
                  eventModalRef={eventModalRef}
                  inviteModalRef={inviteModalRef}
                  setEventInviteAssets={setEventInviteAssets}
                />
              );
          })
        ) : (
          <div className="py-2 text-center text-lg font-semibold">{`You aren't hosting any events right now.`}</div>
        )}
        <h3 className="mb-2 mt-10 text-lg text-slate-500">Attending</h3>
        {guestCheckins.length ? (
          guestCheckins.map((guestCheckin) => {
            if (guestCheckin)
              return <EventCard key={guestCheckin.id} event={guestCheckin} />;
          })
        ) : (
          <NoEventsMessage
            message={`You aren't attending any events right now.`}
          />
        )}
      </div>
      <EventModal event={modalEvent} ref={eventModalRef} />
      <InviteModal assets={eventInviteAssets} ref={inviteModalRef} />
    </article>
  );
};

export default EventsList;
