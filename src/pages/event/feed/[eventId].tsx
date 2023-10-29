import { EventHeader, EventFeed } from "~/components";
import type { GetServerSidePropsContext, NextPage } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { getAuth } from "@clerk/nextjs/server";
import { useRouter } from "next/router";

const EventPage: NextPage<{ eventId: string }> = ({ eventId }) => {
  const router = useRouter();
  const userIsAGuest = api.events.isUserAGuest.useQuery({ eventId });

  const { data: eventDetails } = api.events.getEventDetails.useQuery({
    eventId,
  });
  if (!userIsAGuest || !eventDetails) {
    void router.push("/");
  }

  const { data: posts } = api.posts.getAllForEvent.useQuery({ eventId });

  return (
    <>
      <main>
        <section>
          <EventHeader eventData={eventDetails!} />
          {posts && <EventFeed posts={posts} />}
        </section>
      </main>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ eventId: string }>
) => {
  const auth = getAuth(context.req);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { prisma, userId: auth.userId! },
    transformer: superjson,
  });

  const eventId = context.params?.eventId;

  if (typeof eventId !== "string") throw new Error("no event id");

  await helpers.events.getEventDetails.prefetch({ eventId });
  await helpers.events.isUserAGuest.prefetch({ eventId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      eventId,
    },
  };
};

export default EventPage;
