import Link from "next/link";

interface Event {
  id: string;
  title: string;
  hostInfo: {
    firstName: string | null;
    lastName: string | null;
  };
}

interface EventCardProps {
  key: string | number;
  event: Event | null;
}

const EventCard: React.FC<EventCardProps> = ({ key, event }) => {
  return (
    <div
      key={key}
      className="relative mb-4 rounded-lg p-3 ring-1 ring-pink-500"
    >
      <p className="text-lg font-semibold">{event?.title}</p>
      <p className="text-sm">
        Hosted by {event?.hostInfo?.firstName} {event?.hostInfo?.lastName}
      </p>
      <Link
        href={`/events/${event?.id}`}
        className="absolute bottom-3 right-4 rounded-2xl bg-pink-500 px-6 py-1 text-sm font-medium text-white duration-300 hover:scale-105 hover:shadow-xl"
      >
        Join
      </Link>
    </div>
  );
};

export default EventCard;
