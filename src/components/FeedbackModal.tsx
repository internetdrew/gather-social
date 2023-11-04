import React, {
  type ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { z } from "zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { api } from "~/utils/api";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface FormData {
  feedback: string;
}

export interface FeedbackModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const FeedbackModal: ForwardRefRenderFunction<FeedbackModalRef> = ({}, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const { mutate: submitFeedback } = api.feedback.create.useMutation({
    onSuccess: () => {
      reset();
      toast.success("Thanks. Your feedback has been sent!");
      closeModal();
    },
    onError: () => {
      toast.error("Trouble sending your feedback. Please try again later.");
    },
  });

  const openModal = () => {
    if (modalRef.current) modalRef.current.showModal();
  };

  const closeModal = () => {
    if (modalRef.current) modalRef.current.close();
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  const onSubmit: SubmitHandler<FormData> = (data) => {
    submitFeedback({ feedback: data.feedback });
  };

  const createFeedbackSchema = z.object({
    feedback: z.string().min(1, "Please leave feedback to submit."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(createFeedbackSchema),
  });

  return (
    <dialog
      ref={modalRef}
      className="w-[95%] rounded-2xl p-4 ring-1 ring-famous-black sm:w-1/2 lg:w-1/3 xl:w-1/4"
    >
      <div className="flex">
        <button
          className="ml-auto w-min rounded-md duration-300 hover:ring-1 hover:ring-slate-200"
          onClick={closeModal}
        >
          <XMarkIcon className="h-6 w-6 stroke-2" />
        </button>
      </div>
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="feedback" className="mb-2 text-center font-semibold">
          Share Your Thoughts
        </label>
        <textarea
          id="feedback"
          className="rounded-sm p-2 outline-pink-400 ring-1 ring-famous-black"
          placeholder="Tell us how we can improve your experience."
          {...register("feedback")}
        />
        {errors.feedback && (
          <small className="text-red-600">{errors.feedback.message}</small>
        )}
        <button
          className="btn-primary mt-2 rounded-sm font-semibold duration-300 hover:bg-pink-500"
          type="submit"
        >
          Submit
        </button>
      </form>
    </dialog>
  );
};

export default forwardRef(FeedbackModal);
