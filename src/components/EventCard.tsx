import Image from "next/image";
import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

interface Event {
  id: string;
  title: string;
  hostInfo: {
    firstName: string | null;
    lastName: string | null;
    avatar: string;
  };
}

interface EventCardProps {
  event: Event | null;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  if (!event) return null;
  return (
    <article className="mb-4 flex h-40 flex-col rounded-lg p-4 ring-1 ring-black">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-semibold">{event?.title}</h4>
        {/* <EventCardOptions /> */}
        <EllipsisVerticalIcon className="h-6 w-6 cursor-pointer text-slate-500" />
      </div>
      <div className="flex"></div>

      <div className="mt-auto flex items-center justify-between">
        <Image
          src={event.hostInfo.avatar}
          width={500}
          height={500}
          alt="event host profile image"
          className="mr-1 h-5 w-5 rounded-full"
        />
        <p className="text-sm">
          Hosted by{" "}
          <span className="font-semibold">
            {event?.hostInfo?.firstName} {event?.hostInfo?.lastName}
          </span>
        </p>
        <Link
          href={`/events/${event?.id}`}
          className="ml-auto rounded-2xl bg-pink-500 px-6 py-1 text-sm font-medium ring-1 ring-black duration-300 hover:scale-105 hover:shadow-xl"
        >
          Join
        </Link>
      </div>
    </article>
  );
};

export default EventCard;
