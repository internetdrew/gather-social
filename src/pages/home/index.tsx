import { EventsFeed, UserWelcome } from "~/components";
import Head from "next/head";

// const events = ["Bob and Lisa's wedding", "Another event", "Some other event"];

const Home = () => {
  return (
    <>
      <Head>
        <title>Gather Social Homepage</title>
        <meta
          name="description"
          content="See private social networks you're hosting and attending."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-10 pt-20">
          <UserWelcome />
          <EventsFeed />
        </section>
      </main>
    </>
  );
};

export default Home;
