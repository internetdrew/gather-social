import { UserEventsList, UserWelcome } from "~/components";
import Head from "next/head";

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
        <section className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-10 pt-10">
          <UserWelcome />
          <UserEventsList />
        </section>
      </main>
    </>
  );
};

export default Home;
