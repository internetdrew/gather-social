import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Create = () => {
  const router = useRouter();
  const [eventTitle, setEventTitle] = useState("");

  const { mutate: createEvent, isLoading: isCreating } =
    api.events.create.useMutation({
      onSuccess: () => router.push("/home"),
    });

  const maxInputChars = 60;

  return (
    <div className="flex h-screen items-center justify-center">
      <article className="flex w-[90%] flex-col space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl ring-1 ring-black sm:w-3/4 md:w-1/2 lg:w-1/3">
        <div className="mb-3 flex flex-col space-y-2">
          <label htmlFor="event-name" className="font-semibold">
            Event Name
          </label>
          <input
            type="text"
            name="event-name"
            id="event-name"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            placeholder="Ex. Bob and Lisa's Wedding"
            className="rounded-xl p-3 outline-pink-500"
            maxLength={maxInputChars}
            disabled={isCreating}
          />
          <small>{`Characters remaining: ${
            maxInputChars - eventTitle.length
          }`}</small>
        </div>
        {eventTitle !== "" && (
          <button
            className="w-full rounded-xl bg-pink-500 px-4 py-2 ring-1 ring-black duration-300 hover:shadow-2xl"
            onClick={() => createEvent({ title: eventTitle.trim() })}
          >
            Create a private social network for{" "}
            <span className="font-semibold">{eventTitle}</span>
          </button>
        )}
      </article>
    </div>
  );
};

export default Create;
