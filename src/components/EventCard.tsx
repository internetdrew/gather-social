import Image from "next/image";
import Link from "next/link";
import { EventCardOptions } from "~/components";
import { type SetStateAction } from "react";
import type { EventModalRef } from "./EventModal";
import type { InviteModalRef } from "./InviteModal";
import type { EventInviteAssets } from "./UserEventsList";

export interface Event {
  id: string;
  title: string;
  hostInfo: {
    firstName: string | null;
    lastName: string | null;
    avatar: string;
  };
  startDate?: Date | null;
}

interface EventCardProps {
  event: Event | null;
  setEvent?: React.Dispatch<SetStateAction<Event | null>>;
  eventModalRef?: React.RefObject<EventModalRef | null>;
  inviteModalRef?: React.RefObject<InviteModalRef | null>;
  setEventInviteAssets?: React.Dispatch<
    SetStateAction<EventInviteAssets | null>
  >;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  setEvent,
  eventModalRef,
  inviteModalRef,
  setEventInviteAssets,
}) => {
  if (!event) return;

  const openActivateEventModal = () => {
    if (eventModalRef?.current) {
      eventModalRef.current.openModal();
    }
    if (setEvent) {
      setEvent(event);
    }
  };

  return (
    <article className="mb-4 flex h-64 flex-col rounded-lg bg-famous-white p-4 ring-1 ring-black">
      <div className="flex items-start justify-between">
        <h4 className="max-w-xs flex-1 overflow-hidden break-words text-lg font-semibold sm:text-xl">
          {event?.title}
        </h4>
        {inviteModalRef && (
          <EventCardOptions
            inviteModalRef={inviteModalRef}
            event={event}
            setEvent={setEvent}
            eventId={event.id}
            setEventInviteAssets={setEventInviteAssets}
          />
        )}
      </div>
      <div className="flex"></div>

      <div className="mt-auto flex items-end justify-between">
        <div>
          <span className="text-sm">Hosted by</span>
          <div className="flex items-center">
            <Image
              src={event.hostInfo.avatar}
              width={500}
              height={500}
              alt="event host profile image"
              className="mr-1 h-5 w-5 rounded-full"
            />
            <span className="font-medium">
              {event?.hostInfo?.firstName}{" "}
              <span className="hidden sm:inline">
                {event?.hostInfo?.lastName}
              </span>
            </span>
          </div>
        </div>
        {!event.startDate ? (
          <button
            className="ml-auto rounded-2xl bg-pink-400 px-6 py-1 text-sm font-medium ring-1 ring-black duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            onClick={openActivateEventModal}
          >
            Activate
          </button>
        ) : (
          <Link
            href={`/event/feed/${event?.id}`}
            className="px6 ml-auto rounded-2xl bg-pink-400 px-6 py-1 text-sm font-medium ring-1 ring-black duration-300 hover:scale-105 hover:shadow-xl"
          >
            Enter
          </Link>
        )}
      </div>
    </article>
  );
};

export default EventCard;
