import Image from "next/image";
import React from "react";
import { type RouterOutputs } from "~/utils/api";

type EventData = RouterOutputs["events"]["getEventDetails"];

const EventHeader: React.FC<{ eventData: EventData }> = ({ eventData }) => {
  return (
    <div className="mx-auto mt-20 flex w-[95%] flex-col rounded-3xl bg-slate-100 p-6 text-center ring-1 ring-black sm:w-1/2 xl:w-1/3">
      <h1 className="mb-2 text-xl font-semibold lg:text-3xl">
        {eventData?.title}
      </h1>
      <div className="text-lg">
        <p>Hosted by</p>
        <div className="flex items-center justify-center gap-1">
          <Image
            width={80}
            height={80}
            src={eventData.hostDetails.avatar ?? ""}
            className="inline h-7 w-7 rounded-full"
            alt="user profile image"
          />
          <p className="font-medium">
            {eventData.hostDetails.firstName} {eventData.hostDetails.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
