import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

const Create = () => {
  const router = useRouter();
  const [eventTitle, setEventTitle] = useState("");
  const [eventPassword, setEventPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { mutate: createEvent, isLoading: isCreating } =
    api.events.create.useMutation({
      onSuccess: (data) => {
        if (data) void router.push("/home");
      },
      onError: () => {
        toast.error("Failed to create new event. Please try again later.");
      },
    });

  const maxInputChars = 60;

  return (
    <div className="flex h-screen items-center justify-center">
      <form className="flex w-[90%] flex-col gap-4 rounded-3xl bg-slate-100 p-8 shadow-2xl ring-1 ring-black sm:w-3/4 md:w-1/2 lg:w-1/3">
        <div className="flex flex-col space-y-1">
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
            className="rounded-xl p-3 outline-pink-400"
            maxLength={maxInputChars}
            disabled={isCreating}
          />
          <small>{`Characters remaining: ${
            maxInputChars - eventTitle.length
          }`}</small>
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="password" className="font-semibold">
            Event Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={eventPassword}
            onChange={(e) => setEventPassword(e.target.value)}
            className="rounded-xl p-3 outline-pink-400"
            maxLength={maxInputChars}
            disabled={isCreating}
            placeholder="Enter a password"
          />
          <small>{`Characters remaining: ${
            maxInputChars - eventPassword.length
          }`}</small>
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="event-name" className="font-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            name="password2"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="rounded-xl p-3 outline-pink-400"
            maxLength={maxInputChars}
            disabled={isCreating}
            placeholder="Confirm your password"
          />
          <small>{`Characters remaining: ${
            maxInputChars - eventPassword.length
          }`}</small>
        </div>
        {eventTitle.length &&
        eventPassword.length &&
        eventPassword === password2 ? (
          <button
            className="w-full rounded-xl bg-pink-400 px-4 py-2 ring-1 ring-black duration-300 hover:shadow-2xl disabled:bg-slate-200 disabled:hover:shadow-none"
            onClick={() =>
              createEvent({ title: eventTitle.trim(), password: "" })
            }
          >
            Create a private social network for{" "}
            <span className="font-semibold">{eventTitle}</span>
          </button>
        ) : null}
      </form>
    </div>
  );
};

export default Create;
