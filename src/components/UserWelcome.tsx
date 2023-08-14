import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { type SetterOrUpdater, useRecoilState } from "recoil";
import { eventCountState } from "~/atoms/eventAtom";

const UserWelcome = () => {
  const { user } = useUser();
  const [eventCount]: [number, SetterOrUpdater<number>] =
    useRecoilState(eventCountState);

  return (
    <article className="flex w-[90%] flex-col items-center justify-between space-y-10 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div className="flex w-full flex-col items-center justify-center">
        {user && (
          <div className="h-16 w-16 overflow-hidden rounded-full">
            <Image
              src={user?.profileImageUrl}
              width={80}
              height={80}
              alt="user image"
            />
          </div>
        )}
        <p className="text-xl font-semibold">Hi, {user?.firstName}!</p>
        <p className="text-slate-500">{`You have ${eventCount} active events right now.`}</p>
      </div>
      <div className="flex w-[90%] flex-col items-center justify-between gap-4 sm:flex-row ">
        <Link
          href={"/create"}
          className="h-full w-full rounded-xl bg-pink-500 px-4 py-2 text-center font-semibold text-white duration-300 hover:shadow-2xl"
        >
          Create an event
        </Link>
        <Link
          href={"/join"}
          className="h-full w-full rounded-xl px-4 py-2 text-center font-semibold text-pink-500 ring-1 ring-pink-500 duration-300 hover:shadow-2xl "
        >
          Join an event
        </Link>
      </div>
    </article>
  );
};

export default UserWelcome;
