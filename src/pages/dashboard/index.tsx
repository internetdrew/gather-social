import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserProfile = () => {
  const { user } = useUser();

  return (
    <article className="flex w-[90%] flex-col items-center justify-between space-y-10 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div className="flex flex-col items-center justify-center">
        {user && (
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <Image
              src={user?.profileImageUrl}
              width={80}
              height={80}
              alt="user image"
            />
          </div>
        )}
        <p className="text-xl font-semibold">Hi, {user?.firstName}!</p>
        <p className="text-slate-500">You have X active events right now.</p>
      </div>
      <Link href={"/new"} className="w-1/2 ">
        <button className="h-full w-full rounded-xl bg-pink-500 py-2 font-semibold text-white">
          Host an event
        </button>
      </Link>
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
    <article className="flex w-[90%] flex-col space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4">
      <div>
        <h2 className="text-2xl font-semibold">Active Events</h2>
        <p className="text-slate-500">
          See active events you are hosting or attending.
        </p>
      </div>
      {events?.map((event, idx) => (
        <div key={idx}>{event}</div>
      ))}
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
