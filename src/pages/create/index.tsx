import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useEffect } from "react";

interface FormData {
  title: string;
  password: string;
  confirmPassword: string;
}

const Create = () => {
  const router = useRouter();
  const { data: tokenCount, isFetching } =
    api.tokens.getUserAvailableTokens.useQuery();

  useEffect(() => {
    if (tokenCount === 0) void router.push("/home");
  }, [tokenCount, router]);

  const createEventSchema = z
    .object({
      title: z
        .string()
        .min(5, "Your event title should be at least 5 characters long."),
      password: z
        .string()
        .min(14, "Password must be at least 14 characters long."),
      confirmPassword: z
        .string()
        .min(14, "Password must be at least 14 characters long."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Your passwords must match to create this event.",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createEventSchema),
  });

  const { mutate: createEvent, isLoading: isCreatingEvent } =
    api.events.create.useMutation({
      onSuccess: (data) => {
        if (data) void router.push("/home");
      },
      onError: () => {
        toast.error("Failed to create new event. Please try again later.");
      },
    });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createEvent({
      title: data.title,
      password: data.password,
    });

    reset();
  };

  const inputClasses =
    "rounded-xl p-3 outline-pink-400 ring-1 ring-famous-black";

  if (isFetching) return <div>Checking for available tokens...</div>;

  if (tokenCount)
    return (
      <main className="flex h-screen items-center justify-center">
        <form
          className="flex w-[90%] flex-col space-y-4 rounded-3xl bg-slate-100 p-8 shadow-2xl ring-1 ring-black sm:w-3/4 md:w-1/2 lg:w-1/3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-center text-xl font-semibold">
            Create your event
          </h1>
          <div className="flex flex-col space-y-1">
            <label htmlFor="title" className="font-semibold">
              Event Name
            </label>
            <input
              type="text"
              id="title"
              className={inputClasses}
              placeholder="Ex. Bob and Lisa's Wedding"
              {...register("title")}
            />
            {errors.title && (
              <small className="text-red-600">{errors?.title?.message}</small>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="password" className="font-semibold">
              Event Password
            </label>
            <input
              type="password"
              id="password"
              className={inputClasses}
              placeholder="Enter a password"
              {...register("password")}
            />
            {errors.password && (
              <small className="text-red-600">
                {errors?.password?.message}
              </small>
            )}
          </div>
          <div className="flex flex-col space-y-1">
            <label htmlFor="confirmPassword" className="font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={inputClasses}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <small className="text-red-600">
                {errors?.confirmPassword?.message}
              </small>
            )}
          </div>
          <button
            className="w-full rounded-xl bg-pink-400 px-4 py-2 font-semibold ring-1 ring-famous-black duration-300 hover:shadow-2xl disabled:bg-slate-200 disabled:hover:shadow-none"
            disabled={isCreatingEvent}
          >
            {isCreatingEvent ? "Creating..." : "Create this event"}
          </button>
        </form>
      </main>
    );
};

export default Create;
