import { UserEventsList, UserWelcome } from "~/components";
import Head from "next/head";
import { api } from "~/utils/api";

const Home = () => {
  // const { data, isError, isLoading } = api.checkout.createSession.useQuery();

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
          <UserEventsList />
        </section>
      </main>
    </>
  );
};

export default Home;
