import { UserWelcome, UserEventsList } from "~/components";

const Home = () => {
  return (
    <main>
      <div className="mx-auto mt-20 flex max-w-2xl flex-col items-center justify-center space-y-10">
        <UserWelcome />
        <UserEventsList />
      </div>
    </main>
  );
};

export default Home;
