import { EventHeader, ImageUpload } from "~/components";
import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const EventPage = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const validEventId = Array.isArray(eventId) ? eventId[0] : eventId;

  const { data } = api.events.getEventDetails.useQuery({
    id: validEventId!,
  });

  if (!data) return;

  return (
    <>
      <Head>
        <title>
          {data?.title}: Hosted by {data?.hostDetails.firstName}{" "}
          {data?.hostDetails.lastName}
        </title>
        <meta
          name="description"
          content={`${data?.title}: An private event feed hosted by ${data?.hostDetails.firstName}{" "}
          ${data?.hostDetails.lastName}`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="mt-20">
          <EventHeader />
          <ImageUpload />
        </section>
      </main>
    </>
  );
};

export default EventPage;
