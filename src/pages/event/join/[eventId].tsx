import { z } from "zod";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormData {
  password: string;
}

const JoinEventPage = () => {
  const router = useRouter();
  const eventId = router.query.eventId as string;

  const inputClasses =
    "rounded-xl p-3 outline-pink-400 ring-1 ring-famous-black";

  const { data: event } = api.events.getEventDetails.useQuery({
    eventId,
  });

  const { mutate: addNewEventGuest } = api.events.addNewGuest.useMutation({
    onSuccess: async () => {
      await router.push(`/event/feed/${eventId}`);
    },
    onError: () => {
      toast.error("Sorry, this password is invalid.");
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    addNewEventGuest({
      eventId,
      password: data.password,
    });

    reset();
  };

  const createEventSchema = z.object({
    password: z.string().min(1, "Please enter the event password."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
  });

  if (event)
    return (
      <main className="flex h-screen items-center justify-center">
        <form
          className="flex w-[90%] flex-col rounded-3xl bg-famous-white p-8 font-semibold shadow-2xl ring-1 ring-black sm:w-3/4 md:w-1/2 lg:w-1/3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="mb-0 text-center text-xl">{`You're invited to join ${event?.title}`}</h1>
          <p className="mb-2 text-center font-normal">
            Now all you need is the password.
          </p>
          <div className=" my-4 flex flex-col space-y-1">
            <label htmlFor="password">Event Password</label>
            <input
              type="password"
              className={inputClasses}
              {...register("password")}
            />
            {errors.password && (
              <small className="text-red-600">{errors.password.message}</small>
            )}
          </div>
          <button className="btn-primary rounded-xl">{`Join ${event?.title}`}</button>
        </form>
      </main>
    );
};

export default JoinEventPage;
