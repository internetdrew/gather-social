import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const UserWelcome = () => {
  const { user } = useUser();
  const router = useRouter();

  const { data } = api.events.getCurrentUserEvents.useQuery();
  const eventCount = data?.eventCount;

  const { data: tokenCount, isLoading: tokensLoading } =
    api.tokens.getUserAvailableTokens.useQuery();

  const { mutate: createCheckoutSession } =
    api.checkout.createSession.useMutation({
      onSuccess: (data) => {
        void router.replace(data.url);
      },
    });

  return (
    <article className="flex w-[95%] flex-col items-center justify-between space-y-10 rounded-3xl bg-famous-white p-8 shadow-lg shadow-pink-400/40 sm:w-3/4">
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
        <p className="text-slate-600">
          {eventCount
            ? `You have ${eventCount} active events right now.`
            : "You don't have any active events right now."}
        </p>
        <small className="text-slate-600">
          {tokensLoading
            ? `Checking for your event tokens...`
            : `You have ${
                tokenCount === 0 ? "no" : tokenCount
              } available event ${tokenCount === 1 ? "token" : "tokens"}.`}
        </small>
      </div>
      <div className="flex w-[90%] flex-col items-center justify-between gap-4 sm:flex-row ">
        {tokensLoading || tokenCount === 0 ? (
          <button
            className="h-full w-full rounded-full bg-pink-400 px-4 py-2 text-center font-semibold ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => createCheckoutSession()}
          >
            Get an event token
          </button>
        ) : (
          <Link
            href="/create"
            className="h-full w-full rounded-full bg-famous-pink px-4 py-2 text-center font-semibold ring-1 ring-black duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Create an event
          </Link>
        )}
        <Link
          href={"/join"}
          className="w-full rounded-full bg-famous-white px-4 py-2 text-center font-semibold text-famous-black ring-1 ring-famous-black duration-300 hover:scale-105 hover:shadow-2xl"
        >
          Join an event
        </Link>
      </div>
    </article>
  );
};

export default UserWelcome;
