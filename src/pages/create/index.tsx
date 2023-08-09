import { useState } from "react";

const Create = () => {
  const [eventName, setEventName] = useState("");

  return (
    <div className="flex h-screen items-center justify-center">
      <article className="flex w-[90%] flex-col space-y-2 rounded-3xl bg-slate-100 p-8 shadow-2xl sm:w-3/4 md:w-1/2 lg:w-1/3">
        <form action="">
          <div className="flex flex-col space-y-1">
            <label htmlFor="event-name">Event Name</label>
            <input
              type="text"
              name="event-name"
              id="event-name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Ex. Bob and Lisa's Wedding"
              className="rounded-xl p-3 outline-pink-500"
            />
          </div>
          {eventName !== "" && (
            <button
              type="submit"
              className="mt-4 rounded-xl bg-pink-500 px-4 py-2 text-white"
            >
              Create a private social network for{" "}
              <span className="font-semibold">{eventName}</span>
            </button>
          )}
        </form>
      </article>
    </div>
  );
};

export default Create;
