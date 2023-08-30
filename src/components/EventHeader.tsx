import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

// interface EventDetails {
//   id: string;
//   createdAt: Date;
//   startDate: Date;
//   endDate: Date;
//   title: string;
//   qrCodeImageUrl: string;
//   hostDetails: {
//     firstName: string;
//     lastName: string;
//     avatar: string;
//   };
// }

// interface EventHeaderProps {
//   data: EventDetails;
// }

const EventHeader = () => {
  const router = useRouter();
  const { eventId } = router.query;

  const validEventId = Array.isArray(eventId) ? eventId[0] : eventId;

  const { data } = api.events.getEventDetails.useQuery({
    id: validEventId!,
  });

  if (!data) return;

  return (
    <div className="mx-auto w-[95%] rounded-3xl bg-slate-100 p-6 text-center ring-1 ring-black sm:w-1/2 xl:w-1/3">
      <h1 className="text-3xl font-semibold">{data?.title}</h1>
      <div className="mt-10 flex items-center justify-center gap-2">
        <Image
          width={80}
          height={80}
          src={data.hostDetails.avatar ?? ""}
          className="inline h-10 w-10 rounded-full"
          alt="user profile image"
        />
        <div className="text-start">
          <p>Hosted by</p>
          <p>
            {data?.hostDetails.firstName} {data?.hostDetails.lastName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
