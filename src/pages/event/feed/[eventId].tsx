import { EventHeader, ImageUpload } from "~/components";
import Head from "next/head";

const EventPage = () => {
  return (
    <>
      <Head>
        {/* <title>
          {data?.title}: Hosted by {data?.hostDetails.firstName}{" "}
          {data?.hostDetails.lastName}
        </title>
        <meta
          name="description"
          content={`${data?.title}: An private event feed hosted by ${data?.hostDetails.firstName}{" "}
          ${data?.hostDetails.lastName}`}
        /> */}
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
