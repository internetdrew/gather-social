import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import React from "react";

const UserProfile = () => {
  const { user } = useUser();

  return (
    <>
      <div className="flex w-3/4 flex-col items-center space-y-2 rounded-3xl bg-slate-100 p-8">
        {user && (
          <div className="h-20 w-20 overflow-hidden rounded-full">
            <Image
              src={user.profileImageUrl}
              width={90}
              height={90}
              alt="user image"
            />
          </div>
        )}
        <p className="text-lg font-semibold">{user?.fullName}</p>
      </div>
    </>
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
        <section className="mx-auto flex max-w-2xl justify-center pt-20">
          <UserProfile />
        </section>
      </main>
    </>
  );
};

export default Dashboard;
