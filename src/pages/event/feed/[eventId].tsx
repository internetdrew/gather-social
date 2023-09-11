import { EventHeader, EventFeed } from "~/components";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";

const EventPage: NextPage<{ eventId: string }> = ({ eventId }) => {
  const { data: eventDetails } = api.events.getEventDetails.useQuery({
    eventId,
  });
  const { data: postData } = api.posts.getAllForEvent.useQuery({ eventId });

  if (!eventDetails || !postData) return <h1>No for this event. Sorry!</h1>;

  return (
    <>
      <main>
        <section>
          <EventHeader eventData={eventDetails} />
          <EventFeed posts={postData} />
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

  const eventId = context.params?.eventId as string;

  if (typeof eventId !== "string") throw new Error("no event id");

  await helpers.events.getEventDetails.prefetch({ eventId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      eventId,
    },
    revalidate: 1,
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
