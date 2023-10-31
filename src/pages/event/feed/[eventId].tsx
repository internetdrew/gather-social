import { EventHeader, EventFeed } from "~/components";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
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

export default EventPage;
