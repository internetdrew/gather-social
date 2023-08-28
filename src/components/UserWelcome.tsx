import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";

const UserWelcome = () => {
  const { user } = useUser();

  const { data } = api.events.getCurrentUserEventCount.useQuery();
  const eventCount = data?.activeEvents;

  return (
    <article className="flex w-[95%] flex-col items-center justify-between space-y-10 rounded-3xl bg-slate-100 p-8 shadow-2xl ring-1 ring-black sm:w-3/4">
      <div className="flex w-full flex-col items-center justify-center">
        {user && (
          <>
            <div className="h-16 w-16 overflow-hidden rounded-full">
              <Image
                src={user?.profileImageUrl}
                width={80}
                height={80}
                alt="user image"
              />
            </div>
            <p className="mt-2 text-xl font-semibold text-slate-900">
              Hi, {user?.firstName}!
            </p>
          </>
        )}
        <p className="text-center text-slate-600">
          {eventCount
            ? `You have ${eventCount} active events right now.`
            : "You don't have any active events right now."}
        </p>
      </div>
      <div className="flex w-[90%] flex-col items-center justify-between gap-4 sm:flex-row ">
        <Link
          href={"/create"}
          className="h-full w-full rounded-full bg-pink-500 px-4 py-2 text-center font-semibold ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl"
        >
          Create an event
        </Link>
        <Link
          href={"/join"}
          className="h-full w-full rounded-full px-4 py-2 text-center font-semibold ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl"
        >
          Join an event
        </Link>
      </div>
    </article>
  );
};

export default UserWelcome;
