import { EventHeader, EventFeed } from "~/components";
import type { GetServerSidePropsContext, NextPage } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { getAuth } from "@clerk/nextjs/server";

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

  const userIsAttendingThisEvent = await helpers.events.isUserAGuest.fetch({
    eventId,
  });

  if (!userIsAttendingThisEvent) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await helpers.events.getEventDetails.prefetch({ eventId });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      eventId,
    },
  };
};

export default EventPage;
