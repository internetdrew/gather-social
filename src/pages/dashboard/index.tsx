import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import React from "react";

const UserProfile = () => {
  const { user } = useUser();

  return (
    <article className="flex items-center justify-between space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <p className="text-xl">Hi, {user?.firstName}!</p>
      {user && (
        <div className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={user.profileImageUrl}
            width={80}
            height={80}
            alt="user image"
          />
        </div>
      )}
    </article>
  );
};

const EventsFeed = () => {
  const events = [
    "Bob and lisa's wedding",
    "Some other event",
    "Storm the psych ward",
  ];

  return (
    <article className="flex items-center justify-between space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div>
        <h2 className="text-2xl font-semibold">Your Events</h2>
        <p className="text-slate-500">
          See events you are hosting or attending.
        </p>
      </div>
    </article>
  );
};

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Gather Social Dashboard</title>
        <meta
          name="description"
          content="See private social networks you're hosting and attending."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className="mx-auto flex max-w-2xl flex-col items-center justify-center space-y-10 pt-20">
          <UserProfile />
          <EventsFeed />
        </section>
      </main>
    </>
  );
};

export default Dashboard;
