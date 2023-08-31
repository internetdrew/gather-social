import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const EventHeader = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const validEventId = Array.isArray(eventId) ? eventId[0] : eventId;

  const { data } = api.events.getEventDetails.useQuery({
    id: validEventId!,
  });

  if (!data) return;

  return (
    <div className="mx-auto flex w-[95%] flex-col rounded-3xl bg-slate-100 p-6 text-center ring-1 ring-black sm:w-1/2 xl:w-1/3">
      <h1 className="mb-2 text-2xl font-semibold xl:text-3xl">{data?.title}</h1>
      <div className="text-lg">
        <p>Hosted by</p>
        <div className="flex items-center justify-center gap-1">
          <Image
            width={80}
            height={80}
            src={data.hostDetails.avatar ?? ""}
            className="inline h-7 w-7 rounded-full"
            alt="user profile image"
          />
          <p className="font-medium">
            {data.hostDetails.firstName} {data.hostDetails.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
