import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { OptionsMenu } from "~/components";

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
  setEvent?: (event: Event | null) => void;
}

const menuOptions = [
  {
    id: 1,
    intent: "edit",
    caption: "Edit event",
    url: "/",
    icon: <PencilSquareIcon className="mr-2 h-5 w-5" />,
  },
  {
    id: 2,
    intent: "delete",
    caption: "Delete event",
    url: "/",
    icon: <TrashIcon className="mr-2 h-5 w-5" />,
  },
];

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  if (!event) return;

  const handleClick = () => {
    console.log("click");
  };

  return (
    <article className="mb-4 flex h-64 flex-col rounded-lg p-4 ring-1 ring-black">
      <div className="flex items-start justify-between">
        <h4 className="max-w-xs flex-1 overflow-hidden break-words text-lg font-semibold sm:text-xl">
          {event?.title}
        </h4>
        <OptionsMenu options={menuOptions} eventId={event.id} />
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
            className="ml-auto rounded-2xl bg-pink-500 px-6 py-1 text-sm font-medium ring-1 ring-black duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
            onClick={handleClick}
          >
            Activate
          </button>
        ) : (
          <Link
            href={`/event/feed/${event?.id}`}
            className="px6 ml-auto rounded-2xl bg-pink-500 px-6 py-1 text-sm font-medium ring-1 ring-black duration-300 hover:scale-105 hover:shadow-xl"
          >
            Join
          </Link>
        )}
      </div>
    </article>
  );
};

export default EventCard;
