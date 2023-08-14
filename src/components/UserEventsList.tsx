import Link from "next/link";
import { useSetRecoilState } from "recoil";
import { eventCountState } from "~/atoms/eventAtom";
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
              <div
                key={hostEvent?.id}
                className="relative my-2 rounded-lg p-3 ring-1 ring-pink-500"
              >
                <p className="text-lg font-semibold">{hostEvent?.title}</p>
                <p className="text-sm">
                  Hosted by {hostEvent?.hostInfo?.firstName}{" "}
                  {hostEvent?.hostInfo?.lastName}
                </p>
                <Link
                  href={`/join/events/${hostEvent?.id}`}
                  className="absolute bottom-3 right-4 rounded-2xl bg-pink-500 px-6 py-1 text-sm font-medium text-white duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Join
                </Link>
              </div>
            ))}
            <h3 className="mt-6 text-lg text-slate-500">Attending</h3>
            {[...guestEvents, ...guestEvents]?.map((guestEvent) => (
              <div
                key={guestEvent?.id}
                className="relative my-4 rounded-lg p-3 ring-1 ring-pink-500"
              >
                <p className="text-lg font-semibold">{guestEvent?.title}</p>
                <p className="text-sm">
                  Hosted by {guestEvent?.hostInfo?.firstName}{" "}
                  {guestEvent?.hostInfo?.lastName}
                </p>
                <Link
                  href={`/join/events/${guestEvent?.id}`}
                  className="absolute bottom-3 right-4 rounded-2xl bg-pink-500 px-6 py-1 text-sm font-medium text-white duration-300 hover:scale-105 hover:shadow-xl"
                >
                  Join
                </Link>
              </div>
            ))}
          </>
        )}
      </div>
    </article>
  );
};

export default EventsList;
