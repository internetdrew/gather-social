import { z } from "zod";
import { api } from "~/utils/api";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import Link from "next/link";
import { useAddNewEventGuest } from "~/hooks/useAddNewEventGuest";
import { useRouter } from "next/router";
import { SignInButton, useUser } from "@clerk/nextjs";

interface FormData {
  password: string;
}

interface JoinEventPageProps {
  eventId: string;
}

const JoinEventPage: NextPage<JoinEventPageProps> = ({ eventId }) => {
  const router = useRouter();
  const user = useUser();

  const inputClasses =
    "rounded-xl p-3 outline-pink-400 ring-1 ring-famous-black disabled:cursor-not-allowed";

  const {
    data: event,
    isLoading,
    isError,
  } = api.events.getEventDetails.useQuery({
    eventId,
  });

  const { data: userIsEventGuest } = api.events.checkIfUserIsGuest.useQuery({
    eventId,
  });
  if (userIsEventGuest) {
    void router.push(`/event/feed/${eventId}`);
  }

  const addNewEventGuest = useAddNewEventGuest(eventId);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    addNewEventGuest({
      eventId,
      password: data.password,
    });

    reset();
  };

  const createEventSchema = z.object({
    password: z.string().min(1, "Please enter the event password."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
  });

  if (isLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-famous-white p-8 text-center font-semibold ring-1 ring-famous-black">
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-famous-white p-8 text-center font-semibold ring-1 ring-famous-black">
        <p className="mb-4">
          Event not found. Please check for the correct ID.
        </p>
        <Link href={"/home"} className="btn-primary rounded-xl">
          Head back home
        </Link>
      </div>
    );
  }

  return (
    <main>
      <form
        className="mx-auto mt-32 flex w-[90%] flex-col rounded-3xl bg-famous-white p-8 font-semibold shadow-2xl ring-1 ring-black sm:w-3/4 md:w-1/2 lg:w-1/3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-0 text-center text-xl">{`You're invited to join ${event?.title}`}</h1>
        <p className="mb-2 text-center">
          {user.isSignedIn
            ? "Now all you need is the password."
            : "You'll need to sign in to access the event."}
        </p>
        {user.isSignedIn && (
          <div className=" my-4 flex flex-col space-y-1">
            <label htmlFor="password">Event Password</label>
            <input
              type="password"
              className={inputClasses}
              disabled={!user.isSignedIn}
              {...register("password")}
            />
            {errors.password && (
              <small className="text-red-600">{errors.password.message}</small>
            )}
          </div>
        )}
        {!user.isSignedIn ? (
          <SignInButton mode="modal" redirectUrl={router.asPath}>
            <button className="prevent-select rounded-xl bg-pink-400 px-10 py-2 text-lg font-semibold transition-shadow duration-300 hover:shadow-md hover:shadow-pink-400/40">
              Sign in to join this event
            </button>
          </SignInButton>
        ) : (
          <button
            className="btn-primary rounded-xl disabled:cursor-not-allowed disabled:bg-gray-400"
            disabled={!user.isSignedIn}
          >{`Join ${event?.title}`}</button>
        )}
      </form>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const eventId = context.params?.eventId;

  if (typeof eventId !== "string") throw new Error("no event id");

  await helpers.events.getEventDetails.prefetch({ eventId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      eventId,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await prisma.event.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: events.map((event) => ({
      params: {
        eventId: event.id,
      },
    })),
    fallback: "blocking",
  };
};

export default JoinEventPage;
